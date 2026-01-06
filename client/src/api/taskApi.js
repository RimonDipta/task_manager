import api from "./axios";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getTasks = (token, params) =>
  api.get("/tasks", authConfig(token), {
    params,
  });

export const createTask = (data, token) =>
  api.post("/tasks", data, authConfig(token));

export const updateTask = (id, data, token) =>
  api.put(`/tasks/${id}`, data, authConfig(token));

export const deleteTask = (id, token) =>
  api.delete(`/tasks/${id}`, authConfig(token));
