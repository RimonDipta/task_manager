import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import PasswordStrength from "../components/PasswordStrength";
import { getPasswordStrength } from "../utils/passwordStrength";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    const strength = getPasswordStrength(password);

    if (strength.score < 3) {
      return showToast("Password is too weak");
    }

    e.preventDefault();

    if (!name || !email || !password) {
      return showToast("All fields are required");
    }

    if (password !== confirmPassword) {
      return showToast("Passwords do not match");
    }

    try {
      setLoading(true);
      setError(null);
      const res = await registerUser({ name, email, password });
      if (res.data.otp) {
        console.log("🔒 OTP for verification:", res.data.otp);
      }
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4 transition-colors duration-300">
      <div className="w-full max-w-sm bg-[var(--bg-card)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Create account</h2>
          <p className="text-[var(--text-secondary)] mt-2">Start managing your tasks today</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
            <input
              name="name"
              className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all"
              placeholder="John Doe"
              value={name}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Email address</label>
            <input
              name="email"
              className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all"
              placeholder="name@company.com"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all"
              placeholder="••••••••"
              value={password}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </div>

          <PasswordStrength password={password} />

          <button
            disabled={loading}
            className="w-full py-2.5 bg-[var(--primary-color)] hover:opacity-90 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center mt-8 text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--primary-color)] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
