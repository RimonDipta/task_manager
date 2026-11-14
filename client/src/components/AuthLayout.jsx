import { Link } from "react-router-dom";
import DooraLogo from "./DooraLogo";
import { CheckCircle2 } from "lucide-react";

const HIGHLIGHTS = [
    "Organize tasks across projects, priorities, and views",
    "Kanban, calendar, and priority boards that stay in sync",
    "A focus timer that keeps running while you switch tasks",
];

/**
 * Shared shell for every auth screen (login, register, forgot/reset
 * password, OTP verification): a branded panel on large screens, the
 * actual form on the right. On small screens the brand panel collapses
 * to just the logo above the form.
 */
const AuthLayout = ({ title, subtitle, children, footer, compact = false }) => {
    return (
        <div className="min-h-screen flex bg-[var(--bg-main)] transition-colors duration-300">
            {/* Brand panel */}
            <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-800 to-indigo-950 text-white p-12 flex-col justify-between">
                <div
                    className="absolute inset-0 opacity-50"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)",
                        backgroundSize: "28px 28px",
                    }}
                />
                <div className="absolute -top-28 -right-20 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />

                <Link to="/" className="relative flex items-center gap-2.5 font-bold text-lg">
                    <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15">
                        <DooraLogo size={20} />
                    </div>
                    Doora
                </Link>

                <div className="relative space-y-8 max-w-sm">
                    <blockquote className="text-[1.75rem] font-semibold leading-snug tracking-tight">
                        The calmest way to get work done — one focused task at a time.
                    </blockquote>
                    <ul className="space-y-3">
                        {HIGHLIGHTS.map((h) => (
                            <li key={h} className="flex items-start gap-3 text-sm text-indigo-100/90">
                                <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-300" />
                                {h}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="relative text-xs text-indigo-200/50">
                    &copy; {new Date().getFullYear()} Doora. Built for focused work.
                </p>
            </div>

            {/* Form panel */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
                <div className={compact ? "w-full max-w-sm text-center" : "w-full max-w-sm"}>
                    <Link
                        to="/"
                        className={`lg:hidden flex items-center gap-2 font-bold text-[var(--primary-color)] mb-8 ${compact ? "justify-center" : ""
                            }`}
                    >
                        <DooraLogo size={24} />
                        <span>Doora</span>
                    </Link>

                    {title && (
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                                {title}
                            </h1>
                            {subtitle && <p className="text-[var(--text-secondary)] mt-2">{subtitle}</p>}
                        </div>
                    )}

                    {children}

                    {footer && <div className="mt-8">{footer}</div>}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
