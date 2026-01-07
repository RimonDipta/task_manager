import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyOtp from "./pages/VerifyOtp";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import { useEffect } from "react";

import LandingPage from "./pages/LandingPage"; // Import LandingPage
import HomeView from "./pages/HomeView"; // Import HomeView

function App() {

  // Global Keyboard Shortcuts
  useEffect(() => {
    // ... code ...
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <TaskProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route element={<Layout />}>
                  <Route
                    path="/dashboard"
                    element={<Navigate to="/dashboard/home" replace />}
                  />
                  <Route
                    path="/dashboard/list"
                    element={<Navigate to="/dashboard/home" replace />}
                  />

                  {/* Home View */}
                  <Route
                    path="/dashboard/home"
                    element={
                      <PrivateRoute>
                        <HomeView />
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/dashboard/today"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard/upcoming"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard/completed"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard/kanban"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard/analytics"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </TaskProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
