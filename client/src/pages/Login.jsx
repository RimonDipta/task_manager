import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ShieldCheck, Eye, EyeOff, Zap } from "lucide-react";
import api from "../api/axios";
import usePageTitle from "../hooks/usePageTitle";

const Login = () => {
  usePageTitle("Login - Doora");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [is2FABlocked, setIs2FABlocked] = useState(false);
  const { setUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (is2FABlocked) {
        // Verify 2FA OTP
        const res = await api.post("/auth/verify-otp", { email, otp });
        setUser(res.data);
        showToast(`Welcome back, ${res.data.name}!`, "success");
        navigate("/dashboard");
      } else {
        // Normal Login
        const res = await loginUser({ email, password });

        if (res.data && res.data['2faRequired']) {
          setIs2FABlocked(true);
          setLoading(false);
          showToast(res.data.message, "info");
          return;
        }

        setUser(res.data);
        showToast(`Welcome back, ${res.data?.name}!`, "success");
        navigate("/dashboard");
      }
    } catch (err) {
      if (
        err.response?.status === 401 &&
        (err.response?.data?.errorCode === "EMAIL_NOT_VERIFIED" || err.response?.data?.message === "Please verify your email")
      ) {
        navigate("/verify-otp", { state: { email: err.response.data.email || email } });
        return;
      }
      showToast(err.response?.data?.message || "Invalid email or password");
    } finally {
      if (!is2FABlocked) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4 transition-colors duration-300">
      <div className="w-full max-w-sm bg-[var(--bg-card)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] relative">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-[var(--primary-color)] hover:opacity-80 transition-opacity">
            <Zap size={24} />
          </Link>
        </div>
        <div className="text-center mb-8">
          {is2FABlocked ? (
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
          ) : null}
          <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {is2FABlocked ? "Enter Code" : "Welcome back"}
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            {is2FABlocked ? "We sent a 6-digit code to your email" : "Sign in to your account to continue"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-5">
          {!is2FABlocked ? (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email address</label>
                <input
                  className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-[var(--text-secondary)]">Password</label>
                  <Link to="/forgot-password" className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-color)] font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5 text-center">Authentication Code</label>
              <input
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all text-center text-2xl tracking-[0.5em] font-mono"
                placeholder="000000"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoFocus
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[var(--primary-color)] hover:opacity-90 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (is2FABlocked ? "Verifying..." : "Signing in...") : (is2FABlocked ? "Verify Code" : "Sign in")}
          </button>
        </form>

        {!is2FABlocked && (
          <p className="text-sm text-center mt-8 text-[var(--text-secondary)]">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[var(--primary-color)] hover:text-[var(--primary-color)] font-medium hover:underline">
              Create account
            </Link>
          </p>
        )}

        {is2FABlocked && (
          <button onClick={() => setIs2FABlocked(false)} className="w-full text-center mt-6 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Cancel and go back
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
