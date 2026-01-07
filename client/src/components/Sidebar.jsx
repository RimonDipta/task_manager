import { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import {

    Settings,
    LogOut,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    PlusCircle,
    Zap,
    Kanban,
    BarChart3,
    Calendar,
    CalendarRange,
    CheckCircle,
    Home,
    X
} from "lucide-react";

const Sidebar = ({ isCollapsed, toggleSidebar, openSettings, openTaskModal, onMobileClose, isMobile }) => {
    const { user, logoutUser } = useContext(AuthContext);
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

    return (
        <div
            className={`${isCollapsed ? "w-20" : "w-64"} bg-[var(--bg-sidebar)] h-screen border-r border-[var(--border-color)] flex flex-col fixed left-0 top-0 z-10 transition-all duration-300`}
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between h-16 border-b border-[var(--border-color)]">
                <h1 className="text-xl font-bold text-[var(--primary-color)] tracking-tight flex items-center gap-2 truncate">
                    <Zap className="w-6 h-6" />
                    Doora
                </h1>
                )}
                {isCollapsed && (
                    <div className="w-full flex justify-center">
                        <Zap className="w-8 h-8 text-[var(--primary-color)]" />
                    </div>
                )}

                <button
                    onClick={toggleSidebar}
                    className={`p-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] transition-colors ${isCollapsed ? "absolute -right-3 top-6 shadow-sm z-50 rounded-full" : ""}`}
                >
                    {isMobile ? <X size={20} /> : (isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={16} />)}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-2">

                {/* Add Task Shortcut */}
                <button
                    onClick={openTaskModal}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 mb-6 rounded-lg transition-all group relative ${isCollapsed
                        ? "justify-center bg-[var(--primary-color)] text-white hover:opacity-90"
                        : "bg-[var(--primary-color)] text-white hover:opacity-90 shadow-lg shadow-indigo-500/20"
                        }`}
                    title="New Task"
                >
                    <PlusCircle size={22} />
                    {!isCollapsed && <span className="font-medium">New Task</span>}
                </button>

                <Link
                    to="/dashboard/home"
                    onClick={() => onMobileClose && onMobileClose()}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${isActive("/dashboard/home")
                        ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? "Home" : ""}
                >
                    <Home size={22} className={isActive("/dashboard/home") ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"} />
                    {!isCollapsed && <span className="font-medium">Home</span>}
                </Link>

                <Link
                    to="/dashboard/today"
                    onClick={() => onMobileClose && onMobileClose()}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${isActive("/dashboard/today")
                        ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? "Today" : ""}
                >
                    <Calendar size={22} className={isActive("/dashboard/today") ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"} />
                    {!isCollapsed && <span className="font-medium">Today</span>}
                </Link>

                <Link
                    to="/dashboard/upcoming"
                    onClick={() => onMobileClose && onMobileClose()}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${isActive("/dashboard/upcoming")
                        ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? "Upcoming" : ""}
                >
                    <CalendarRange size={22} className={isActive("/dashboard/upcoming") ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"} />
                    {!isCollapsed && <span className="font-medium">Upcoming</span>}
                </Link>

                <Link
                    to="/dashboard/completed"
                    onClick={() => onMobileClose && onMobileClose()}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${isActive("/dashboard/completed")
                        ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? "Completed" : ""}
                >
                    <CheckCircle size={22} className={isActive("/dashboard/completed") ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"} />
                    {!isCollapsed && <span className="font-medium">Completed</span>}
                </Link>

                <Link
                    to="/dashboard/kanban"
                    onClick={() => onMobileClose && onMobileClose()}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${isActive("/dashboard/kanban")
                        ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                        } ${isCollapsed ? "justify-center" : ""}`}
                    title={isCollapsed ? "Kanban" : ""}
                >
                    <Kanban size={22} className={isActive("/dashboard/kanban") ? "text-[var(--primary-color)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"} />
                    {!isCollapsed && <span className="font-medium">Kanban</span>}
                </Link>
            </nav>

            {/* User Profile & Dropdown */}
            <div className="p-3 border-t border-[var(--border-color)]" ref={dropdownRef}>
                <div className="relative">

                    {/* Profile Button */}
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-[var(--bg-surface)] border border-transparent hover:border-[var(--border-color)] ${isCollapsed ? "justify-center" : ""}`}
                    >
                        <div className={`w-8 h-8 rounded-full bg-[var(--primary-light)]/20 flex items-center justify-center text-[var(--primary-color)] font-bold text-sm shrink-0`}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        {!isCollapsed && (
                            <>
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
                                    <p className="text-[10px] text-[var(--text-secondary)] truncate">{user?.email}</p>
                                </div>
                                <ChevronUp size={16} className={`text-[var(--text-secondary)] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                            </>
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className={`absolute bottom-full mb-2 bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl rounded-xl overflow-hidden animate-scaleIn z-50 ${isCollapsed ? "left-0 w-48" : "left-0 right-0"}`}>
                            <div className="p-1">
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        openSettings();
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
                                >
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Sidebar;
