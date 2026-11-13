import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "../components/TaskItem";
import TaskSkeleton from "../components/TaskSkeleton";
import usePageTitle from "../hooks/usePageTitle";
import * as taskApi from "../api/taskApi";
import { Flag } from "lucide-react";

const PRIORITIES = [
    { key: "p1", label: "Urgent", flagClass: "fill-red-500 text-red-600" },
    { key: "p2", label: "High", flagClass: "fill-amber-500 text-amber-600" },
    { key: "p3", label: "Medium", flagClass: "fill-green-500 text-green-600" },
    { key: "p4", label: "Low", flagClass: "text-slate-400" },
];

const PriorityView = () => {
    usePageTitle("Priority - Doora");
    const { user } = useContext(AuthContext);
    const { updateTask, removeTask } = useContext(TaskContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                // A generous limit keeps every open task visible without a second
                // pagination UI, matching this view's "see everything at a glance" purpose.
                const res = await taskApi.getTasks(user.token, { filter: "active", limit: 500 });
                if (!cancelled) setTasks(res.data.tasks);
            } catch (err) {
                console.error("Failed to load tasks for priority view", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [user]);

    const grouped = useMemo(() => {
        const map = { p1: [], p2: [], p3: [], p4: [] };
        tasks.forEach((t) => {
            const key = map[t.priority] ? t.priority : "p4";
            map[key].push(t);
        });
        return map;
    }, [tasks]);

    const handleUpdate = async (id, data) => {
        const updated = await updateTask(id, data);
        setTasks((prev) => {
            if (data.completed) return prev.filter((t) => t._id !== id);
            return prev.map((t) => (t._id === id ? { ...t, ...data } : t));
        });
        return updated;
    };

    const handleDelete = async (id) => {
        await removeTask(id);
        setTasks((prev) => prev.filter((t) => t._id !== id));
    };

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Priority View</h1>
                <p className="text-[var(--text-secondary)] mt-1">Your open tasks, grouped by priority.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => <TaskSkeleton key={i} />)}
                </div>
            ) : (
                PRIORITIES.map(({ key, label, flagClass }) => (
                    <div key={key} className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Flag size={16} className={flagClass} />
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]">{label}</h2>
                            <span className="text-xs text-[var(--text-tertiary)]">{grouped[key].length}</span>
                        </div>
                        {grouped[key].length === 0 ? (
                            <p className="text-sm text-[var(--text-tertiary)] italic pl-1">No tasks</p>
                        ) : (
                            <div className="space-y-3">
                                {grouped[key].map((task) => (
                                    <TaskItem key={task._id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default PriorityView;
