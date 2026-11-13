import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import * as taskApi from "../api/taskApi";
import { Bell, AlertTriangle, Clock } from "lucide-react";

const NotificationsBell = ({ isCollapsed, onOpenTask }) => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [overdue, setOverdue] = useState([]);
    const [dueToday, setDueToday] = useState([]);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;

        const load = async () => {
            try {
                const [overdueRes, todayRes] = await Promise.all([
                    taskApi.getTasks(user.token, { filter: "overdue", limit: 10 }),
                    taskApi.getTasks(user.token, { filter: "today", limit: 10 }),
                ]);
                if (!cancelled) {
                    setOverdue(overdueRes.data.tasks);
                    setDueToday(todayRes.data.tasks);
                }
            } catch (err) {
                console.error("Failed to load notifications", err);
            }
        };

        load();
        // Refresh periodically so overdue/due-today counts stay accurate during a long session.
        const interval = setInterval(load, 60000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [user]);

    const count = overdue.length + dueToday.length;

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen((o) => !o)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] ${isCollapsed ? "justify-center" : ""
                    }`}
                title="Notifications"
            >
                <span className="relative shrink-0">
                    <Bell size={20} />
                    {count > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                            {count > 9 ? "9+" : count}
                        </span>
                    )}
                </span>
                {!isCollapsed && <span className="text-sm font-medium">Notifications</span>}
            </button>

            {isOpen && (
                <div
                    className={`absolute z-50 top-full mt-1 ${isCollapsed ? "left-0" : "left-0 right-0"
                        } w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl max-h-96 overflow-y-auto`}
                >
                    {count === 0 ? (
                        <p className="text-sm text-[var(--text-tertiary)] text-center py-8">You&apos;re all caught up.</p>
                    ) : (
                        <div className="p-2 space-y-1">
                            {overdue.map((t) => (
                                <button
                                    key={t._id}
                                    onClick={() => {
                                        onOpenTask(t);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-surface)] text-left transition-colors"
                                >
                                    <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-[var(--text-primary)] truncate">{t.title}</p>
                                        <p className="text-xs text-red-500">Overdue</p>
                                    </div>
                                </button>
                            ))}
                            {dueToday.map((t) => (
                                <button
                                    key={t._id}
                                    onClick={() => {
                                        onOpenTask(t);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-surface)] text-left transition-colors"
                                >
                                    <Clock size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-[var(--text-primary)] truncate">{t.title}</p>
                                        <p className="text-xs text-[var(--text-tertiary)]">Due today</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsBell;
