import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "./TaskItem";
import { isToday, isFuture, parseISO, isValid } from "date-fns";

const TaskList = ({ filterType = "all", filters, layout = "list", limit }) => {
  const { tasks, loading, error } = useContext(TaskContext);

  // NOTE: 'filters' now comes from props, not local state.
  // We rely on the parent (Dashboard) to manage filters.

  const filteredTasks = [...tasks]
    .filter((task) => {
      // 1. Date Filtering (Today / Upcoming)
      if (filterType === "today") {
        // Show if NO due date OR if due date is Today
        if (!task.dueDate) return true;
        const date = new Date(task.dueDate);
        if (!isValid(date)) return true; // Treat invalid as no date (or handle differently?) -> Let's treat as today/backlog
        return isToday(date);
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
      // If we are NOT in completed view, we typically show pending.
      // We will respect `filters.status` if set, otherwise default to showing pending (unless user explicitly filters for all/completed).
      // However, simplified logic:
      if (filterType === "completed") {
        // Already handled above
      } else {
        // In Today/Upcoming, we generally don't show completed tasks unless requested?
        // User didn't specify, but "Completed" view suggests separation.
        // Let's hide completed tasks in Today/Upcoming by default.
        if (!task.completed) return true; // Show pending
        return false; // Hide completed
      }

      return true;
    })
    .sort((a, b) => {
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
          <p className="text-[var(--text-secondary)] font-medium">No tasks found matching your filters</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Try adjusting your display settings</p>
        </div>
      ) : (
        <div className={layout === "board"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-4"
        }>
          {displayTasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </div>
      )}
    </>
  );
};

export default TaskList;
