import { useState, useContext, useRef, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import useSound from "../hooks/useSound";
import {
  Flag,
  Calendar,
  Clock,
  Repeat,
  MoreHorizontal,
  X,
  AlarmClock
} from "lucide-react";
import { format, isToday, isTomorrow, isValid } from "date-fns";

// Sub-components
import DatePopover from "./DatePopover";
import PriorityLabelPopover from "./PriorityLabelPopover";
import RepeatPopover from "./RepeatPopover";
import CustomRepeatModal from "./CustomRepeatModal";

const TaskForm = ({ onClose, task }) => { // Accept 'task' prop
  const { addTask, updateTask } = useContext(TaskContext); // Destructure updateTask
  const playSound = useSound();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("p4");
  const [date, setDate] = useState(null); // Default Today
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [repeat, setRepeat] = useState(null); // { type, interval, end }
  const [tags, setTags] = useState([]);

  // UI State
  const [activePopover, setActivePopover] = useState(null); // 'date', 'priority', 'repeat', 'customRepeat'
  const [showCustomRepeat, setShowCustomRepeat] = useState(false);
  const [showTimeInputs, setShowTimeInputs] = useState(false);

  // Refs for click outside
  const dateRef = useRef(null);
  const priorityRef = useRef(null);
  const repeatRef = useRef(null);

  // Populate form if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "p4");
      setTags(task.tags || []);
      setDate(task.dueDate ? new Date(task.dueDate) : null);
      setRepeat(task.recurrence || null);

      // Handle Time/Duration if specific fields (assuming reminder holds time)
      if (task.reminder) {
        const reminderDate = new Date(task.reminder);
        setTime(format(reminderDate, "HH:mm"));
        setShowTimeInputs(true);
      }
      if (task.duration) { // Assuming duration might be added to model or implied
        setDuration(task.duration || "");
        if (task.duration) setShowTimeInputs(true);
      }
    } else {
      // Reset form for addition (Layout handles unmount/remount usually, but safe to reset if modal stays mounted)
      // However, since Modal likely unmounts content or we want fresh state:
      // Actually, if Layout keeps TaskForm mounted but hidden, we might need reset. 
      // But this useEffect runs on `task` change.
      // If we open "Add Task" (task=null), we want empty.
    }
  }, [task]);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        if (activePopover === 'date') setActivePopover(null);
      }
      if (priorityRef.current && !priorityRef.current.contains(event.target)) {
        if (activePopover === 'priority') setActivePopover(null);
      }
      if (repeatRef.current && !repeatRef.current.contains(event.target)) {
        if (activePopover === 'repeat') setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopover]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Construct Payload
    let reminderDate = null;
    if (date && time) {
      // combine date + time
      const [hours, minutes] = time.split(':');
      reminderDate = new Date(date);
      reminderDate.setHours(parseInt(hours), parseInt(minutes));
    }

    const taskData = {
      title,
      description: duration ? (description || "") + `\n[Duration: ${duration}]` : description,
      priority,
      dueDate: date,
      tags,
      recurrence: repeat,
      reminder: reminderDate
    };

    if (task) {
      // Update
      await updateTask(task._id, taskData);
      playSound("success");
    } else {
      // Create
      await addTask(taskData);
      playSound("click");
    }

    // Close modal
    if (onClose) onClose();
  };

  // Helper to format Date Button Text
  const getDateLabel = () => {
    if (!date) return "No Date";
    if (!isValid(date)) return "Invalid";
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "d MMM");
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Title & Description */}
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task name"
            className="w-full text-xl font-semibold bg-transparent border-none outline-none placeholder:text-[var(--text-tertiary)] text-[var(--text-primary)] dark:text-white"
            autoFocus
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full text-sm bg-transparent border-none outline-none placeholder:text-[var(--text-tertiary)] text-[var(--text-secondary)]"
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)]">

          {/* Date Pill */}
          <div className="relative group" ref={dateRef}>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-colors cursor-pointer select-none ${date
                ? "border-[var(--primary-light)] text-[var(--primary-color)] bg-[var(--primary-light)]/10"
                : "border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                }`}
              onClick={() => setActivePopover(activePopover === 'date' ? null : 'date')}
            >
              <Calendar size={14} />
              <span>{getDateLabel()}</span>
              {date && (
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); setDate(null); }}
                  className="hover:bg-[var(--bg-card)] rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </span>
              )}
            </div>
            {activePopover === "date" && (
              <DatePopover
                selectedDate={date}
                onSelect={(d) => { setDate(d); setActivePopover(null); }}
                onClose={() => setActivePopover(null)}
              />
            )}
          </div>

          {/* Priority Pill (P1-P3) */}
          {priority !== 'p4' && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm border-amber-200 bg-amber-50 text-amber-700 cursor-pointer select-none"
              onClick={() => setActivePopover(activePopover === 'priority' ? null : 'priority')}
            >
              <Flag size={14} className={
                priority === 'p1' ? "fill-red-500 text-red-600" :
                  priority === 'p2' ? "fill-amber-500 text-amber-600" :
                    "fill-green-500 text-green-600"
              } />
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); setPriority('p4'); }}
                className="hover:bg-amber-100 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </span>
            </div>
          )}

          {/* Tag Pills */}
          {tags.map(tag => (
            <div
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm border-indigo-200 bg-indigo-50 text-indigo-700 select-none"
            >
              <span>{tag}</span>
              <span
                role="button"
                onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                className="hover:bg-indigo-100 rounded-full p-0.5 transition-colors cursor-pointer"
              >
                <X size={12} />
              </span>
            </div>
          ))}

          {/* Repeat Pill */}
          {repeat && (
            <div className="relative" ref={repeatRef}>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm border-purple-200 bg-purple-50 text-purple-700 cursor-pointer select-none"
                onClick={() => setActivePopover(activePopover === 'repeat' ? null : 'repeat')}
              >
                <Repeat size={14} />
                <span className="capitalize">{repeat.type}</span>
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); setRepeat(null); }}
                  className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </span>
              </div>
              {activePopover === "repeat" && (
                <RepeatPopover
                  onSelect={(r) => { setRepeat(r); setActivePopover(null); }}
                  onOpenCustom={() => { setActivePopover(null); setShowCustomRepeat(true); }}
                />
              )}
            </div>
          )}


          {/* Three Dots (Priority/Labels Trigger) */}
          <div className="relative" ref={priorityRef}>
            <button
              type="button"
              onClick={() => setActivePopover(activePopover === 'priority' ? null : 'priority')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
              title="Set Priority & Labels"
            >
              <MoreHorizontal size={18} />
            </button>

            {activePopover === "priority" && (
              <PriorityLabelPopover
                priority={priority}
                setPriority={setPriority}
                selectedTags={tags}
                setSelectedTags={setTags}
                onClose={() => setActivePopover(null)}
              />
            )}
          </div>

          <div className="flex-1"></div>

          {/* Icons: Clock, Repeat (Hidden if active?) */}
          <div className="flex items-center gap-1">
            {/* Clock: Only show if time NOT set (toggle) */}
            {!showTimeInputs && (
              <button
                type="button"
                onClick={() => setShowTimeInputs(true)}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
                title="Add Time"
              >
                <Clock size={18} />
              </button>
            )}

            {/* Repeat: Only show icon if repeat NOT set */}
            {!repeat && (
              <div className="relative" ref={repeatRef}>
                <button
                  type="button"
                  onClick={() => setActivePopover(activePopover === 'repeat' ? null : 'repeat')}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors"
                  title="Repeat"
                >
                  <Repeat size={18} />
                </button>
                {activePopover === "repeat" && (
                  <RepeatPopover
                    onSelect={(r) => { setRepeat(r); setActivePopover(null); }}
                    onOpenCustom={() => { setActivePopover(null); setShowCustomRepeat(true); }}
                  />
                )}
              </div>
            )}
          </div>

        </div>

        {/* Time Inputs (Conditional) */}
        {showTimeInputs && (
          <div className="flex items-center justify-between bg-[var(--bg-card)] p-2.5 rounded-xl animate-in fade-in slide-in-from-top-2 border border-[var(--border-color)] shadow-sm mt-2">
            <div className="flex gap-4 items-center">

              {/* Time Input */}
              <div className="flex items-center gap-2 bg-[var(--bg-surface)] px-2 py-1.5 rounded-lg border border-[var(--border-color)] focus-within:ring-1 focus-within:ring-[var(--primary-color)] transition-all">
                <AlarmClock size={15} className="text-[var(--primary-color)]" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-transparent text-sm font-medium text-[var(--text-primary)] outline-none w-[100px] cursor-pointer appearance-none" style={{ colorScheme: 'var(--color-scheme)' }}
                />
              </div>

              {/* Duration Input */}
              <div className="flex items-center gap-2 bg-[var(--bg-surface)] px-2 py-1.5 rounded-lg border border-[var(--border-color)] focus-within:ring-1 focus-within:ring-[var(--primary-color)] transition-all">
                <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Duration</span>
                <input
                  type="text"
                  placeholder="30m"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-transparent text-sm font-medium text-[var(--text-primary)] outline-none w-14 placeholder:text-[var(--text-tertiary)]"
                />
              </div>

            </div>
            <button
              type="button"
              onClick={() => { setShowTimeInputs(false); setTime(""); setDuration(""); }}
              className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-full transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={!title.trim()}
          >
            {task ? "Save Changes" : "Add Task"}
          </button>
        </div>

      </form>

      {/* Modals */}
      {showCustomRepeat && (
        <CustomRepeatModal
          onClose={() => setShowCustomRepeat(false)}
          onSave={(config) => { setRepeat(config); setShowCustomRepeat(false); }}
          initialConfig={repeat}
        />
      )}

    </div>
  );
};

export default TaskForm;
