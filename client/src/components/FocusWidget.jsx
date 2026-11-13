import { useContext } from "react";
import { FocusContext } from "../context/FocusContext";
import { Pause, Play, Square, Brain, Coffee } from "lucide-react";

const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

const FocusWidget = () => {
    const { focusState, secondsLeft, pauseFocus, resumeFocus, stopFocus } = useContext(FocusContext);

    if (!focusState) return null;

    const isBreak = focusState.mode === "break";

    return (
        <div
            className={`fixed bottom-8 left-8 z-40 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border animate-in fade-in slide-in-from-bottom-4 duration-300 ${isBreak
                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800"
                : "bg-[var(--bg-card)] border-[var(--border-color)]"
                }`}
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isBreak ? "bg-emerald-500/15 text-emerald-600" : "bg-indigo-500/15 text-indigo-600"
                }`}>
                {isBreak ? <Coffee size={18} /> : <Brain size={18} />}
            </div>

            <div className="min-w-0">
                <p className="text-sm font-bold tabular-nums text-[var(--text-primary)] leading-tight">
                    {formatTime(secondsLeft)}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate max-w-[160px]">
                    {isBreak ? "Break time" : focusState.activeTask ? focusState.activeTask.title : "Focus session"}
                </p>
            </div>

            <div className="flex items-center gap-1 ml-1">
                {focusState.isRunning ? (
                    <button
                        onClick={pauseFocus}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                        title="Pause"
                    >
                        <Pause size={16} />
                    </button>
                ) : (
                    <button
                        onClick={resumeFocus}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                        title="Resume"
                    >
                        <Play size={16} />
                    </button>
                )}
                <button
                    onClick={stopFocus}
                    className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="End session"
                >
                    <Square size={14} />
                </button>
            </div>
        </div>
    );
};

export default FocusWidget;
