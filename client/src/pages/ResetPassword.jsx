import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, Lock } from "lucide-react";
import { useToast } from "../context/ToastContext";
import usePageTitle from "../hooks/usePageTitle";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

const ResetPassword = () => {
  usePageTitle("Reset Password - Doora");
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Steps: 'verify' (enter OTP) -> 'reset' (enter new password)
  const [step, setStep] = useState(state?.step || 'verify');

  // State
  const [email] = useState(state?.email || "");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI State
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
    <AuthLayout
      title={step === 'verify' ? "Verify code" : "New password"}
      subtitle={step === 'verify' ? `Enter the code sent to ${email}` : "Create a strong password for your account"}
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
      {step === 'verify' ? (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <AuthInput
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            autoFocus
            className="text-center text-2xl tracking-widest font-mono !pl-4"
          />
          <AuthButton type="submit" loading={loading} loadingText="Verifying...">
            Verify code
          </AuthButton>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <AuthInput
            label="New password"
            icon={Lock}
            type="password"
            placeholder="Min 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoFocus
          />

          <AuthInput
            label="Confirm password"
            icon={Lock}
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <AuthButton type="submit" loading={loading} loadingText="Resetting...">
            Reset password
          </AuthButton>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
