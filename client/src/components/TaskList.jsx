import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "./TaskItem";
import TaskCard from "./TaskCard";
import { isToday, isFuture, parseISO, isValid } from "date-fns";

const TaskList = ({ filterType = "all", filters, layout = "list", limit, tasks: propTasks, onUpdate, onDelete }) => {
  const { tasks: contextTasks, loading, error } = useContext(TaskContext);

  const tasks = propTasks || contextTasks;

  // NOTE: 'filters' now comes from props, not local state.
  // We rely on the parent (Dashboard) to manage filters.

  const filteredTasks = [...tasks]
    .filter((task) => {
      // 1. Date Filtering (Today / Upcoming / Top Priorities)
      if (filterType === "today") {
        if (!task.dueDate) return true; // Show backlog/undated
        const date = new Date(task.dueDate);
        if (!isValid(date)) return true; // Invalid date = also backlog

        // Show Today OR Past (Overdue) that are NOT completed
        // If completed, only show if it was actually today? 
        // User said: "If a tasks is overdue and not marked as done... Show them... And keep them on today"

        if (task.completed) {
          return isToday(date); // Only show completed if they were actually for today
        }

        // For uncompleted: Today OR Past
        return isToday(date) || date < new Date().setHours(0, 0, 0, 0);
      }

      if (filterType === "top_priorities") {
        // Logic: Today (or no date) OR Future High Priority (P1)
        // Also typically exclude completed for priorities
        if (task.completed) return false;

        let isRelevantDate = false;
        if (!task.dueDate) isRelevantDate = true;
        else {
          const date = new Date(task.dueDate);
          if (!isValid(date)) isRelevantDate = true;
          else if (isToday(date)) isRelevantDate = true;
          else if (isFuture(date) && task.priority === 'p1') isRelevantDate = true;
        }

        return isRelevantDate;
      }

      if (filterType === "upcoming") {
        if (!task.dueDate) return false;
        const date = new Date(task.dueDate);
        if (!isValid(date) || !isFuture(date) || isToday(date)) return false;
      }

      if (filterType === "completed") {
        return task.completed;
      }

      // 2. Standard Filters
      if (filters && filters.priority !== "all" && task.priority !== filters.priority)
        return false;

      // Status Filter logic
      if (filterType === "completed") {
        // Already handled above
      } else {
        if (!task.completed) return true; // Show pending
        return false; // Hide completed
      }

      return true;
    })
    .sort((a, b) => {
      // For Top Priorities, ensure P1 is at top?
      // Default sorting is fine, but maybe prioritize Priority for "top_priorities" view explicitly if needed.
      // Current logic sorts by what's passed in `filters`, or default.
      // Let's force priority sort for "top_priorities" if no specific sort is active, or just respect user sort.
      // User sort is usually better.

      if (filters && filters.sort === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);

      if (filters && filters.sort === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);

      if (filters && filters.sort === "priority") {
        const order = { p1: 1, p2: 2, p3: 3, p4: 4 };
        return order[a.priority] - order[b.priority];
      }

      return 0;
    });

  const displayTasks = limit ? filteredTasks.slice(0, limit) : filteredTasks;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-center">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* TaskFilters removed, replaced by global DisplayMenu */}

      {filterType === "completed" && (
        <div className="mb-4 pb-2 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Completed Tasks</h2>
        </div>
      )}

      {displayTasks.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)] font-medium">No tasks to show</p>
        </div>
      ) : (
        <div className={layout === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start content-start"
          : "space-y-4"
        }>
          {displayTasks.map((task) => (
            layout === "grid" ? (
              <TaskCard key={task._id} task={task} />
            ) : (
              <TaskItem key={task._id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
            )
          ))}
        </div>
      )}
    </>
  );
};

export default TaskList;
