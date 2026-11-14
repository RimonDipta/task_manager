import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { useToast } from "../context/ToastContext";
import { User, Mail, Lock } from "lucide-react";

import PasswordStrength from "../components/PasswordStrength";
import { getPasswordStrength } from "../utils/passwordStrength";
import usePageTitle from "../hooks/usePageTitle";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

const Register = () => {
  usePageTitle("Create Account - Doora");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();

    const strength = getPasswordStrength(password);

    if (strength.score < 3) {
      return showToast("Password is too weak");
    }

    if (!name || !email || !password) {
      return showToast("All fields are required");
    }

    if (password !== confirmPassword) {
      return showToast("Passwords do not match");
    }

    try {
      setLoading(true);
      await registerUser({ name, email, password });
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start managing your tasks today"
      footer={
        <p className="text-sm text-center text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--primary-color)] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={submitHandler} className="space-y-4">
        <AuthInput
          label="Full name"
          icon={User}
          name="name"
          placeholder="John Doe"
          value={name}
          onChange={onChange}
          required
          autoFocus
        />

        <AuthInput
          label="Email address"
          icon={Mail}
          type="email"
          name="email"
          placeholder="name@company.com"
          value={email}
          onChange={onChange}
          required
        />

        <AuthInput
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={onChange}
          required
        />

        <AuthInput
          label="Confirm password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={onChange}
          required
        />

        <PasswordStrength password={password} />

        <AuthButton type="submit" loading={loading} loadingText="Creating account..." className="mt-2">
          Create account
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default Register;
