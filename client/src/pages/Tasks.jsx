import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as taskApi from "../api/taskApi";
import TaskList from "../components/TaskList";
import usePageTitle from "../hooks/usePageTitle";

import DisplayMenu from "../components/DisplayMenu";
import TaskSkeleton from "../components/TaskSkeleton";

const Tasks = () => {
    usePageTitle("All Tasks - Doora");
    const { user } = useContext(AuthContext);

    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Layout & Filter State
    const [layout, setLayout] = useState("list"); // 'list' | 'board'
    const [filters, setFilters] = useState({
        sort: "newest", // newest, oldest, priority
        priority: "all"
    });

    // Observer for infinite scroll
    const observer = useRef();
    const lastTaskElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Fetch Tasks
    useEffect(() => {
        if (!user) return;

        const fetchTasks = async () => {
            try {
                setLoading(true);
                // Add artificial delay to see spinner/loading state if needed, but not necessary
                const res = await taskApi.getTasks(user.token, { page, limit: 10 }); // 10 items per page

                setTasks(prevTasks => {
                    // Avoid duplicates just in case
                    const newTasks = res.data.tasks.filter(nt => !prevTasks.some(pt => pt._id === nt._id));
                    return [...prevTasks, ...newTasks];
                });

                setHasMore(page < res.data.pages);
                setInitialLoaded(true);
            } catch (error) {
                console.error("Failed to load tasks", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [page, user]); // Only fetch on page change or user change

    // Custom Handlers to update local state
    const handleUpdate = async (id, data) => {
        try {
            // Optimistic update
            setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data } : t));
            await taskApi.updateTask(id, data, user.token);
        } catch (error) {
            console.error("Failed to update task", error);
            // Revert on error? For now simple log.
        }
    };

    const handleDelete = async (id) => {
        try {
            setTasks(prev => prev.filter(t => t._id !== id));
            await taskApi.deleteTask(id, user.token);
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    return (
        <div className="h-full">
            <main className="flex-1 overflow-y-auto p-4 sm:p-8 h-full custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                                All Tasks
                            </h1>
                            <p className="text-slate-500 mt-1">
                                View and manage all your tasks in one place.
                            </p>
                        </div>

                        {/* Display Menu */}
                        <div className="flex-shrink-0">
                            <DisplayMenu
                                layout={layout}
                                setLayout={setLayout}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    {loading && !initialLoaded ? (
                        // Skeleton Loading
                        <div className={layout === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                            {layout === 'grid' ? (
                                // Grid Skeleton
                                [1, 2, 3, 4, 5, 6].map(i => <TaskSkeleton key={i} />)
                            ) : (
                                // List Skeleton
                                [1, 2, 3, 4, 5].map(i => <TaskSkeleton key={i} />)
                            )}
                        </div>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            layout={layout}
                            filters={filters}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    )}

                    {/* Loading Indicator / Observer Target */}
                    <div ref={lastTaskElementRef} className="py-4 text-center">
                        {loading && (
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        )}
                        {!hasMore && initialLoaded && tasks.length > 0 && (
                            <p className="text-slate-400 text-sm">No more tasks to load.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Tasks;
