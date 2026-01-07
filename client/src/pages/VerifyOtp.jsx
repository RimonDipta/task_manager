import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageTitle from "../hooks/usePageTitle";
import usePageTitle from "../hooks/usePageTitle";

const VerifyOtp = () => {
    usePageTitle("Verify Email - Doora");
    const { state } = useLocation();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const { showToast } = useToast();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // Get email from router state or redirect to login
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [email, navigate]);

    if (!email) return null;

    const submitHandler = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            return showToast("Please enter a valid 6-digit OTP");
        }

        try {
            setLoading(true);
            const res = await api.post("/auth/verify-otp", { email, otp });
            setUser(res.data);
            showToast("Email verified successfully!", "success");
            navigate("/");
        } catch (err) {
            showToast(err.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const resendHandler = async () => {
        try {
            const res = await api.post("/auth/resend-otp", { email });
            if (res.data.otp) {
                console.log("🔒 Resent OTP:", res.data.otp);
            }
            showToast("OTP resent successfully. Check your console/email.", "info");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to resend OTP");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4 transition-colors duration-300">
            <div className="w-full max-w-sm bg-[var(--bg-card)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)]">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Verify your account</h2>
                    <p className="text-[var(--text-secondary)] mt-2 text-sm">
                        Please verify yourself to use the app.
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] opacity-70 mt-1">
                        Check <span className="font-medium text-[var(--text-primary)]">{email}</span> to see the OTP.
                    </p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5 text-center">Enter 6-digit OTP</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] text-[var(--text-primary)] transition-all text-center text-2xl tracking-widest font-mono"
                            placeholder="000000"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            // Removed strict replace to debug "cant enter" issue, or maybe user was typing letters?
                            // Let's rely on backend validation or add a cleaner onBlur if needed.
                            // But for now, just set value directly to avoid "controlled input locking" issues if regex fails.
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full py-2.5 bg-[var(--primary-color)] hover:opacity-90 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Verify & Login"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={resendHandler}
                        className="text-sm text-[var(--primary-color)] hover:opacity-80 font-medium"
                    >
                        Resend OTP
                    </button>
                </div>

                <div className="mt-4 text-center border-t border-[var(--border-color)] pt-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
