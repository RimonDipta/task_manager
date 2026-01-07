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
import TimePopover from "./TimePopover";

const TaskForm = ({ onClose, task }) => { // Accept 'task' prop
  const { addTask, updateTask } = useContext(TaskContext); // Destructure updateTask
  const playSound = useSound();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("p4");
  const [date, setDate] = useState(new Date()); // Default Today
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState({ val: "", unit: "minutes" });
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
      if (task.duration) {
        const h = Math.floor(task.duration / 60);
        const m = task.duration % 60;
        setDuration({ h, m });
        setShowTimeInputs(true);
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
      // Note: 'time' popover doesn't have a persistent ref in parent easily because it's conditional. 
      // We rely on the TimePopover being closed by selecting or clicking the 'clear'/X.
      // But standard click outside is good. We can add a ref to the container of the time input.
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePopover]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Construct Payload
    // Construct Payload
    let reminderDate = null;
    let taskStatus = task?.status || (priority === 'all' ? 'todo' : 'todo'); // Default
    let startTimeValue = undefined;

    if (showTimeInputs) {
      if (date && time) {
        // combine date + time
        const [hours, minutes] = time.split(':');
        reminderDate = new Date(date);
        reminderDate.setHours(parseInt(hours), parseInt(minutes));
        // Scheduled for future?
      } else if (date && !time) {
        // "No Time" selected -> Start IMMEDIATELY
        taskStatus = 'doing';
        startTimeValue = new Date(); // Start now
        // If date is different than today, maybe we shouldn't start? 
        // User requirement: "If no time is slected duration time should start as soon as user add the tasks"
        // We assume this applies if the Date is Today or not set?
        // If Date is tomorrow, and "No Time", does it start now?
        // Let's assume yes, or maybe set start time to 00:00 of that day?
        // "Duration time should start as soon as user add the tasks" -> Implies immediate start.
      }
    }

    const durationVal = parseInt(duration.val) || 0;
    const totalDurationMinutes = duration.unit === "hours" ? durationVal * 60 : durationVal;

    const taskData = {
      title,
      description,
      priority,
      dueDate: date,
      tags,
      recurrence: repeat,
      reminder: reminderDate,
      duration: totalDurationMinutes,
      startTime: startTimeValue,
      status: taskStatus
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
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)] relative">

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
              <div
                className="absolute bottom-full left-0 mb-2 z-[60] animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <DatePopover
                  selectedDate={date}
                  onSelect={(d) => { setDate(d); setActivePopover(null); }}
                  onClose={() => setActivePopover(null)}
                />
              </div>
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
                onClick={() => {
                  setShowTimeInputs(true);
                  setTime(format(new Date(), "HH:mm"));
                }}
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
          <div className="flex flex-col gap-3 bg-[var(--bg-card)] p-3 rounded-xl animate-in fade-in slide-in-from-top-2 border border-[var(--border-color)] shadow-sm mt-2">

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Time & Duration</span>
              <button
                type="button"
                onClick={() => { setShowTimeInputs(false); setTime(""); setDuration({ h: 0, m: 0 }); }}
                className="p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-full transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 items-end">

              {/* Time Input */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-xs text-[var(--text-secondary)]">Start Time</label>
                <div className="flex items-center gap-2">
                  <div
                    onClick={() => setActivePopover('time')}
                    className="flex items-center gap-2 bg-[var(--bg-surface)] px-2 py-1.5 rounded-lg border border-[var(--border-color)] cursor-pointer hover:border-[var(--primary-color)] transition-colors"
                  >
                    <AlarmClock size={15} className="text-[var(--primary-color)]" />
                    <span className={`text-sm font-medium ${time ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>
                      {time || "00:00"}
                    </span>
                  </div>

                  {activePopover === 'time' && (
                    <div className="absolute top-full mt-2 left-0 z-[70]">
                      <TimePopover
                        selectedTime={time}
                        onSelect={(t) => { setTime(t); setActivePopover(null); }}
                        onClose={() => setActivePopover(null)}
                        onClear={() => { setTime(""); setActivePopover(null); }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Duration Input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--text-secondary)]">Duration</label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] overflow-hidden">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={duration.h || ""}
                      onChange={(e) => setDuration(prev => ({ ...prev, h: parseInt(e.target.value) || 0 }))}
                      className="w-12 px-2 py-1.5 bg-transparent text-sm text-[var(--text-primary)] outline-none text-center border-r border-[var(--border-color)]"
                    />
                    <span className="px-2 text-xs text-[var(--text-tertiary)] bg-[var(--bg-card)]">hr</span>
                  </div>
                  <div className="flex items-center bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] overflow-hidden">
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="0"
                      value={duration.m || ""}
                      onChange={(e) => setDuration(prev => ({ ...prev, m: parseInt(e.target.value) || 0 }))}
                      className="w-12 px-2 py-1.5 bg-transparent text-sm text-[var(--text-primary)] outline-none text-center border-r border-[var(--border-color)]"
                    />
                    <span className="px-2 text-xs text-[var(--text-tertiary)] bg-[var(--bg-card)]">min</span>
                  </div>
                </div>
              </div>

            </div>

            <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
              {!time ? "Starts immediately." : "Scheduled to start at specified time."}
            </p>

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
