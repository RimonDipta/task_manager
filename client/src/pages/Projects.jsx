import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";
import * as taskApi from "../api/taskApi";
import usePageTitle from "../hooks/usePageTitle";
import AddProjectModal from "../components/AddProjectModal";
import {
    Folder,
    Plus,
    Edit2,
    Archive,
    ArchiveRestore,
    ListChecks,
    AlertTriangle,
} from "lucide-react";

const ProjectCard = ({ project, token, onEdit, onArchiveToggle }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                // limit: 1 keeps the payload tiny — only `total` from each response is used.
                const [all, completed, overdue] = await Promise.all([
                    taskApi.getTasks(token, { project: project._id, filter: "all", limit: 1 }),
                    taskApi.getTasks(token, { project: project._id, filter: "completed", limit: 1 }),
                    taskApi.getTasks(token, { project: project._id, filter: "overdue", limit: 1 }),
                ]);
                if (cancelled) return;

                const total = all.data.total || 0;
                const done = completed.data.total || 0;
                setStats({
                    total,
                    completed: done,
                    overdue: overdue.data.total || 0,
                    progress: total > 0 ? Math.round((done / total) * 100) : 0,
                });
            } catch (err) {
                console.error("Failed to load project stats", err);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [project._id, token]);

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <Link to={`/dashboard/projects/${project._id}`} className="flex items-center gap-2 min-w-0 group">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: project.color || "#6366f1" }} />
                    <span className="font-semibold text-[var(--text-primary)] truncate group-hover:underline">{project.name}</span>
                </Link>
                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => onEdit(project)}
                        className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                        title="Edit project"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                        onClick={() => onArchiveToggle(project)}
                        className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                        title={project.archived ? "Restore project" : "Archive project"}
                    >
                        {project.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                    </button>
                </div>
            </div>

            {project.description && (
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{project.description}</p>
            )}

            <div className="h-1.5 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--primary-color)] transition-all"
                    style={{ width: `${stats?.progress ?? 0}%` }}
                />
            </div>

            <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                    <ListChecks size={12} /> {stats ? stats.total : "—"} tasks
                </span>
                <span>{stats ? stats.progress : 0}% complete</span>
                {stats?.overdue > 0 && (
                    <span className="flex items-center gap-1 text-red-500">
                        <AlertTriangle size={12} /> {stats.overdue} overdue
                    </span>
                )}
            </div>
        </div>
    );
};

const Projects = () => {
    usePageTitle("Projects - Doora");
    const { user } = useContext(AuthContext);
    const { projects, addProject, editProject } = useContext(TaskContext);

    const [showArchived, setShowArchived] = useState(false);
    const [archivedProjects, setArchivedProjects] = useState([]);
    const [loadingArchived, setLoadingArchived] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    useEffect(() => {
        if (!showArchived || !user) return;
        let cancelled = false;

        const load = async () => {
            setLoadingArchived(true);
            try {
                const res = await taskApi.getProjects(user.token, { archived: "true" });
                if (!cancelled) setArchivedProjects(res.data);
            } catch (err) {
                console.error("Failed to load archived projects", err);
            } finally {
                if (!cancelled) setLoadingArchived(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [showArchived, user]);

    const handleArchiveToggle = async (project) => {
        await editProject(project._id, { archived: !project.archived });
        if (showArchived) {
            const res = await taskApi.getProjects(user.token, { archived: "true" });
            setArchivedProjects(res.data);
        }
    };

    const visibleProjects = showArchived ? archivedProjects : projects;

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Organize your work into projects.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowArchived((s) => !s)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${showArchived
                            ? "border-[var(--primary-color)] text-[var(--primary-color)]"
                            : "border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        {showArchived ? "Showing Archived" : "Show Archived"}
                    </button>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-[var(--primary-color)] text-white hover:opacity-90 transition-opacity"
                    >
                        <Plus size={16} /> New Project
                    </button>
                </div>
            </div>

            {showArchived && loadingArchived ? (
                <p className="text-sm text-[var(--text-tertiary)]">Loading archived projects...</p>
            ) : visibleProjects.length === 0 ? (
                <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-dashed border-[var(--border-color)]">
                    <Folder className="mx-auto mb-2 text-[var(--text-tertiary)]" size={28} />
                    <p className="text-[var(--text-secondary)] font-medium">
                        {showArchived ? "No archived projects" : "No projects yet"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visibleProjects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            token={user.token}
                            onEdit={setEditingProject}
                            onArchiveToggle={handleArchiveToggle}
                        />
                    ))}
                </div>
            )}

            <AddProjectModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onCreate={addProject} />
            <AddProjectModal
                isOpen={Boolean(editingProject)}
                onClose={() => setEditingProject(null)}
                project={editingProject}
                onUpdate={editProject}
            />
        </div>
    );
};

export default Projects;
