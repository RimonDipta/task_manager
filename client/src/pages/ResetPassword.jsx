import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { Eye, EyeOff, Zap, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";
import usePageTitle from "../hooks/usePageTitle";

const ResetPassword = () => {
  usePageTitle("Reset Password - Doora");
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Steps: 'verify' (enter OTP) -> 'reset' (enter new password)
  const [step, setStep] = useState(state?.step || 'verify');

  // State
  const [email, setEmail] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-reset-otp", { email, otp });
      setResetToken(res.data.resetToken);
      setStep('reset');
      showToast("Code verified", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return showToast("Passwords do not match", "error");
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { resetToken, password });
      showToast("Password reset successfully!", "success");
      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reset password", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4 transition-colors duration-300">
      <div className="w-full max-w-sm bg-[var(--bg-card)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] relative">

        {/* Logo */}
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-[var(--primary-color)] hover:opacity-80 transition-opacity">
            <Zap size={24} />
          </Link>
        </div>

        <div className="text-center mb-8 mt-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            {step === 'verify' ? "Verify Code" : "New Password"}
          </h2>
          <p className="text-[var(--text-secondary)] mt-2 text-sm">
            {step === 'verify'
              ? `Enter the code sent to ${email}`
              : "Create a strong password for your account"}
          </p>
        </div>

        {step === 'verify' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button
              disabled={loading}
              className="w-full py-2.5 bg-[var(--primary-color)] hover:opacity-90 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all pr-10"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-2.5 bg-[var(--primary-color)] hover:opacity-90 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
