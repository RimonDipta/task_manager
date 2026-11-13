import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";
import * as taskApi from "../api/taskApi";
import { format, isToday, isYesterday } from "date-fns";
import { CheckCircle2, PlusCircle } from "lucide-react";

const dateLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
};

const ActivityHistory = () => {
    usePageTitle("Activity - Doora");
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                const res = await taskApi.getTasks(user.token, { filter: "all", limit: 500 });
                if (!cancelled) setTasks(res.data.tasks);
            } catch (err) {
                console.error("Failed to load activity", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [user]);

    const events = useMemo(() => {
        const list = [];
        tasks.forEach((t) => {
            if (t.createdAt) {
                list.push({ id: `${t._id}_created`, type: "created", task: t, date: new Date(t.createdAt) });
            }
            if (t.completedAt) {
                list.push({ id: `${t._id}_completed`, type: "completed", task: t, date: new Date(t.completedAt) });
            }
        });
        return list.sort((a, b) => b.date - a.date);
    }, [tasks]);

    const grouped = useMemo(() => {
        const map = new Map();
        events.forEach((e) => {
            const key = dateLabel(e.date);
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(e);
        });
        return map;
    }, [events]);

    return (
        <div className="p-6 space-y-8 max-w-3xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Activity History</h1>
                <p className="text-[var(--text-secondary)] mt-1">A timeline of what's happened across your tasks.</p>
            </div>

            {loading ? (
                <p className="text-sm text-[var(--text-tertiary)]">Loading activity...</p>
            ) : events.length === 0 ? (
                <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border-color)]">
                    <p className="text-[var(--text-secondary)] font-medium">No activity yet</p>
                </div>
            ) : (
                Array.from(grouped.entries()).map(([label, items]) => (
                    <div key={label} className="space-y-3">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">{label}</h2>
                        <div className="space-y-2">
                            {items.map((e) => (
                                <div
                                    key={e.id}
                                    className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3"
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${e.type === "completed"
                                            ? "bg-emerald-500/10 text-emerald-600"
                                            : "bg-indigo-500/10 text-indigo-600"
                                            }`}
                                    >
                                        {e.type === "completed" ? <CheckCircle2 size={16} /> : <PlusCircle size={16} />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-[var(--text-primary)] truncate">
                                            {e.type === "completed" ? "Completed" : "Created"}{" "}
                                            <span className="font-medium">{e.task.title}</span>
                                        </p>
                                        <p className="text-xs text-[var(--text-tertiary)]">{format(e.date, "h:mm a")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ActivityHistory;
