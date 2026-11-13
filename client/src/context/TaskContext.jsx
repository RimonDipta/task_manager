import { useEffect, createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import * as taskApi from "../api/taskApi";
import { useToast } from "../context/ToastContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]); // Projects State
  const [loading, setLoading] = useState(false);

  // We remove the auto-fetch on mount from here because Dashboard/Pages will control it.
  // Or we can keep it with default args.
  // Actually, let's keep it but make it responsive to a new 'filter' state if we want global filter.
  // But pages have local Views.
  // Let's allow fetchTasks to take args.

  useEffect(() => {
    // Initial load? maybe just let components trigger it.
    // Providing a default load for initial context populate.
    if (user) {
      fetchProjects(); // Load projects globally
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const res = await taskApi.getProjects(user.token);
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const addProject = async (projectData) => {
    try {
      const res = await taskApi.createProject(projectData, user.token);
      setProjects([res.data, ...projects]);
      return res.data;
    } catch (err) {
      showToast("Failed to create project");
      throw err;
    }
  };

  const editProject = async (id, data) => {
    try {
      const res = await taskApi.updateProject(id, data, user.token);
      setProjects((prev) => {
        // Archiving (or restoring into a list that excludes it) removes/re-adds
        // the project, mirroring what the backend's default "hide archived" filter returns.
        if (res.data.archived) {
          return prev.filter((p) => p._id !== id);
        }
        const exists = prev.some((p) => p._id === id);
        return exists ? prev.map((p) => (p._id === id ? res.data : p)) : [res.data, ...prev];
      });
      return res.data;
    } catch (err) {
      console.error("Failed to update project", err);
      showToast("Failed to update project");
      throw err;
    }
  };

  const removeProject = async (id) => {
    try {
      await taskApi.deleteProject(id, user.token);
      setProjects(projects.filter(p => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
      showToast("Failed to delete project");
    }
  };

  const fetchTasks = async (customParams = {}) => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await taskApi.getTasks(user.token, {
        page,
        limit: 10, // Increased default limit
        search,
        ...customParams // { filter: 'today', page: 1, etc }
      });

      setTasks(res.data.tasks);
      setPages(res.data.pages);
    } catch {
      showToast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      setLoading(true);
      const res = await taskApi.createTask(task, user.token);
      setTasks([res.data, ...tasks]);
    } catch {
      showToast("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, data) => {
    try {
      const res = await taskApi.updateTask(id, data, user.token);
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch {
      showToast("Failed to update task");
    }
  };

  const removeTask = async (id) => {
    try {
      await taskApi.deleteTask(id, user.token);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch {
      showToast("Failed to delete task");
    }
  };

  const bulkUpdateTasks = async (ids, data) => {
    try {
      const res = await taskApi.bulkUpdateTasks(ids, data, user.token);
      const updatedById = new Map(res.data.map((t) => [t._id, t]));
      setTasks((prev) => prev.map((t) => updatedById.get(t._id) || t));
      return res.data;
    } catch (err) {
      console.error("Failed to bulk update tasks", err);
      showToast("Failed to update tasks");
      throw err;
    }
  };

  const bulkDeleteTasks = async (ids) => {
    try {
      await taskApi.bulkDeleteTasks(ids, user.token);
      const idSet = new Set(ids);
      setTasks((prev) => prev.filter((t) => !idSet.has(t._id)));
    } catch (err) {
      console.error("Failed to bulk delete tasks", err);
      showToast("Failed to delete tasks");
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        page,
        pages,
        setPage,
        search,
        setSearch,
        addTask,
        updateTask,
        removeTask,
        bulkUpdateTasks,
        bulkDeleteTasks,
        fetchTasks,
        projects,
        fetchProjects,
        addProject,
        editProject,
        removeProject
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
