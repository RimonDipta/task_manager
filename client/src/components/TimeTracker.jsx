import { useEffect, useState } from 'react';
import { Timer, Hourglass } from 'lucide-react';

const TimeTracker = ({ task }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isOver, setIsOver] = useState(false);

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
    }, [task]);

    if (!timeLeft) return null;

    return (
        <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${isOver ? "bg-red-50 text-red-600 border-red-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
            }`}>
            {isOver ? <Hourglass size={12} /> : <Timer size={12} />}
            <span>{isOver ? "Time's up" : `${timeLeft} left`}</span>
        </div>
    );
};

export default TimeTracker;
