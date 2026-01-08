import { useContext } from "react";
import { useContext } from "react";
import { Flag, Calendar, Clock, AlertCircle, CheckSquare } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import TimeTracker from "./TimeTracker";

const KanbanTaskCard = ({ task, provided, snapshot }) => {
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

    return (
        <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => openTaskModal && openTaskModal(task)}
            style={{ ...provided.draggableProps.style }}
            className={`
        relative group bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border-color)] mb-3 transition-all duration-200 cursor-grab active:cursor-grabbing hover:border-indigo-300 dark:hover:border-indigo-700/50
        ${snapshot.isDragging ? "shadow-2xl rotate-2 scale-[1.02] ring-2 ring-indigo-500/20 z-50" : "shadow-sm hover:shadow-md"}
      `}
        >
            {/* Priority Stripe */}
            <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${task.priority === 'p1' ? "bg-red-500" :
                task.priority === 'p2' ? "bg-amber-500" :
                    task.priority === 'p3' ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"
                }`} />

            <div className="pl-3">
                {/* Header: Priority Badge & Date */}
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors.p4}`}>
                        {priorityLabel[task.priority]}
                    </span>

                    {task.dueDate && (
                        <div className={`flex items-center gap-1 text-[10px] font-medium ${new Date(task.dueDate) < new Date() && !task.completed ? "text-red-500" : "text-[var(--text-tertiary)]"
                            }`}>
                            {new Date(task.dueDate) < new Date() && !task.completed && <AlertCircle size={10} />}
                            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h4 className={`text-sm font-semibold text-[var(--text-primary)] mb-1 leading-snug ${task.completed ? "line-through opacity-60" : ""}`}>
                    {task.title}
                </h4>
                {task.project && (
                    <div className="mb-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded text-indigo-600 bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                            {typeof task.project === 'object' ? `@${task.project.name}` : ''}
                        </span>
                    </div>
                )}

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] bg-[var(--bg-surface)] text-[var(--text-secondary)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                                {tag}
                            </span>
                        ))}
                        {task.tags.length > 2 && (
                            <span className="text-[10px] text-[var(--text-tertiary)] self-center">+{task.tags.length - 2}</span>
                        )}
                    </div>
                )}

                {/* Footer: Timer & Meta */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-color)]/50">
                    {/* Timer */}
                    <div className="scale-90 origin-left -ml-1">
                        {!task.completed && <TimeTracker task={task} compact />}
                    </div>

                    {/* Placeholder for Assignee Avatar if needed, or just a generic icon */}
                    {/* <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                 ME
             </div> */}
                    {/* Subtask Info in Footer */}
                    {task.subtasks && task.subtasks.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                            <CheckSquare size={10} />
                            <span>{task.subtasks.filter(t => t.completed).length}/{task.subtasks.length}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KanbanTaskCard;
