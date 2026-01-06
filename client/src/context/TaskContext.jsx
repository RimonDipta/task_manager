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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [page, search]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await taskApi.getTasks(user.token, {
        page,
        limit: 5,
        search,
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
        fetchTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
