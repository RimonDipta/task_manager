import { useState, useEffect, useRef, useContext } from "react";
import {
  Search,
  X,
  LayoutDashboard,
  List,
  Calendar,
  CheckCircle,
  Kanban,
  Folder,
  PlusCircle,
  Moon,
  Sun,
  Zap,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import { ThemeContext } from "../context/ThemeContext";

const CommandPalette = ({ isOpen, onClose, openTaskModal }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { projects, addProject } = useContext(TaskContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle close with Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: LayoutDashboard,
      path: "/dashboard/home",
      type: "Page",
    },
    {
      id: "all_tasks",
      label: "All Tasks",
      icon: List,
      path: "/tasks",
      type: "Page",
    },
    {
      id: "today",
      label: "Today",
      icon: Calendar,
      path: "/dashboard/today",
      type: "Page",
    },
    {
      id: "upcoming",
      label: "Upcoming",
      icon: Calendar,
      path: "/dashboard/upcoming",
      type: "Page",
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckCircle,
      path: "/dashboard/completed",
      type: "Page",
    },
    {
      id: "kanban",
      label: "Kanban Board",
      icon: Kanban,
      path: "/dashboard/kanban",
      type: "Page",
    },
  ];

  const actions = [
    {
      id: "new_task",
      label: "Create New Task",
      icon: PlusCircle,
      action: () => {
        openTaskModal();
        onClose();
      },
      type: "Action",
      shortcut: "C",
    },
    {
      id: "new_project",
      label: "Create New Project",
      icon: Folder,
      action: async () => {
        onClose();
        const name = prompt("Enter project name:");
        if (name) await addProject({ name });
      },
      type: "Action",
    },
    {
      id: "toggle_theme",
      label: `Switch to ${isDarkMode ? "Light" : "Dark"} Mode`,
      icon: isDarkMode ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      },
      type: "Action",
      shortcut: "T",
    },
  ];

  // Filter items based on query
  const filteredProjects = projects.map((p) => ({
    id: `proj_${p._id}`,
    label: p.name,
    icon: Folder,
    path: `/dashboard/project/${p._id}`,
    type: "Project",
    color: p.color,
  }));

  const allItems = [...navigationItems, ...actions, ...filteredProjects].filter(
    (item) => item.label.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + allItems.length) % allItems.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = allItems[selectedIndex];
      if (selected) {
        if (selected.path) {
          navigate(selected.path);
          onClose();
        } else if (selected.action) {
          selected.action();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-[var(--bg-card)] rounded-xl shadow-2xl border border-[var(--border-color)] overflow-hidden flex flex-col max-h-[60vh] animate-scaleIn">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)]">
          <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder-[var(--text-tertiary)] text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-[var(--border-color)] bg-[var(--bg-main)] px-2 font-mono text-[10px] font-medium text-[var(--text-secondary)]">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-[var(--text-tertiary)]">
              No results found.
            </div>
          ) : (
            <div className="space-y-1">
              {allItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.path) {
                        navigate(item.path);
                        onClose();
                      } else if (item.action) {
                        item.action();
                      }
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-[var(--primary-color)] text-white"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={
                          index === selectedIndex
                            ? "text-white"
                            : item.color
                            ? ""
                            : "text-[var(--text-tertiary)]"
                        }
                        style={{
                          color:
                            index !== selectedIndex && item.color
                              ? item.color
                              : undefined,
                        }}
                      />
                      <span
                        className={
                          index === selectedIndex
                            ? "text-white font-medium"
                            : "text-[var(--text-primary)]"
                        }
                      >
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.type && (
                        <span
                          className={`text-[10px] uppercase tracking-wider font-semibold ${
                            index === selectedIndex
                              ? "text-white/70"
                              : "text-[var(--text-tertiary)]"
                          }`}
                        >
                          {item.type}
                        </span>
                      )}
                      {item.shortcut && (
                        <kbd
                          className={`hidden sm:inline-flex h-5 items-center rounded border px-1.5 font-mono text-[10px] font-medium ${
                            index === selectedIndex
                              ? "border-white/30 bg-white/20 text-white"
                              : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-tertiary)]"
                          }`}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
                      {index === selectedIndex && (
                        <ArrowRight size={14} className="text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Tips */}
        <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ArrowRight size={10} /> to select
            </span>
            <span className="flex items-center gap-1">↑↓ to navigate</span>
          </div>
          <span>ProTip: Press '?' for help</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
