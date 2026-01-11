import { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { TaskContext } from "../context/TaskContext";
import {
  Settings,
  Search,
  LogOut,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Zap,
  List,
  Kanban,
  BarChart3,
  Calendar,
  CheckCircle,
  Home,
  X,
  Folder,
  CalendarRange,
} from "lucide-react";

const Sidebar = ({
  isCollapsed,
  toggleSidebar,
  openSettings,
  openTaskModal,
  onMobileClose,
  isMobile,
  openCommandPalette,
}) => {
  const { user, logoutUser } = useContext(AuthContext);
  const { projects, addProject } = useContext(TaskContext); // Use Projects from Context
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  const handleCreateProject = async () => {
    const name = prompt("Enter project name:");
    if (name) {
      await addProject({ name });
    }
  };

  return (
    <div
      className={`${
        isMobile
          ? "w-full h-full"
          : `${isCollapsed ? "w-16" : "w-64"} h-screen fixed left-0 top-0`
      } bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col z-10 transition-all duration-300`}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between h-14 border-b border-[var(--border-color)] shrink-0">
        {!isCollapsed ? (
          <h1 className="text-lg font-bold text-[var(--primary-color)] tracking-tight flex items-center gap-2 truncate">
            <Zap className="w-5 h-5" />
            Doora
          </h1>
        ) : (
          <div className="w-full flex justify-center">
            <Zap className="w-6 h-6 text-[var(--primary-color)]" />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className={`p-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] transition-colors ${
            isCollapsed
              ? "absolute -right-2.5 top-5 shadow-sm z-50 rounded-full"
              : ""
          }`}
        >
          {isMobile ? (
            <X size={18} />
          ) : isCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {/* Search Button */}
        <button
          onClick={openCommandPalette}
          className={`w-full flex items-center gap-3 px-3 py-2 mb-2 rounded-lg transition-colors group relative text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Search (Ctrl+K)"
        >
          <Search size={20} />
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span className="text-sm font-medium">Search</span>
              <kbd className="hidden group-hover:inline-flex h-5 items-center gap-1 rounded border border-[var(--border-color)] bg-[var(--bg-main)] px-1.5 font-mono text-[10px] font-medium opacity-70">
                <span className="text-xs">Ctrl</span> K
              </kbd>
            </div>
          )}
        </button>

        {/* Add Task Shortcut */}
        <button
          onClick={openTaskModal}
          className={`w-full flex items-center gap-3 px-3 py-2 mb-4 rounded-lg transition-all group relative ${
            isCollapsed
              ? "justify-center bg-[var(--primary-color)] text-white hover:opacity-90"
              : "bg-[var(--primary-color)] text-white hover:opacity-90 shadow-lg shadow-indigo-500/20"
          }`}
          title="New Task"
        >
          <PlusCircle size={20} />
          {!isCollapsed && (
            <span className="text-sm font-medium">New Task</span>
          )}
        </button>

        <Link
          to="/dashboard/home"
          onClick={() => onMobileClose && onMobileClose()}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
            isActive("/dashboard/home")
              ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
          } ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Home" : ""}
        >
          <Home
            size={20}
            className={
              isActive("/dashboard/home")
                ? "text-[var(--primary-color)]"
                : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            }
          />
          {!isCollapsed && <span className="text-sm font-medium">Home</span>}
        </Link>

        <Link
          to="/tasks"
          onClick={() => onMobileClose && onMobileClose()}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
            isActive("/tasks")
              ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
          } ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "All Tasks" : ""}
        >
          <List
            size={20}
            className={
              isActive("/tasks")
                ? "text-[var(--primary-color)]"
                : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            }
          />
          {!isCollapsed && (
            <span className="text-sm font-medium">All Tasks</span>
          )}
        </Link>

        <Link
          to="/dashboard/today"
          onClick={() => onMobileClose && onMobileClose()}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
            isActive("/dashboard/today")
              ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
          } ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Today" : ""}
        >
          <Calendar
            size={20}
            className={
              isActive("/dashboard/today")
                ? "text-[var(--primary-color)]"
                : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            }
          />
          {!isCollapsed && <span className="text-sm font-medium">Today</span>}
        </Link>

        <Link
          to="/dashboard/upcoming"
          onClick={() => onMobileClose && onMobileClose()}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
            isActive("/dashboard/upcoming")
              ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
          } ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Upcoming" : ""}
        >
          <CalendarRange
            size={20}
            className={
              isActive("/dashboard/upcoming")
                ? "text-[var(--primary-color)]"
                : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            }
          />
          {!isCollapsed && (
            <span className="text-sm font-medium">Upcoming</span>
          )}
        </Link>

        <Link
          to="/dashboard/completed"
          onClick={() => onMobileClose && onMobileClose()}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
            isActive("/dashboard/completed")
              ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
          } ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Completed" : ""}
        >
          <CheckCircle
            size={20}
            className={
              isActive("/dashboard/completed")
                ? "text-[var(--primary-color)]"
                : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            }
          />
          {!isCollapsed && (
            <span className="text-sm font-medium">Completed</span>
          )}
        </Link>

        <Link
          to="/dashboard/kanban"
          onClick={() => onMobileClose && onMobileClose()}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative ${
            isActive("/dashboard/kanban")
              ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
          } ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Kanban" : ""}
        >
          <Kanban
            size={20}
            className={
              isActive("/dashboard/kanban")
                ? "text-[var(--primary-color)]"
                : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
            }
          />
          {!isCollapsed && <span className="text-sm font-medium">Kanban</span>}
        </Link>

        {/* Projects Section */}
        {!isCollapsed && (
          <div className="pt-4 mt-2 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">
                Projects
              </h3>
              <button
                onClick={handleCreateProject}
                className="text-[var(--text-secondary)] hover:text-[var(--primary-color)] transition-colors"
                title="Add Project"
              >
                <PlusCircle size={14} />
              </button>
            </div>
            <div className="space-y-1">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  to={`/dashboard/project/${project._id}`} // Assuming route
                  onClick={() => onMobileClose && onMobileClose()}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors group relative ${
                    isActive(`/dashboard/project/${project._id}`)
                      ? "bg-[var(--primary-light)]/10 text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Folder
                    size={16}
                    className={project.color ? "" : "text-indigo-400"}
                    style={{ color: project.color }}
                  />
                  <span className="text-sm truncate">{project.name}</span>
                </Link>
              ))}
              {projects.length === 0 && (
                <p className="text-xs text-[var(--text-tertiary)] px-3 italic">
                  No projects yet
                </p>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* User Profile & Dropdown */}
      <div
        className="p-2 border-t border-[var(--border-color)] shrink-0"
        ref={dropdownRef}
      >
        <div className="relative">
          {/* Profile Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center gap-3 p-1.5 rounded-lg transition-all hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border-color)] ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full bg-[var(--primary-light)]/20 flex items-center justify-center text-[var(--primary-color)] font-bold text-xs shrink-0`}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] truncate">
                    {user?.email}
                  </p>
                </div>
                <ChevronUp
                  size={14}
                  className={`text-[var(--text-secondary)] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className={`absolute bottom-full mb-2 bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl rounded-xl overflow-hidden animate-scaleIn z-50 ${
                isCollapsed ? "left-0 w-48" : "left-0 right-0"
              }`}
            >
              <div className="p-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    openSettings();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
                >
                  <Settings size={14} />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={14} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
