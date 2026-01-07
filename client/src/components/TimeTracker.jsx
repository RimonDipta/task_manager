import { useEffect, useState } from 'react';
import { Timer, Hourglass } from 'lucide-react';
import { useToast } from "../context/ToastContext";

const TimeTracker = ({ task }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isOver, setIsOver] = useState(false);
    const [notified, setNotified] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (!task.startTime || !task.duration) return;

        const calculateTime = () => {
            const start = new Date(task.startTime).getTime();
            const durationMs = task.duration * 60 * 1000;
            const end = start + durationMs;
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                setIsOver(true);
                setTimeLeft("0m");
                return;
            }

            // Notification Logic: Warn if <= 5 minutes left and not yet notified
            // Only if total duration was > 5 mins (to avoid immediate warning on short tasks)
            if (task.duration > 5 && diff <= 5 * 60 * 1000 && !notified) {
                showToast(`⏳ Task "${task.title}" has less than 5 minutes remaining!`, "warning");
                setNotified(true);
                // Play sound if possible? 
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        };

        const timer = setInterval(calculateTime, 1000);
        calculateTime(); // Initial

        return () => clearInterval(timer);
    }, [task, notified]);

    // Helper to format minutes to "1h 30m"
    const formatDuration = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    if (!task.startTime) {
        // Not started yet, show static duration
        return (
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-500 border-slate-200`}>
                <Timer size={12} />
                <span>{formatDuration(task.duration)}</span>
            </div>
        );
    }

    if (!timeLeft) return null;

    return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${isOver ? "bg-red-50 text-red-600 border-red-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
            }`}>
            {isOver ? <Hourglass size={12} /> : <Timer size={12} />}
            <span>{isOver ? "Time's up" : `${timeLeft} left`}</span>
        </div>
    );
};

export default TimeTracker;
