import { useContext } from "react";
import { Flag, Calendar, AlertCircle, Check, Play, Pause } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import TimeTracker from "./TimeTracker";

const TaskCard = ({ task }) => {
    const { openTaskModal } = useOutletContext() || {};

    const priorityColors = {
        p1: "text-red-600 bg-red-50 border-red-100",
        p2: "text-amber-600 bg-amber-50 border-amber-100",
        p3: "text-green-600 bg-green-50 border-green-100",
        p4: "text-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
    };

    const priorityLabel = {
        p1: "High",
        p2: "Medium",
        p3: "Low",
        p4: "None"
    };

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    return (
        <div
            onClick={() => openTaskModal && openTaskModal(task)}
            className="group relative bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col hover:border-indigo-500/30"
        >
            {/* Priority Stripe */}
            <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${task.priority === 'p1' ? "bg-red-500" :
                    task.priority === 'p2' ? "bg-amber-500" :
                        task.priority === 'p3' ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                }`} />

            <div className="pl-3 flex-1 flex flex-col">
                {/* Header: Priority & Date */}
                <div className="flex justify-between items-center mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors.p4}`}>
                        {priorityLabel[task.priority]}
                    </span>

                    {task.dueDate && (
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${isOverdue ? "text-red-600" : "text-[var(--text-tertiary)]"}`}>
                            {isOverdue && <AlertCircle size={12} className="text-red-500" />}
                            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h4 className={`text-base font-semibold text-[var(--text-primary)] mb-2 leading-snug ${task.completed ? "line-through opacity-60" : ""}`}>
                    {task.title}
                </h4>

                {/* Description Preview (Optional) */}
                {task.description && (
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4 flex-1">
                        {task.description}
                    </p>
                )}

                {/* Footer */}
                <div className="mt-auto pt-3 border-t border-[var(--border-color)]/50 flex items-center justify-between gap-2">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                        {task.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] bg-[var(--bg-surface)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Timer */}
                    {!task.completed && (
                        <div className="scale-90 origin-right">
                            <TimeTracker task={task} compact />
                        </div>
                    )}
                    {task.completed && (
                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full border border-green-100">
                            <Check size={12} />
                            <span>Done</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
