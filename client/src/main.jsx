import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ToastContainer";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ToastProvider>
      <TaskProvider>
        <ToastContainer />
        <App />
      </TaskProvider>
    </ToastProvider>
  </AuthProvider>
);
