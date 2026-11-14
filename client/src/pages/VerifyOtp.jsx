import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import usePageTitle from "../hooks/usePageTitle";
import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";


const VerifyOtp = () => {
    usePageTitle("Verify Email - Doora");
    const { state } = useLocation();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const { showToast } = useToast();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // Get email from router state or redirect to login
    const email = state?.email;

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
            const cleanOtp = otp.trim();
            const res = await api.post("/auth/verify-otp", { email, otp: cleanOtp });
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
            await api.post("/auth/resend-otp", { email });
            showToast("OTP resent successfully. Check your email.", "info");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to resend OTP");
        }
    };

    return (
        <AuthLayout
            title="Verify your account"
            subtitle={
                <>
                    Enter the code sent to{" "}
                    <span className="font-medium text-[var(--text-primary)]">{email}</span>
                    {" "}(check your spam folder too)
                </>
            }
            footer={
                <div className="space-y-4">
                    <div className="text-center">
                        <button
                            onClick={resendHandler}
                            className="text-sm text-[var(--primary-color)] hover:opacity-80 font-medium"
                        >
                            Resend OTP
                        </button>
                    </div>
                    <div className="text-center border-t border-[var(--border-color)] pt-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            Back to login
                        </button>
                    </div>
                </div>
            }
        >
            <form onSubmit={submitHandler} className="space-y-6">
                <AuthInput
                    label="6-digit code"
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
                    Verify &amp; continue
                </AuthButton>
            </form>
        </AuthLayout>
    );
};

export default VerifyOtp;
