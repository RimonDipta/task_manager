import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";
import KanbanBoard from "../components/KanbanBoard";
import Analytics from "../components/Analytics";
import DisplayMenu from "../components/DisplayMenu";
import usePageTitle from "../hooks/usePageTitle";

const Dashboard = () => {
  const { user, fetchTasks } = useContext(AuthContext); // Actually fetchTasks is in TaskContext
  const { fetchTasks: getTasksData } = useContext(TaskContext); // Import separately
  const location = useLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const isTodayView = location.pathname.includes("/today");
  const isUpcomingView = location.pathname.includes("/upcoming");
  const isCompletedView = location.pathname.includes("/completed");
  const isKanbanRoute = location.pathname.includes("/kanban");
  const isAnalyticsView = location.pathname.includes("/analytics");

  // Determine filter type based on active view
  const filterType = isTodayView
    ? "today"
    : isUpcomingView
      ? "upcoming"
      : isCompletedView
        ? "completed"
        : isKanbanRoute
          ? "all" // Kanban shows everything by default per user request
          : "today"; // Default for root/dashboard

  // Dynamic Title
  let pageTitle = "Dashboard - Doora";
  if (isTodayView) pageTitle = "Today - Doora";
  if (isUpcomingView) pageTitle = "Upcoming - Doora";
  if (isCompletedView) pageTitle = "Completed - Doora";
  if (isKanbanRoute) {
    pageTitle = "Kanban - Doora";
    // We don't overwrite filterType here because it's derived const.
    // We'll handle it in the derivation logic.
  }
  if (isAnalyticsView) pageTitle = "Analytics - Doora";

  usePageTitle(pageTitle);

  // State
  const [layout, setLayout] = useState("list");
  const [filters, setFilters] = useState({
    priority: "all",
    status: "all",
    sort: "newest",
  });

  // Sync layout with route initially or when route changes significantly
  // REMOVED: isKanbanRoute now has its own dedicated render condition separate from 'layout' state.
  // We keep 'layout' state persistent for other views (Today/Upcoming).
  useEffect(() => {
    // Fetch tasks when filterType changes
    if (user) {
      getTasksData({ filter: filterType });
    }
  }, [filterType, user]);

  // If in Analytics view, we don't need the standard layout/filter UI
  if (isAnalyticsView) {
    return (
      <div className="h-full">
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 h-full">
          <div className="max-w-5xl mx-auto space-y-8">
            <Analytics />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Mobile Header would go here */}

      <main className="flex-1 overflow-y-auto p-4 sm:p-8 h-full">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                {getGreeting()}, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-slate-500 mt-1">
                {isTodayView && "Focus on your tasks for today."}
                {isUpcomingView && "Plan ahead for increased productivity."}
                {isCompletedView && "Review your accomplishments."}
                {isKanbanRoute && "Visualize your workflow."}
              </p>
            </div>

            {/* Display Menu */}
            {!isKanbanRoute && (
              <DisplayMenu
                layout={layout}
                setLayout={setLayout}
                filters={filters}
                setFilters={setFilters}
              />
            )}
            {isKanbanRoute && <div className="h-10"></div>} {/* Spacer if menu hidden, or just show filters? */}
            {/* If on Kanban route, maybe we show filters but NOT layout toggle? 
                DisplayMenu currently has everything together. 
                Let's just show it. Layout toggle switching to "List" while on "/kanban" route?
                If user switches to List on /kanban, presumably they want List view of Kanban tasks?
                Or maybe we redirect?
                The User didn't specify behavior for Kanban route interaction.
                Let's assume DisplayMenu is available. If user clicks "List", should it go to Grid/List of those tasks?
                Kanban route is basically "All tasks" (or filtered?). 
                Actually `/kanban` usually shows all tasks.
                For now, let's keep it simple: 
                If `isKanbanRoute`, we render KanbanBoard.
                If NOT `isKanbanRoute`, we render `TaskList` with `layout` state.
            */}
          </div>

          {!isKanbanRoute && (
            <TaskList filterType={filterType} filters={filters} layout={layout} />
          )}

          {isKanbanRoute && (
            <div className="h-full overflow-x-auto">
              <KanbanBoard filterType={filterType} filters={filters} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
