import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import AuthButton from "../components/AuthButton";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <AuthLayout compact>
      {status === "loading" && (
        <div>
          <Loader2 size={40} className="mx-auto mb-4 text-[var(--primary-color)] animate-spin" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Verifying email...</h2>
          <p className="text-[var(--text-secondary)] mt-2">Please wait while we confirm your address.</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={28} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Verification failed</h2>
          <p className="text-[var(--text-secondary)] mt-2">The verification link is invalid or has expired.</p>
          <AuthButton onClick={() => (window.location.href = "/login")} className="mt-6">
            Back to login
          </AuthButton>
        </div>
      )}

      {status === "success" && (
        <div>
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Email verified!</h2>
          <p className="text-[var(--text-secondary)] mt-2">Your account has been successfully verified.</p>
          <AuthButton onClick={() => (window.location.href = "/login")} className="mt-6">
            Continue to login
          </AuthButton>
        </div>
      )}
    </AuthLayout>
  );
};

export default VerifyEmail;
