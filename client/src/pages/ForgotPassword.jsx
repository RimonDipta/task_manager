import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { Zap, ArrowLeft } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const ForgotPassword = () => {
  usePageTitle("Forgot Password - Doora");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      showToast("OTP sent to your email", "success");
      // Navigate to ResetPassword page with email in state
      navigate("/reset-password", { state: { email, step: 'verify' } });
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
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

        <div className="text-center mb-8 mt-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            Forgot Password
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            Enter your email to receive a reset code
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Email address
            </label>
            <input
              className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[var(--primary-color)] hover:opacity-90 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

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

export default ForgotPassword;
