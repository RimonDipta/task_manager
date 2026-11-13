import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useToast } from "./ToastContext";
import * as taskApi from "../api/taskApi";

export const FocusContext = createContext();

const DURATIONS = { focus: 25 * 60, break: 5 * 60 };
const STORAGE_KEY = "doora_focus_session";

const readStoredSession = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const FocusProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const { showToast } = useToast();

    // Mounted inside Layout, so this state (and the interval below) lives for
    // as long as the user stays in the dashboard shell, surviving route changes.
    const [focusState, setFocusState] = useState(readStoredSession);
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        try {
            if (focusState) localStorage.setItem(STORAGE_KEY, JSON.stringify(focusState));
            else localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Storage can be unavailable (private mode, quota); the timer still works in-memory.
        }
    }, [focusState]);

    useEffect(() => {
        if (!focusState || !focusState.isRunning) return;

        const completePhase = () => {
            if (focusState.mode === "focus") {
                if (focusState.activeTask && user) {
                    const spentMinutes = Math.round(DURATIONS.focus / 60);
                    taskApi
                        .updateTask(
                            focusState.activeTask._id,
                            { timeSpent: (focusState.activeTask.timeSpent || 0) + spentMinutes },
                            user.token
                        )
                        .catch((err) => console.error("Failed to log focus time", err));
                }
                showToast("Focus session complete. Take a short break!", "success");
                setFocusState({
                    activeTask: focusState.activeTask,
                    mode: "break",
                    endAt: Date.now() + DURATIONS.break * 1000,
                    isRunning: true,
                    remainingWhenPaused: null,
                });
            } else {
                showToast("Break's over. Ready for another round?", "info");
                setFocusState(null);
            }
        };

        const tick = () => {
            const remaining = Math.max(0, Math.round((focusState.endAt - Date.now()) / 1000));
            setSecondsLeft(remaining);
            if (remaining <= 0) completePhase();
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [focusState, user, showToast]);

    const startFocus = (task = null) => {
        setFocusState({
            activeTask: task,
            mode: "focus",
            endAt: Date.now() + DURATIONS.focus * 1000,
            isRunning: true,
            remainingWhenPaused: null,
        });
    };

    const pauseFocus = () => {
        setFocusState((prev) => {
            if (!prev || !prev.isRunning) return prev;
            return {
                ...prev,
                isRunning: false,
                remainingWhenPaused: Math.max(0, Math.round((prev.endAt - Date.now()) / 1000)),
            };
        });
    };

    const resumeFocus = () => {
        setFocusState((prev) => {
            if (!prev || prev.isRunning) return prev;
            return {
                ...prev,
                isRunning: true,
                endAt: Date.now() + (prev.remainingWhenPaused || 0) * 1000,
                remainingWhenPaused: null,
            };
        });
    };

    const stopFocus = () => setFocusState(null);

    return (
        <FocusContext.Provider
            value={{ focusState, secondsLeft, startFocus, pauseFocus, resumeFocus, stopFocus }}
        >
            {children}
        </FocusContext.Provider>
    );
};
