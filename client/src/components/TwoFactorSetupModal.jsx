import { useState } from "react";
import { X, ShieldCheck, Mail, Smartphone, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const TwoFactorSetupModal = ({ isOpen, onClose }) => {
    const { user, setUser } = useAuth();
    const { showToast } = useToast();
    const [step, setStep] = useState(1); // 1: Method, 2: Scan (App), 3: Verify (App)
    const [method, setMethod] = useState(null); // 'email' | 'app'
    const [qrCode, setQrCode] = useState(null);
    const [secret, setSecret] = useState(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleMethodSelect = async (selectedMethod) => {
        setMethod(selectedMethod);
        if (selectedMethod === 'email') {
            try {
                setLoading(true);
                // Backend: /api/auth/2fa/enable with method='email'
                const res = await api.post("/auth/2fa/enable", { method: 'email' });
                setUser({ ...user, is2FAEnabled: true, twoFactorMethod: 'email' });
                showToast("2FA Enabled via Email", "success");
                onClose();
            } catch (err) {
                showToast(err.response?.data?.message || "Failed to enable 2FA", "error");
            } finally {
                setLoading(false);
            }
        } else {
            // App: Fetch QR
            try {
                setLoading(true);
                const res = await api.post("/auth/2fa/generate");
                setStep(2); // Move to Scan step
            } catch (err) {
                console.error("2FA Setup Error:", err);
                showToast(err.response?.data?.message || "Failed to generate QR Code", "error");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleVerifySetup = async () => {
        try {
            setLoading(true);
            // Verify and Enable
            const res = await api.post("/auth/2fa/enable", { 
                token, 
                method: 'app' 
            });
            setUser({ ...user, is2FAEnabled: true, twoFactorMethod: 'app' });
            showToast("2FA Enabled via Authenticator App", "success");
            onClose();
        } catch (err) {
            showToast(err.response?.data?.message || "Invalid Authenticator Code", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-2xl overflow-hidden animate-scaleIn">
                {/* Header */}
                <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-surface)]">
                    <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                        <ShieldCheck size={18} className="text-[var(--primary-color)]" />
                        Setup Two-Factor Auth
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-[var(--bg-main)] rounded-lg text-[var(--text-secondary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                Choose how you want to receive verification codes:
                            </p>

                            <button
                                onClick={() => handleMethodSelect('email')}
                                disabled={loading}
                                className="w-full p-4 rounded-xl border border-[var(--border-color)] hover:border-[var(--primary-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-main)] transition-all flex items-center gap-4 group text-left"
                            >
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-[var(--text-primary)]">Email Authentication</h4>
                                    <p className="text-xs text-[var(--text-secondary)]">Receive codes via your email address</p>
                                </div>
                                <ArrowRight size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--primary-color)] group-hover:translate-x-1 transition-all" />
                            </button>

                            <button
                                onClick={() => handleMethodSelect('app')}
                                disabled={loading}
                                className="w-full p-4 rounded-xl border border-[var(--border-color)] hover:border-[var(--primary-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-main)] transition-all flex items-center gap-4 group text-left"
                            >
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                    <Smartphone size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-[var(--text-primary)]">Authenticator App</h4>
                                    <p className="text-xs text-[var(--text-secondary)]">Use Google Auth, Authy, etc.</p>
                                </div>
                                <ArrowRight size={18} className="text-[var(--text-secondary)] group-hover:text-[var(--primary-color)] group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center space-y-6">
                            <div className="space-y-2">
                                <h4 className="font-medium text-[var(--text-primary)]">Scan QR Code</h4>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Open your Authenticator app and scan this code.
                                </p>
                            </div>

                            <div className="flex justify-center p-4 bg-white rounded-xl w-fit mx-auto border border-gray-200">
                                {qrCode ? (
                                    <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                                ) : (
                                    <div className="w-48 h-48 flex items-center justify-center text-gray-400">
                                        <Loader2 className="animate-spin" size={32} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Enter Verification Code</label>
                                    <input
                                        type="text"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        placeholder="000000"
                                        maxLength={6}
                                        className="w-full text-center text-2xl tracking-[0.5em] font-mono py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                                        autoFocus
                                    />
                                </div>

                                <button
                                    onClick={handleVerifySetup}
                                    disabled={loading || token.length !== 6}
                                    className="w-full py-2 bg-[var(--primary-color)] text-white hover:opacity-90 rounded-lg font-medium transition-all disabled:opacity-50"
                                >
                                    {loading ? "Verifying..." : "Enable 2FA"}
                                </button>

                                <button onClick={() => setStep(1)} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                    Back to methods
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwoFactorSetupModal;
