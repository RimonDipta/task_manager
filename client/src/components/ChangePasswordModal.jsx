import { useState } from "react";
import { X, Lock, Check, AlertCircle } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const { showToast } = useToast();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return showToast("New passwords do not match", "error");
        }

        if (newPassword.length < 6) {
            return showToast("Password must be at least 6 characters", "error");
        }

        try {
            setLoading(true);
            await api.put("/users/profile", {
                oldPassword,
                password: newPassword
            });
            showToast("Password updated successfully", "success");
            onClose();
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to update password", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden animate-scaleIn">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Lock size={18} className="text-[var(--primary-color)]" />
                        Change Password
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--border-color)] rounded-full transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-[var(--text-secondary)]">Current Password</label>
                        <input
                            type="password"
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-[var(--text-secondary)]">New Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
                            placeholder="Min. 6 characters"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-[var(--text-secondary)]">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent outline-none transition-all"
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-surface)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--primary-color)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-pulse">Updating...</span> : <><Check size={18} /> Update Password</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
