import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "./TaskItem";
import TaskCard from "./TaskCard";
import TaskSkeleton from "./TaskSkeleton";
import { isToday, isFuture, parseISO, isValid } from "date-fns";

const TaskList = ({ filterType = "all", filters, layout = "list", limit, tasks: propTasks, onUpdate, onDelete }) => {
  const { tasks: contextTasks, loading, error } = useContext(TaskContext);

  const tasks = propTasks || contextTasks;

  // NOTE: 'filters' now comes from props, not local state.
  // We rely on the parent (Dashboard) to manage filters.

  // Server-side filtering is now implemented. 
  // We can treat 'tasks' as the source of truth for the current view.
  // However, we might crave some client-side refinement or sorting if filters.priority is set.

  const filteredTasks = [...tasks]
    .filter((task) => {
      // 1. Standard Filters (Priority / Status) - These are UI toggles in the menu
      if (filters && filters.priority !== "all" && task.priority !== filters.priority)
        return false;

      // 2. Client-side Status check (e.g. if we are in 'Today' view but toggle 'Completed' off?)
      // For now, let's assume the server returned the right "Main" category (Today/Upcoming).
      // We only filter by the specific UI dropdowns here.

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

  // Import TaskSkeleton at the top first! (Need to add import)
  if (loading) {
    return (
      <div className={layout === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        : "space-y-4"
      }>
        {layout === "grid" ? (
          [1, 2, 3, 4, 5, 6].map((i) => <TaskSkeleton key={i} />)
        ) : (
          [1, 2, 3, 4, 5].map((i) => <TaskSkeleton key={i} />)
        )}
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
