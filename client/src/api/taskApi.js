import api from "./axios";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getTasks = (token, params) =>
  api.get("/tasks", {
    ...authConfig(token),
    params,
  });

export const createTask = (data, token) =>
  api.post("/tasks", data, authConfig(token));

export const updateTask = (id, data, token) =>
  api.put(`/tasks/${id}`, data, authConfig(token));

export const deleteTask = (id, token) =>
  api.delete(`/tasks/${id}`, authConfig(token));

export const bulkUpdateTasks = (ids, data, token) =>
  api.put("/tasks/bulk", { ids, data }, authConfig(token));

export const bulkDeleteTasks = (ids, token) =>
  api.delete("/tasks/bulk", { ...authConfig(token), data: { ids } });

// Projects
export const getProjects = (token, params) =>
  api.get("/projects", { ...authConfig(token), params });

export const createProject = (data, token) =>
  api.post("/projects", data, authConfig(token));

export const updateProject = (id, data, token) =>
  api.put(`/projects/${id}`, data, authConfig(token));

export const deleteProject = (id, token) =>
  api.delete(`/projects/${id}`, authConfig(token));
