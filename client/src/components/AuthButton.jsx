import { Loader2 } from "lucide-react";

/**
 * Primary call-to-action button for auth forms: consistent gradient,
 * loading spinner, and disabled state across every screen.
 */
const AuthButton = ({ loading = false, loadingText, children, className = "", ...props }) => (
    <button
        disabled={loading}
        className={`w-full py-2.5 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
        {...props}
    >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? loadingText || children : children}
    </button>
);

export default AuthButton;
