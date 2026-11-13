import { useContext, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";
import * as taskApi from "../api/taskApi";
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addMonths,
    subMonths,
    format,
    isSameMonth,
    isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getWeekStartsOnMonday } from "../utils/preferences";

const CalendarView = () => {
    usePageTitle("Calendar - Doora");
    const { user } = useContext(AuthContext);
    const { openTaskModal } = useOutletContext() || {};
    const [monthCursor, setMonthCursor] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    // Read fresh on every mount so a change made in Settings takes effect
    // immediately when this page is revisited, without a full reload.
    const weekStartsOn = getWeekStartsOnMonday() ? 1 : 0;
    const weekdays = weekStartsOn === 1
        ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    useEffect(() => {
        if (!user) return;
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const res = await taskApi.getTasks(user.token, { filter: "all", limit: 500 });
                if (!cancelled) setTasks(res.data.tasks);
            } catch (err) {
                console.error("Failed to load tasks for calendar view", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [user]);

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(monthCursor), { weekStartsOn });
        const end = endOfWeek(endOfMonth(monthCursor), { weekStartsOn });
        return eachDayOfInterval({ start, end });
    }, [monthCursor, weekStartsOn]);

    const tasksByDay = useMemo(() => {
        const map = new Map();
        tasks.forEach((t) => {
            if (!t.dueDate) return;
            const key = format(new Date(t.dueDate), "yyyy-MM-dd");
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(t);
        });
        return map;
    }, [tasks]);

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Calendar</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Tasks by due date.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMonthCursor((d) => subMonths(d, 1))}
                        className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                        title="Previous month"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-semibold text-[var(--text-primary)] min-w-[130px] text-center">
                        {format(monthCursor, "MMMM yyyy")}
                    </span>
                    <button
                        onClick={() => setMonthCursor((d) => addMonths(d, 1))}
                        className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                        title="Next month"
                    >
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={() => setMonthCursor(new Date())}
                        className="px-3 py-2 rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                    >
                        Today
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide px-1">
                {weekdays.map((d) => (
                    <div key={d} className="py-2 text-center">{d}</div>
                ))}
            </div>

            <div className={`grid grid-cols-7 gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-xl overflow-hidden transition-opacity ${loading ? "opacity-60" : ""}`}>
                {days.map((day) => {
                    const key = format(day, "yyyy-MM-dd");
                    const dayTasks = tasksByDay.get(key) || [];
                    const inMonth = isSameMonth(day, monthCursor);
                    return (
                        <div
                            key={key}
                            className={`min-h-[110px] p-2 bg-[var(--bg-card)] flex flex-col gap-1 ${inMonth ? "" : "opacity-40"}`}
                        >
                            <span
                                className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday(day) ? "bg-[var(--primary-color)] text-white" : "text-[var(--text-secondary)]"
                                    }`}
                            >
                                {format(day, "d")}
                            </span>
                            <div className="flex-1 space-y-1 overflow-hidden">
                                {dayTasks.slice(0, 3).map((task) => (
                                    <button
                                        key={task._id}
                                        onClick={() => openTaskModal && openTaskModal(task)}
                                        title={task.title}
                                        className={`w-full text-left text-[11px] px-1.5 py-0.5 rounded truncate transition-colors ${task.completed
                                                ? "bg-[var(--bg-surface)] text-[var(--text-tertiary)] line-through"
                                                : task.priority === "p1"
                                                    ? "bg-red-500/10 text-red-600"
                                                    : task.priority === "p2"
                                                        ? "bg-amber-500/10 text-amber-600"
                                                        : "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
                                            }`}
                                    >
                                        {task.title}
                                    </button>
                                ))}
                                {dayTasks.length > 3 && (
                                    <p className="text-[10px] text-[var(--text-tertiary)] pl-1">+{dayTasks.length - 3} more</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
