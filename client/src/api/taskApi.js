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

// Projects
export const getProjects = (token) =>
  api.get("/projects", authConfig(token));

export const createProject = (data, token) =>
  api.post("/projects", data, authConfig(token));

export const deleteProject = (id, token) =>
  api.delete(`/projects/${id}`, authConfig(token));
