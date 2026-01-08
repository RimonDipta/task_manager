import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ListTodo, LayoutGrid, ChevronDown, Check, Flag } from "lucide-react";

const DisplayMenu = ({ layout, setLayout, filters, setFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePriorityToggle = (priority) => {
        // If priority is already selected, switch to 'all', else switch to selected priority
        // Note: The previous UI used a select dropdown, so it was single selection + 'all'.
        // We'll maintain that single-select logic per the request "Filter (Priority for now)".
        setFilters((prev) => ({
            ...prev,
            priority: prev.priority === priority ? "all" : priority
        }));
    };

    const activeSortLabel = {
        newest: "Newest First",
        oldest: "Oldest First",
        priority: "Priority First"
    }[filters.sort] || "Sort By";

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all shadow-sm hover:shadow-md"
            >
                <SlidersHorizontal size={16} />
                <span className="text-sm font-medium">Display</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">

                    {/* Layout Section */}
                    <div className="mb-6 hidden sm:block">
                        <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Layout</h3>
                        <div className="grid grid-cols-2 gap-2 bg-[var(--bg-surface)] p-1 rounded-lg border border-[var(--border-color)]">
                            <button
                                onClick={() => setLayout("list")}
                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${layout === "list"
                                    ? "bg-[var(--bg-card)] text-[var(--primary-color)] shadow-sm ring-1 ring-[var(--border-color)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                <ListTodo size={16} />
                                List
                            </button>
                            <button
                                onClick={() => setLayout("grid")}
                                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${layout === "grid"
                                    ? "bg-[var(--bg-card)] text-[var(--primary-color)] shadow-sm ring-1 ring-[var(--border-color)]"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                <LayoutGrid size={16} />
                                Grid
                            </button>
                        </div>
                    </div>

                    {/* Sort Section */}
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Sort By</h3>
                        <select
                            value={filters.sort}
                            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                            className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]/20"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="priority">Priority First</option>
                        </select>
                    </div>

                    {/* Filter Section */}
                    <div>
                        <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">Filter Priority</h3>
                        <div className="space-y-1">
                            {["p1", "p2", "p3", "p4"].map((p) => (
                                <div
                                    key={p}
                                    onClick={() => handlePriorityToggle(p)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${filters.priority === p
                                        ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
                                        : "hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Flag
                                            size={16}
                                            className={
                                                p === 'p1' ? "fill-red-500 text-red-600" :
                                                    p === 'p2' ? "fill-amber-500 text-amber-600" :
                                                        p === 'p3' ? "fill-green-500 text-green-600" :
                                                            "text-slate-400"
                                            }
                                        />
                                        <span className="text-sm uppercase">Priority {p.charAt(1)}</span>
                                    </div>
                                    {filters.priority === p && <Check size={16} />}
                                </div>
                            ))}
                            {filters.priority !== "all" && (
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, priority: "all" }))}
                                    className="text-xs text-[var(--text-tertiary)] hover:text-[var(--primary-color)] mt-2 w-full text-center hover:underline"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default DisplayMenu;
