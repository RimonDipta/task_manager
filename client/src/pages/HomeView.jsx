import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";
import TaskList from "../components/TaskList";
import Analytics from "../components/Analytics";
import { format } from "date-fns";

const HomeView = () => {
    const { user } = useContext(AuthContext);
    const { tasks } = useContext(TaskContext);

    // Greeting based on time
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                    {greeting}, {user?.name?.split(' ')[0] || "there"}! 👋
                </h1>
                <p className="text-[var(--text-secondary)] mt-1">
                    Here's what's happening today, {format(new Date(), "EEEE, MMMM do")}.
                </p>
            </div>

            <div className="space-y-8">

                {/* Top: Critical Tasks (Limit 3) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Your Top Priorities</h2>
                        {/* Link to full list */}
                        <a href="/dashboard/today" className="text-sm text-[var(--primary-color)] hover:underline">View all</a>
                    </div>

                    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                        {/* Show top 3 tasks (Today + Overdue, sorted by Priority) */}
                        <TaskList filterType="today" embedded={true} limit={3} />
                    </div>
                </div>

                {/* Bottom: Analytics */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Insights</h2>
                    <Analytics />
                </div>

            </div>
        </div>
    );
};

export default HomeView;
