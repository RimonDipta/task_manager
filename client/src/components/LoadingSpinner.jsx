import { Zap } from "lucide-react";

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-main)] text-[var(--primary-color)] transition-colors duration-300">
            <div className="relative">
                <Zap size={48} className="animate-pulse" />
                <div className="absolute inset-0 bg-[var(--primary-color)] blur-2xl opacity-20 animate-pulse"></div>
            </div>
            <p className="mt-4 text-[var(--text-secondary)] font-medium animate-pulse">Loading Doora...</p>
        </div>
    );
};

export default LoadingSpinner;
