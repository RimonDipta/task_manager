import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import SettingsModal from "./SettingsModal";
import Modal from "./Modal";
import TaskForm from "./TaskForm";
import { Plus } from "lucide-react";

const Layout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
            {/* Sidebar Wrapper */}
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
            <main className="flex-1 overflow-x-hidden min-w-0 relative">
                <Outlet context={{ openTaskModal }} />

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
