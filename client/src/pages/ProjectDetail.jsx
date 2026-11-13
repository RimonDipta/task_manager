import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import { AuthContext } from "../context/AuthContext";
import * as taskApi from "../api/taskApi";
import TaskList from "../components/TaskList";
import AddProjectModal from "../components/AddProjectModal";
import usePageTitle from "../hooks/usePageTitle";
import { ArrowLeft, Trash2, Edit2, Archive, ArchiveRestore, ListChecks, CheckCircle2, AlertTriangle } from "lucide-react";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { projects, editProject, removeProject } = useContext(TaskContext);

    const contextProject = projects.find((p) => p._id === id);
    // The global `projects` list hides archived projects, so an archived
    // project's detail page has to resolve itself independently.
    const [resolvedProject, setResolvedProject] = useState(null);
    const [projectLoading, setProjectLoading] = useState(!contextProject);
    const project = contextProject || resolvedProject;

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);

    usePageTitle(project ? `${project.name} - Doora` : "Project - Doora");

    useEffect(() => {
        if (contextProject) {
            setProjectLoading(false);
            return;
        }
        if (!user || !id) return;
        let cancelled = false;

        const loadProject = async () => {
            setProjectLoading(true);
            try {
                const res = await taskApi.getProjects(user.token, { archived: "all" });
                if (!cancelled) setResolvedProject(res.data.find((p) => p._id === id) || null);
            } catch (err) {
                console.error("Failed to load project", err);
            } finally {
                if (!cancelled) setProjectLoading(false);
            }
        };

        loadProject();
        return () => {
            cancelled = true;
        };
    }, [user, id, contextProject]);

    useEffect(() => {
        if (!user || !id) return;
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            try {
                // A generous limit keeps this simple project view correct for
                // typical project sizes without adding a second pagination UI.
                const res = await taskApi.getTasks(user.token, { project: id, filter: "all", limit: 200 });
                if (!cancelled) setTasks(res.data.tasks);
            } catch (err) {
                console.error("Failed to load project tasks", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [user, id]);

    const handleArchiveToggle = async () => {
        const updated = await editProject(project._id, { archived: !project.archived });
        setResolvedProject(updated);
    };

    // This page keeps its own `tasks` state scoped to the project (not
    // TaskContext's), so bulk actions need to update it directly or the
    // list would go stale relative to the shared context list.
    const handleBulkUpdate = async (ids, data) => {
        const idSet = new Set(ids);
        try {
            const updated = await taskApi.bulkUpdateTasks(ids, data, user.token);
            const updatedById = new Map(updated.data.map((t) => [t._id, t]));
            setTasks((prev) => prev.map((t) => (idSet.has(t._id) ? updatedById.get(t._id) || t : t)));
        } catch (err) {
            console.error("Failed to bulk update project tasks", err);
        }
    };

    const handleBulkDelete = async (ids) => {
        const idSet = new Set(ids);
        try {
            setTasks((prev) => prev.filter((t) => !idSet.has(t._id)));
            await taskApi.bulkDeleteTasks(ids, user.token);
        } catch (err) {
            console.error("Failed to bulk delete project tasks", err);
        }
    };

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter(
        (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    const handleDelete = async () => {
        if (!project) return;
        if (!window.confirm(`Delete "${project.name}"? Its tasks will remain, unassigned from this project.`)) return;
        await removeProject(project._id);
        navigate("/dashboard/home");
    };

    if (projectLoading) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <p className="text-[var(--text-secondary)]">Loading project...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <p className="text-[var(--text-secondary)]">
                    This project could not be found, or you don't have access to it.
                </p>
                <button
                    onClick={() => navigate("/dashboard/home")}
                    className="mt-4 text-sm text-[var(--primary-color)] hover:underline"
                >
                    Back to dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
                <ArrowLeft size={15} /> Back
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <span
                        className="w-3.5 h-3.5 rounded-full mt-2 shrink-0"
                        style={{ backgroundColor: project.color || "#6366f1" }}
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{project.name}</h1>
                            {project.archived && (
                                <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-tertiary)] border border-[var(--border-color)]">
                                    Archived
                                </span>
                            )}
                        </div>
                        {project.description && (
                            <p className="text-[var(--text-secondary)] mt-1 max-w-xl">{project.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                    >
                        <Edit2 size={14} /> Edit
                    </button>
                    <button
                        onClick={handleArchiveToggle}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                    >
                        {project.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                        {project.archived ? "Restore" : "Archive"}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-500 border border-[var(--border-color)] hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>

            {/* Progress + Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500">
                        <ListChecks size={18} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{loading ? "—" : total}</p>
                        <p className="text-xs text-[var(--text-secondary)]">Total Tasks</p>
                    </div>
                </div>
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                        <CheckCircle2 size={18} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{loading ? "—" : `${progress}%`}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{completed} Completed</p>
                    </div>
                </div>
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{loading ? "—" : overdue}</p>
                        <p className="text-xs text-[var(--text-secondary)]">Overdue</p>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--primary-color)] transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Task list for this project */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Tasks</h2>
                <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden p-4">
                    <TaskList
                        tasks={tasks}
                        layout="list"
                        onBulkUpdate={handleBulkUpdate}
                        onBulkDelete={handleBulkDelete}
                    />
                </div>
            </div>

            <AddProjectModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                project={project}
                onUpdate={async (pid, data) => {
                    const updated = await editProject(pid, data);
                    setResolvedProject(updated);
                }}
            />
        </div>
    );
};

export default ProjectDetail;
