import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import api from "../api/axios";
import usePageTitle from "../hooks/usePageTitle";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

const Login = () => {
  usePageTitle("Login - Doora");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [is2FABlocked, setIs2FABlocked] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState("");
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

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
          setTwoFactorMessage(res.data.message || "Enter your 2FA code");
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
    <AuthLayout
      title={is2FABlocked ? "Enter code" : "Welcome back"}
      subtitle={is2FABlocked ? twoFactorMessage : "Sign in to your account to continue"}
      footer={
        !is2FABlocked ? (
          <p className="text-sm text-center text-[var(--text-secondary)]">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-[var(--primary-color)] font-medium hover:underline">
              Create account
            </Link>
          </p>
        ) : (
          <button
            onClick={() => setIs2FABlocked(false)}
            className="w-full text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Cancel and go back
          </button>
        )
      }
    >
      {is2FABlocked && (
        <div className="mx-auto w-12 h-12 -mt-2 mb-6 bg-indigo-500/10 text-[var(--primary-color)] rounded-2xl flex items-center justify-center">
          <ShieldCheck size={22} />
        </div>
      )}

      <form onSubmit={submitHandler} className="space-y-4">
        {!is2FABlocked ? (
          <>
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-[var(--text-secondary)]">Password</label>
                <Link to="/forgot-password" className="text-sm text-[var(--primary-color)] hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <AuthInput
                icon={Lock}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <div>
            <AuthInput
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              autoFocus
              className="text-center text-2xl tracking-[0.5em] font-mono !pl-4"
            />
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoading(true);
                    const res = await loginUser({ email, password, useBackup: true });
                    if (res.data && res.data['2faRequired']) {
                      setTwoFactorMessage("Backup verification code sent to your email");
                      showToast("Backup code sent to email", "success");
                    }
                  } catch (err) {
                    console.error("Failed to send backup code", err);
                    showToast("Failed to send backup code");
                  } finally {
                    setLoading(false);
                  }
                }}
                className="text-sm text-[var(--primary-color)] hover:underline"
              >
                Lost access to Authenticator?
              </button>
            </div>
          </div>
        )}

        <AuthButton type="submit" loading={loading} loadingText={is2FABlocked ? "Verifying..." : "Signing in..."} className="mt-2">
          {is2FABlocked ? "Verify code" : "Sign in"}
        </AuthButton>
      </form>
    </AuthLayout>
  );
};

export default Login;
