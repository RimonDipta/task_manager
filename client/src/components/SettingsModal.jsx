import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { X, User, Lock, Moon, Sun, Sparkles, Laptop, Shield, Trash2, KeyRound, ShieldCheck } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import TwoFactorSetupModal from "./TwoFactorSetupModal";

/**
 * SettingsModal Component
 * 
 * A comprehensive modal for user settings including Profile, Security, and Theme preferences.
 * Uses a sidebar navigation within the modal for different setting categories.
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to close the modal
 */
const SettingsModal = ({ isOpen, onClose }) => {
    const { user, setUser } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { showToast } = useToast();

    // Navigation State
    const [activeTab, setActiveTab] = useState("general"); // 'general' or 'theme'

    // User Form State
    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Modals State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);

    if (!isOpen) return null;



    // --- Handlers ---

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setLoading(true);
            const res = await api.post("/users/profile-picture", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUser({ ...user, profilePicture: res.data.profilePicture });
            showToast("Profile picture updated", "success");
        } catch (err) {
            showToast(err.response?.data?.message || "Upload failed", "error");
        } finally {
            setLoading(false);
        }
    };

    const updateProfileHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await api.put("/users/profile", { name });
            setUser({ ...user, name: res.data.name }); // Keep profilePicture
            showToast("Profile updated successfully", "success");
        } catch (err) {
            showToast(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const updatePasswordHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return showToast("Passwords do not match");
        }
        try {
            setLoading(true);
            await api.put("/users/profile", { password });
            showToast("Password updated successfully", "success");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            showToast(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                <div className="bg-[var(--bg-card)] w-full max-w-4xl h-[600px] rounded-2xl shadow-2xl overflow-hidden flex animate-scaleIn border border-[var(--border-color)]">

                    {/* Sidebar */}
                    <div className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] flex flex-col">
                        <div className="p-6 border-b border-[var(--border-color)]">
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">Settings</h2>
                        </div>

                        <nav className="flex-1 p-4 space-y-2">
                            <button
                                onClick={() => setActiveTab("general")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "general"
                                    ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                <User size={18} />
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab("theme")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "theme"
                                    ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                <Sparkles size={18} />
                                Theme
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-main)]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] capitalize">
                                {activeTab} Settings
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8">

                            {/* GENERAL TAB */}
                            {activeTab === "general" && (
                                <div className="space-y-8 max-w-xl">
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Profile Information</h4>
                                        
                                        {/* Profile Picture Upload */}
                                        <div className="flex items-center gap-6">
                                            <div className="relative group">
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--bg-surface)] shadow-lg">
                                                    {user?.profilePicture ? (
                                                        <img 
                                                            src={user.profilePicture} 
                                                            alt="Profile" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-[var(--primary-light)]/20 flex items-center justify-center text-[var(--primary-color)]">
                                                            <User size={40} />
                                                        </div>
                                                    )}
                                                    
                                                    {/* Hover Overlay */}
                                                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                        <span className="text-white text-xs font-medium">Change</span>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            className="hidden" 
                                                            onChange={handleImageUpload}
                                                            disabled={loading}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-[var(--text-primary)]">{user?.name}</h3>
                                                <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
                                            </div>
                                        </div>

                                        <form onSubmit={updateProfileHandler} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[var(--primary-color)] transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={user?.email || ""}
                                                    disabled
                                                    className="w-full px-4 py-2 bg-[var(--bg-surface)] opacity-70 border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="pt-2">
                                                <button
                                                    disabled={loading}
                                                    className="px-6 py-2 bg-[var(--primary-color)] hover:opacity-90 text-white font-medium rounded-lg shadow-sm transition-all disabled:opacity-70"
                                                >
                                                    {loading ? "Saving..." : "Save Changes"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <hr className="border-[var(--border-color)]" />

                                    {/* Password Reset */}
                                    {/* Account Security */}
                                    <div className="space-y-4">
                                        <h4 className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                                            <Shield size={14} /> Security & Account
                                        </h4>

                                        <div className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-color)] overflow-hidden divide-y divide-[var(--border-color)]">
                                            {/* 2FA Toggle */}
                                            <div className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-lg">
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-medium text-[var(--text-primary)]">Two-Factor Authentication</h5>
                                                        <p className="text-sm text-[var(--text-secondary)]">
                                                            {user?.is2FAEnabled
                                                                ? `Enabled (${user.twoFactorMethod === 'app' ? 'Authenticator App' : 'Email'})`
                                                                : "Add an extra layer of security"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        if (user?.is2FAEnabled) {
                                                            try {
                                                                await api.post("/auth/2fa/disable");
                                                                setUser({ ...user, is2FAEnabled: false, twoFactorMethod: 'email' });
                                                                showToast("Two-Factor Authentication Disabled", "info");
                                                            } catch (err) {
                                                                showToast("Failed to disable 2FA", "error");
                                                            }
                                                        } else {
                                                            setShowTwoFactorSetup(true);
                                                        }
                                                    }}
                                                    className={`w-12 h-6 rounded-full transition-colors relative ${user?.is2FAEnabled ? 'bg-[var(--primary-color)]' : 'bg-slate-300 dark:bg-slate-600'}`}
                                                >
                                                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${user?.is2FAEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>

                                            {/* Change Password */}
                                            <div className="p-4 flex items-center justify-between">
                                                <div>
                                                    <h5 className="font-medium text-[var(--text-primary)]">Password</h5>
                                                    <p className="text-sm text-[var(--text-secondary)]">Change your login password</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowPasswordModal(true)}
                                                    className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    <KeyRound size={14} /> Change
                                                </button>
                                            </div>

                                            {/* Delete Account */}
                                            <div className="p-4 flex items-center justify-between bg-red-50/50 dark:bg-red-900/5">
                                                <div>
                                                    <h5 className="font-medium text-red-700 dark:text-red-400">Delete Account</h5>
                                                    <p className="text-sm text-red-600/70 dark:text-red-400/70">Permanently remove your data</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowDeleteModal(true)}
                                                    className="px-4 py-2 bg-white dark:bg-[var(--bg-card)] border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* THEME TAB */}
                            {activeTab === "theme" && (
                                <div className="space-y-6 max-w-xl">
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider mb-4">Appearance</h4>

                                        {/* Auto Mode Toggle */}
                                        <div className="flex items-center justify-between p-4 mb-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)]">
                                                    <Laptop size={20} />
                                                </div>
                                                <div>
                                                    <h5 className="font-medium text-[var(--text-primary)]">Sync with System</h5>
                                                    <p className="text-xs text-[var(--text-secondary)]">Automatically switch between light and dark mode</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleTheme(theme === 'system' ? 'light' : 'system')}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${theme === 'system' ? 'bg-[var(--primary-color)]' : 'bg-slate-300 dark:bg-slate-600'}`}
                                            >
                                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${theme === 'system' ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        {/* Manual Theme Grid */}
                                        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 transition-opacity ${theme === 'system' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                                            {[
                                                { id: 'light', icon: Sun, label: 'Light' },
                                                { id: 'dark', icon: Moon, label: 'Dark' },
                                                { id: 'galaxy', icon: Sparkles, label: 'Galaxy' },
                                                { id: 'sunset', icon: Sparkles, label: 'Sunset' },
                                                { id: 'ocean', icon: Sparkles, label: 'Ocean' }
                                            ].map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => toggleTheme(t.id)}
                                                    className={`relative p-3 rounded-xl border flex items-center gap-3 transition-all ${theme === t.id
                                                        ? "border-[var(--primary-color)] bg-[var(--primary-light)]/10"
                                                        : "border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-secondary)]"
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === t.id ? "bg-[var(--primary-color)] text-white" : "bg-[var(--bg-card)] text-[var(--text-secondary)]"
                                                        }`}>
                                                        <t.icon size={16} />
                                                    </div>
                                                    <span className={`font-medium text-sm ${theme === t.id ? "text-[var(--primary-color)]" : "text-[var(--text-primary)]"}`}>
                                                        {t.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Preview Box with Shapes */}
                                    <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                                        <h5 className="font-medium text-[var(--text-primary)] mb-4">Live Preview</h5>

                                        {/* Mini Window Mockup */}
                                        <div className="w-full aspect-[16/9] bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] shadow-lg overflow-hidden flex flex-col md:flex-row shadow-[var(--primary-light)]/20 transition-colors duration-300">

                                            {/* Mini Sidebar */}
                                            <div className="w-full md:w-1/4 h-16 md:h-full bg-[var(--bg-sidebar)] border-b md:border-r border-[var(--border-color)] p-3 flex md:flex-col gap-2 transition-colors duration-300">
                                                <div className="w-8 h-8 rounded-lg bg-[var(--primary-color)] opacity-20"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="w-3/4 h-2 rounded bg-[var(--text-secondary)] opacity-20"></div>
                                                    <div className="w-1/2 h-2 rounded bg-[var(--text-secondary)] opacity-20"></div>
                                                </div>
                                            </div>

                                            {/* Mini Content */}
                                            <div className="flex-1 p-4 bg-[var(--bg-main)] transition-colors duration-300">
                                                {/* Mini Header */}
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="w-1/3 h-4 rounded bg-[var(--text-primary)] opacity-80"></div>
                                                    <div className="w-8 h-8 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)]"></div>
                                                </div>

                                                {/* Mini Cards */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="h-20 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] shadow-sm p-2 flex flex-col justify-between">
                                                        <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] opacity-30"></div>
                                                        <div className="w-full h-2 rounded bg-[var(--text-secondary)] opacity-20"></div>
                                                    </div>
                                                    <div className="h-20 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] shadow-sm p-2 flex flex-col justify-between">
                                                        <div className="w-8 h-8 rounded-full bg-[var(--primary-color)]"></div>
                                                        <div className="w-full h-2 rounded bg-[var(--text-secondary)] opacity-20"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-[var(--text-secondary)] mt-4 text-center">
                                            Previewing <span className="font-bold capitalize">{theme}</span> Mode
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div >
            </div >
            <ChangePasswordModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />

            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            />

            <TwoFactorSetupModal 
                isOpen={showTwoFactorSetup} 
                onClose={() => setShowTwoFactorSetup(false)} 
            />
        </>
    );
};

export default SettingsModal;
