import { useContext } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, ComposedChart, Line, Area, CartesianGrid, Cell } from "recharts";
import { format, subDays, isSameDay, startOfDay, getHours, startOfWeek, endOfWeek, isWithinInterval, differenceInMinutes } from "date-fns";
import { TaskContext } from "../context/TaskContext";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, TrendingUp, Flame, Activity } from "lucide-react";

const Analytics = () => {
    const { tasks } = useContext(TaskContext);

    // Helper: Calculate Cycle Time (Duration) in Minutes
    // Wall-clock time from Creation -> Completion
    const getTaskDuration = (task) => {
        if (!task.createdAt) return 0;

        // Use completedAt if available, otherwise fallback to updatedAt for legacy completed tasks
        const end = task.completedAt ? new Date(task.completedAt) : new Date(task.updatedAt);
        const start = new Date(task.createdAt);

        const diff = differenceInMinutes(end, start);
        return diff > 0 ? diff : 0; // Prevent negative if clocks skew
    };

    // --- Data Generation ---

    // 1. Weekly Data (Tasks & Time)
    const generateWeeklyData = () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = subDays(new Date(), i);
            const key = format(date, "EEE");

            // Tasks *Completed* on this day
            // We use filtered tasks that are Done and check their completion date
            const completedTasks = tasks.filter((t) => {
                if (t.status !== "done" && !t.completed) return false;
                const completionDate = t.completedAt ? new Date(t.completedAt) : new Date(t.updatedAt);
                return isSameDay(completionDate, date);
            });

            const completedCount = completedTasks.length;

            // Sum duration of tasks completed this day
            const totalDurationMinutes = completedTasks.reduce((acc, t) => acc + getTaskDuration(t), 0);

            data.push({
                day: key,
                tasks: completedCount,
                hours: parseFloat((totalDurationMinutes / 60).toFixed(1))
            });
        }
        return data;
    };

    // 2. Productive Hours (0-23)
    const generateHourlyData = () => {
        const hours = Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));
        tasks.forEach(task => {
            if (task.status === "done" || task.completed) {
                // Use completion time for heat map
                const completionDate = task.completedAt ? new Date(task.completedAt) : new Date(task.updatedAt);
                const h = getHours(completionDate);
                hours[h].count += 1;
            }
        });
        return hours.map(h => ({
            time: format(new Date().setHours(h.hour), "ha"), // "10am"
            val: h.count
        })).filter(h => h.val > 0);
    };

    // 3. Weekly Summary stats
    const getWeeklySummary = () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const end = endOfWeek(new Date(), { weekStartsOn: 1 });

        // Filter tasks completed this week
        const thisWeeksCompletedTasks = tasks.filter(t => {
            if (t.status !== "done" && !t.completed) return false;
            const completionDate = t.completedAt ? new Date(t.completedAt) : new Date(t.updatedAt);
            return isWithinInterval(completionDate, { start, end });
        });

        const completed = thisWeeksCompletedTasks.length;
        const totalMinutes = thisWeeksCompletedTasks.reduce((acc, t) => acc + getTaskDuration(t), 0);

        return {
            completed,
            hours: (totalMinutes / 60).toFixed(1),
            avgTime: completed ? Math.round(totalMinutes / completed) : 0
        };
    };

    // 4. Streak Calculation
    const calculateCurrentStreak = () => {
        let streak = 0;
        const today = startOfDay(new Date());
        for (let i = 0; i < 365; i++) {
            const date = subDays(today, i);
            const hasActivity = tasks.some(
                (t) => {
                    if (t.status !== "done" && !t.completed) return false;
                    // Check if completed on this date
                    const completionDate = t.completedAt ? new Date(t.completedAt) : new Date(t.updatedAt);
                    return isSameDay(completionDate, date);
                }
            );
            if (hasActivity) streak++;
            else if (i === 0 && !hasActivity) continue;
            else break;
        }
        return streak;
    };

    const weeklyData = generateWeeklyData();
    const hourlyData = generateHourlyData();
    const summary = getWeeklySummary();
    const currentStreak = calculateCurrentStreak();

    // --- Animations ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    // --- Custom Tooltip ---
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[var(--bg-card)] p-3 border border-[var(--border-color)] rounded-xl shadow-xl backdrop-blur-md bg-opacity-90">
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            className="space-y-6 pb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {/* Completed Tasks - Indigo Gradient */}
                <motion.div variants={itemVariants} className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 group hover:scale-[1.02] transition-transform">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-medium">Weekly Tasks</span>
                        </div>
                        <div className="text-4xl font-bold tracking-tight">{summary.completed}</div>
                    </div>
                    <CheckCircle2 className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </motion.div>

                {/* Hours Logged - Emerald/Teal Gradient */}
                <motion.div variants={itemVariants} className="relative overflow-hidden p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm group hover:border-emerald-500/30 hover:shadow-emerald-500/10 transition-all">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                            <Clock size={18} className="text-emerald-500" />
                            <span className="text-sm font-medium">Cycle Time (Hrs)</span>
                        </div>
                        <div className="text-3xl font-bold text-[var(--text-primary)]">{summary.hours}<span className="text-lg text-[var(--text-secondary)] font-normal ml-1">h</span></div>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-emerald-500/10"></div>
                </motion.div>

                {/* Avg Time - Orange/Amber */}
                <motion.div variants={itemVariants} className="relative overflow-hidden p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm group hover:border-orange-500/30 hover:shadow-orange-500/10 transition-all">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-[var(--text-secondary)]">
                            <Activity size={18} className="text-orange-500" />
                            <span className="text-sm font-medium">Avg Cycle/Task</span>
                        </div>
                        <div className="text-3xl font-bold text-[var(--text-primary)]">{summary.avgTime}<span className="text-lg text-[var(--text-secondary)] font-normal ml-1">m</span></div>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-orange-500/10"></div>
                </motion.div>

                {/* Streak - Fire Gradient */}
                <motion.div variants={itemVariants} className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg shadow-orange-500/20 group hover:scale-[1.02] transition-transform">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <Flame size={18} className="fill-current" />
                            <span className="text-sm font-medium">Current Streak</span>
                        </div>
                        <div className="text-4xl font-bold tracking-tight">{currentStreak}</div>
                    </div>
                    <Flame className="absolute -right-2 -bottom-2 opacity-15 w-32 h-32 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Efficiency Chart */}
                <motion.div variants={itemVariants} className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Productivity Trend</h3>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    dy={10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-surface)', opacity: 0.5 }} />

                                <Area
                                    type="monotone"
                                    dataKey="tasks"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTasks)"
                                    name="Completed Tasks"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="hours"
                                    stroke="#f43f5e"
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, fill: "var(--bg-card)", stroke: "#f43f5e" }}
                                    activeDot={{ r: 6 }}
                                    name="Cycle Hours"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Hourly Activity Chart */}
                <motion.div variants={itemVariants} className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Clock size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Activity by Hour</h3>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hourlyData.length > 0 ? hourlyData : [{ time: 'No Data', val: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                                <XAxis
                                    dataKey="time"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                                    dy={10}
                                    interval={0}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-surface)', opacity: 0.5 }} />
                                <Bar
                                    dataKey="val"
                                    fill="#10b981"
                                    radius={[8, 8, 8, 8]}
                                    barSize={20}
                                    name="Tasks"
                                >
                                    {hourlyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#34d399'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Analytics;
