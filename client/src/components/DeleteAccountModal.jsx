import { useState, useContext } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DeleteAccountModal = ({ isOpen, onClose }) => {
    const { showToast } = useToast();
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            // Axios delete with body requires 'data' property
            await api.delete("/users/profile", {
                data: { password }
            });

            showToast("Account deleted successfully", "success");
            logout();
            navigate("/login");

        } catch (err) {
            showToast(err.response?.data?.message || "Failed to delete account", "error");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[var(--bg-card)] w-full max-w-md rounded-2xl shadow-2xl border border-red-200 overflow-hidden animate-scaleIn">

                {/* Header */}
                <div className="bg-red-50 dark:bg-red-900/10 p-6 border-b border-red-100 dark:border-red-900/20 flex items-start gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-700 dark:text-red-400">Delete Account?</h3>
                        <p className="text-sm text-red-600/80 dark:text-red-400/70 mt-1">
                            This action is permanent and cannot be undone. All your data will be wiped.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-red-400 hover:text-red-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleDelete} className="p-6 space-y-4">

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-[var(--text-primary)]">
                            Confirm your password to proceed
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-surface)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "Deleting..." : <><Trash2 size={18} /> Delete Forever</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
