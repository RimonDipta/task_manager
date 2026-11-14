import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Labeled text input for auth forms: optional left icon, optional
 * password-visibility toggle (pass `type="password"`), consistent focus
 * ring and sizing across every auth screen.
 */
const AuthInput = forwardRef(
    ({ label, icon: Icon, type = "text", className = "", containerClassName = "", ...props }, ref) => {
        const [revealed, setRevealed] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword ? (revealed ? "text" : "password") : type;

        return (
            <div className={containerClassName}>
                {label && (
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {Icon && (
                        <Icon
                            size={18}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
                        />
                    )}
                    <input
                        ref={ref}
                        type={inputType}
                        className={`w-full py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none focus:ring-2 focus:ring-[var(--primary-color)]/25 focus:border-[var(--primary-color)] transition-all ${Icon ? "pl-10" : "pl-4"
                            } ${isPassword ? "pr-10" : "pr-4"} ${className}`}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setRevealed((r) => !r)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
            </div>
        );
    }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
