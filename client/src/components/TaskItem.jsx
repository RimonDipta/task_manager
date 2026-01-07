import { useContext, useState, useRef, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import useSound from "../hooks/useSound";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Circle, Flag, Edit2, Calendar, MoreHorizontal, Tag, X } from "lucide-react";
import DatePopover from "./DatePopover";
import PriorityLabelPopover from "./PriorityLabelPopover";

const TaskItem = ({ task }) => {
  const { updateTask, removeTask } = useContext(TaskContext);
  const { openTaskModal } = useOutletContext() || {}; // Access global modal opener
  const playSound = useSound();

  const [activePopover, setActivePopover] = useState(null); // 'date', 'more'
  const dateRef = useRef(null);
  const moreRef = useRef(null);

  const handleToggleComplete = () => {
    if (!task.completed) playSound("success");
    updateTask(task._id, { completed: !task.completed });
  };

  // Click Outside to close popovers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        if (activePopover === 'date') setActivePopover(null);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        // For 'more', the popover is inside. If click is outside ref, close.
        // Note: PriorityLabelPopover might handle its own clicks.
        if (activePopover === 'more') setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopover]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group flex items-start gap-3 p-4 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm transition-all hover:shadow-md relative"
    >
      {/* Priority/Completion Circle */}
      <button
        onClick={handleToggleComplete}
        className={`mt-1 flex-shrink-0 transition-colors ${task.completed ? "text-slate-400" :
          task.priority === 'p1' ? "text-red-500 hover:text-red-600" :
            task.priority === 'p2' ? "text-amber-500 hover:text-amber-600" :
              task.priority === 'p3' ? "text-green-500 hover:text-green-600" :
                "text-slate-400 hover:text-slate-500"
          }`}
      >
        {task.completed ? <Check size={22} className="stroke-2" /> : <Circle size={22} className="stroke-2" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5 cursor-pointer" onClick={() => openTaskModal && openTaskModal(task)}>

        {/* Title */}
        <div className="flex items-center gap-2">
          <h3 className={`text-base font-semibold leading-tight text-[var(--text-primary)] ${task.completed ? "line-through text-[var(--text-tertiary)]" : ""}`}>
            {task.title}
          </h3>
          {task.priority && task.priority !== 'p4' && (
            <Flag size={14} className={
              task.priority === 'p1' ? "fill-red-500 text-red-600" :
                task.priority === 'p2' ? "fill-amber-500 text-amber-600" :
                  task.priority === 'p3' ? "fill-green-500 text-green-600" :
                    "text-[var(--text-tertiary)]"
            } />
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Labels & Meta */}
        <div className="flex items-center gap-3 pt-1 flex-wrap">

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${new Date(task.dueDate) < new Date() && !task.completed ? "text-red-500 font-medium" : "text-[var(--text-tertiary)]"
              }`}>
              <Calendar size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}

          {/* Labels */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
              <Tag size={12} />
              <span>{task.tags.join(', ')}</span>
            </div>
          )}
        </div>

      </div>

      {/* Action Icons (Visible on Hover) */}
      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-start">

        <button
          className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--primary-color)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
          title="Edit Task"
          onClick={() => openTaskModal && openTaskModal(task)}
        >
          <Edit2 size={16} />
        </button>

        {/* Calendar With Inline Popover */}
        <div className="relative" ref={dateRef}>
          <button
            className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
            title="Change Date"
            onClick={() => setActivePopover(activePopover === 'date' ? null : 'date')}
          >
            <Calendar size={16} />
          </button>
          {activePopover === 'date' && (
            <div className="absolute top-full right-0 z-50 mt-1">
              <DatePopover
                selectedDate={task.dueDate ? new Date(task.dueDate) : null}
                onSelect={(d) => {
                  updateTask(task._id, { dueDate: d });
                  setActivePopover(null);
                }}
                onClose={() => setActivePopover(null)}
              />
            </div>
          )}
        </div>

        {/* More (Priority/Tags/Delete) With Inline Popover */}
        <div className="relative" ref={moreRef}>
          <button
            className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
            title="More Options"
            onClick={() => setActivePopover(activePopover === 'more' ? null : 'more')}
          >
            <MoreHorizontal size={16} />
          </button>
          {activePopover === 'more' && (
            <div className="absolute top-full right-0 z-50 mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl w-[280px] p-3 animate-in fade-in zoom-in-95 duration-200">

              {/* Priority Section */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Flag size={12} /> Priority
                </h4>
                <div className="flex gap-2">
                  {["p1", "p2", "p3", "p4"].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        updateTask(task._id, { priority: p });
                        setActivePopover(null);
                      }}
                      className={`flex-1 p-2 rounded-lg border transition-all flex justify-center items-center ${task.priority === p
                        ? "bg-[var(--bg-surface)] border-[var(--primary-color)] ring-1 ring-[var(--primary-color)] shadow-sm"
                        : "border-[var(--border-color)] hover:bg-[var(--bg-surface)]"
                        }`}
                      title={`Priority ${p.charAt(1)}`}
                    >
                      <Flag
                        size={16}
                        className={
                          p === 'p1' ? "fill-red-500 text-red-600" :
                            p === 'p2' ? "fill-amber-500 text-amber-600" :
                              p === 'p3' ? "fill-green-500 text-green-600" :
                                "text-slate-400"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Labels Section */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag size={12} /> Labels
                </h4>

                {/* Search Input */}
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Search or Create..."
                    className="w-full px-3 py-1.5 text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1">
                  {["🏠 Home", "💻 Work", "🔥 Urgent", "🛒 Shopping", "🚀 Project"].map(label => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const currentTags = task.tags || [];
                        const newTags = currentTags.includes(label)
                          ? currentTags.filter(t => t !== label)
                          : [...currentTags, label];
                        updateTask(task._id, { tags: newTags });
                      }}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] transition-colors group"
                    >
                      <span className="flex-1 text-left truncate">{label}</span>
                      {task.tags?.includes(label) && <Check size={14} className="text-[var(--primary-color)]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[var(--border-color)] my-2"></div>

              {/* Delete Option */}
              <button
                onClick={() => {
                  removeTask(task._id);
                  setActivePopover(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-sm transition-colors font-medium"
              >
                <Trash2 size={14} />
                Delete Task
              </button>

            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default TaskItem;
