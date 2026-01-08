const TaskSkeleton = () => {
    return (
        <div className="flex items-start gap-3 p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-sm animate-pulse">
            {/* Circle Skeleton */}
            <div className="mt-1 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700/50 flex-shrink-0" />

            <div className="flex-1 space-y-3">
                {/* Title Bar */}
                <div className="flex justify-between">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700/50 rounded w-1/3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-16" />
                </div>

                {/* Description Lines */}
                <div className="space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700/30 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700/30 rounded w-1/2" />
                </div>

                {/* Tags/Date Row */}
                <div className="flex gap-2 pt-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700/40 rounded w-20" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700/40 rounded w-16" />
                </div>
            </div>
        </div>
    );
};

export default TaskSkeleton;
