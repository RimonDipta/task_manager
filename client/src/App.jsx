import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { lazy, Suspense, useEffect } from "react";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import ToastContainer from "./components/ToastContainer";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy Load Pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const Tasks = lazy(() => import("./pages/Tasks"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const HomeView = lazy(() => import("./pages/HomeView"));
const PlaceholderPage = lazy(() => import("./pages/PlaceholderPage"));

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
            <ToastContainer />
            <TaskProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />

                  {/* Demo Pages Route */}
                  <Route path="/pages/:slug" element={<PlaceholderPage />} />

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
                    <Route
                      path="/tasks"
                      element={
                        <PrivateRoute>
                          <Tasks />
                        </PrivateRoute>
                      }
                    />
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </TaskProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
