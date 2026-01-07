import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import SettingsModal from "./SettingsModal";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import { Plus, Menu, Zap, X } from "lucide-react";

const Layout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null); // New state for editing
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const openTaskModal = (task = null) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const closeTaskModal = () => {
        setIsTaskModalOpen(false);
        setEditingTask(null);
    };
    return (
        <div className="flex min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fadeIn"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-sidebar)] transform transition-transform duration-300 ease-in-out md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar
                    isCollapsed={false}
                    toggleSidebar={() => setIsMobileSidebarOpen(false)}
                    openSettings={() => setIsSettingsOpen(true)}
                    openTaskModal={() => {
                        setIsMobileSidebarOpen(false);
                        setIsTaskModalOpen(true);
                    }}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                    isMobile={true}
                />
            </div>

            {/* Sidebar Wrapper (Desktop) */}
            <div
                className={`${isSidebarCollapsed ? "w-20" : "w-64"} hidden md:block flex-shrink-0 transition-all duration-300 ease-in-out`}
            >
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    openSettings={() => setIsSettingsOpen(true)}
                    openTaskModal={() => setIsTaskModalOpen(true)}
                />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden min-w-0 relative flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-[var(--bg-surface)] border-b border-[var(--border-color)] sticky top-0 z-30">
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-2 font-bold text-[var(--primary-color)]">
                        <Zap size={20} />
                        <span>Doora</span>
                    </div>
                    <div className="w-8" /> {/* Spacer for centering */}
                </div>

                <div className="flex-1 relative">
                    <Outlet context={{ openTaskModal }} />
                </div>

                {/* Floating Action Button (FAB) */}
                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-[var(--primary-color)] text-white rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
                    title="Add New Task"
                >
                    <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </main>

            {/* Global Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />

            {/* Global Add Task Modal */}
            <Modal isOpen={isTaskModalOpen} onClose={closeTaskModal} title={editingTask ? "Edit Task" : "Add New Task"}>
                <TaskForm onClose={closeTaskModal} task={editingTask} />
            </Modal>
        </div>
    );
};

export default Layout;
