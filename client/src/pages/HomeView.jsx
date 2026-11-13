import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";
import TaskList from "../components/TaskList";
import TaskSkeleton from "../components/TaskSkeleton";
import Analytics from "../components/Analytics";
import AddProjectModal from "../components/AddProjectModal";
import * as taskApi from "../api/taskApi";
import { format } from "date-fns";
import {
    ListChecks,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Plus,
    FolderPlus,
    Kanban,
    BarChart3,
} from "lucide-react";

const HomeView = () => {
    const { user } = useContext(AuthContext);
    const { addProject } = useContext(TaskContext);
    const navigate = useNavigate();
    const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

    // Greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    // Real overview counts, pulled from the server (never fabricated client-side totals).
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;

        const loadStats = async () => {
            setStatsLoading(true);
            try {
                // limit: 1 keeps the payload tiny — we only read `total` from each response.
                const [all, completed, overdue, inProgress] = await Promise.all([
                    taskApi.getTasks(user.token, { filter: "all", limit: 1 }),
                    taskApi.getTasks(user.token, { filter: "completed", limit: 1 }),
                    taskApi.getTasks(user.token, { filter: "overdue", limit: 1 }),
                    taskApi.getTasks(user.token, { filter: "in_progress", limit: 1 }),
                ]);

                if (cancelled) return;

                const total = all.data.total || 0;
                const completedCount = completed.data.total || 0;

                setStats({
                    total,
                    completed: completedCount,
                    pending: Math.max(total - completedCount, 0),
                    overdue: overdue.data.total || 0,
                    inProgress: inProgress.data.total || 0,
                });
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                if (!cancelled) setStatsLoading(false);
            }
        };

        loadStats();
        return () => {
            cancelled = true;
        };
    }, [user]);

    // "Top Priorities": overdue tasks first, then due-today tasks, then any
    // other P1 task, then everything else — soonest due date wins ties.
    // This page keeps its own list (not TaskContext's) since nothing else
    // on Home ever populates the shared context list.
    const [topTasks, setTopTasks] = useState([]);
    const [topTasksLoading, setTopTasksLoading] = useState(true);

    const rankTask = (task) => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const due = task.dueDate ? new Date(task.dueDate) : null;

        let bucket = 3; // everything else
        if (due && due < todayStart) bucket = 0; // overdue
        else if (due && due >= todayStart && due <= todayEnd) bucket = 1; // due today
        else if (task.priority === "p1") bucket = 2; // upcoming, urgent

        const priorityRank = { p1: 0, p2: 1, p3: 2, p4: 3 }[task.priority] ?? 3;
        return { bucket, priorityRank, due };
    };

    useEffect(() => {
        if (!user) return;
        let cancelled = false;

        const loadTopTasks = async () => {
            setTopTasksLoading(true);
            try {
                const res = await taskApi.getTasks(user.token, { filter: "active", limit: 100 });
                if (cancelled) return;

                const ranked = res.data.tasks
                    .map((task) => ({ task, ...rankTask(task) }))
                    .sort((a, b) => {
                        if (a.bucket !== b.bucket) return a.bucket - b.bucket;
                        if (a.priorityRank !== b.priorityRank) return a.priorityRank - b.priorityRank;
                        if (a.due && b.due) return a.due - b.due;
                        if (a.due) return -1;
                        if (b.due) return 1;
                        return 0;
                    })
                    .slice(0, 3)
                    .map((r) => r.task);

                setTopTasks(ranked);
            } catch (err) {
                console.error("Failed to load top priority tasks", err);
            } finally {
                if (!cancelled) setTopTasksLoading(false);
            }
        };

        loadTopTasks();
        return () => {
            cancelled = true;
        };
    }, [user]);

    const handleTopTaskUpdate = async (id, data) => {
        try {
            const res = await taskApi.updateTask(id, data, user.token);
            setTopTasks((prev) => {
                // A completed task no longer belongs in an "active tasks" list.
                if (data.completed) return prev.filter((t) => t._id !== id);
                return prev.map((t) => (t._id === id ? res.data : t));
            });
            return res.data;
        } catch (err) {
            console.error("Failed to update task", err);
        }
    };

    const handleTopTaskDelete = async (id) => {
        try {
            setTopTasks((prev) => prev.filter((t) => t._id !== id));
            await taskApi.deleteTask(id, user.token);
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    const statCards = [
        { label: "Total Tasks", value: stats?.total, icon: ListChecks, tone: "text-indigo-500 bg-indigo-500/10" },
        { label: "In Progress", value: stats?.inProgress, icon: Clock, tone: "text-amber-500 bg-amber-500/10" },
        { label: "Completed", value: stats?.completed, icon: CheckCircle2, tone: "text-emerald-500 bg-emerald-500/10" },
        { label: "Overdue", value: stats?.overdue, icon: AlertTriangle, tone: "text-red-500 bg-red-500/10" },
    ];

    const quickActions = [
        { label: "New Task", icon: Plus, onClick: () => navigate("/dashboard/today") },
        { label: "New Project", icon: FolderPlus, onClick: () => setIsAddProjectOpen(true) },
        { label: "Kanban Board", icon: Kanban, onClick: () => navigate("/dashboard/kanban") },
        { label: "Analytics", icon: BarChart3, onClick: () => navigate("/dashboard/analytics") },
    ];

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                    {greeting}, {user?.name?.split(' ')[0] || "there"}!
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    Here's what's happening today, {format(new Date(), "EEEE, MMMM do")}.
                </p>
            </div>

            {/* Overview Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-3"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.tone}`}>
                                <Icon size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums leading-tight">
                                    {statsLoading ? (
                                        <span className="inline-block h-6 w-8 bg-[var(--bg-surface)] rounded animate-pulse" />
                                    ) : (
                                        card.value ?? 0
                                    )}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] truncate">{card.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.label}
                            onClick={action.onClick}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--primary-color)] transition-colors"
                        >
                            <Icon size={15} />
                            {action.label}
                        </button>
                    );
                })}
            </div>

            <div className="space-y-8">

                {/* Top: Critical Tasks (Limit 3) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Your Top Priorities</h2>
                        {/* Link to full list */}
                        <a href="/dashboard/today" className="text-sm text-[var(--primary-color)] hover:underline">View all</a>
                    </div>

                    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden p-4">
                        {topTasksLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => <TaskSkeleton key={i} />)}
                            </div>
                        ) : topTasks.length === 0 ? (
                            <p className="text-sm text-[var(--text-tertiary)] text-center py-6">
                                Nothing urgent — you&apos;re all caught up.
                            </p>
                        ) : (
                            <TaskList
                                tasks={topTasks}
                                embedded={true}
                                onUpdate={handleTopTaskUpdate}
                                onDelete={handleTopTaskDelete}
                            />
                        )}
                    </div>
                </div>

                {/* Bottom: Analytics */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Insights</h2>
                    <Analytics />
                </div>

            </div>

            <AddProjectModal
                isOpen={isAddProjectOpen}
                onClose={() => setIsAddProjectOpen(false)}
                onCreate={addProject}
            />
        </div>
    );
};

export default HomeView;
