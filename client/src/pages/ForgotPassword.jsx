import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { ArrowLeft, Mail } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

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
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email to receive a reset code"
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      }
    >
      <form onSubmit={submitHandler} className="space-y-5">
        <AuthInput
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <AuthButton type="submit" loading={loading} loadingText="Sending...">
          Send reset code
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
