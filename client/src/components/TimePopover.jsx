import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const Column = ({ value, type, onAdjust }) => {
    // Determine previous and next values for visual effect
    let prevVal, nextVal;

    if (type === 'hour') {
        prevVal = value - 1 < 1 ? 12 : value - 1;
        nextVal = value + 1 > 12 ? 1 : value + 1;
    } else if (type === 'minute') {
        prevVal = value - 1 < 0 ? 59 : value - 1;
        nextVal = value + 1 > 59 ? 0 : value + 1;
    } else { // period
        prevVal = value === "AM" ? "PM" : "AM";
        nextVal = value === "AM" ? "PM" : "AM";
    }

    const formatVal = (v) => type === 'minute' ? v.toString().padStart(2, '0') : v;

    return (
        <div className="flex flex-col items-center gap-1 w-16 relative">
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAdjust(type, -1); }}
                className="absolute -top-6 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1"
            >
                <ChevronUp size={16} />
            </button>

            {/* Stack */}
            <div className="flex flex-col items-center gap-2 select-none pointer-events-none">
                {/* Previous */}
                <span className="text-xl font-medium text-[var(--text-tertiary)] opacity-30 blur-[1px] transform scale-75">
                    {formatVal(prevVal)}
                </span>
                {/* Current */}
                <span className="text-2xl font-bold text-[var(--text-primary)] transform scale-100 z-10 my-1">
                    {formatVal(value)}
                </span>
                {/* Next */}
                <span className="text-xl font-medium text-[var(--text-tertiary)] opacity-30 blur-[1px] transform scale-75">
                    {formatVal(nextVal)}
                </span>
            </div>

            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAdjust(type, 1); }}
                className="absolute -bottom-6 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1"
            >
                <ChevronDown size={16} />
            </button>
        </div>
    );
};

// Parses the initial hour/minute/period either from a "HH:MM" selected
// time, or the current time when none is set yet.
const parseInitialTime = (selectedTime) => {
    let h, m;
    if (selectedTime) {
        [h, m] = selectedTime.split(':').map(Number);
    } else {
        const now = new Date();
        h = now.getHours();
        m = now.getMinutes();
    }
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const period = h >= 12 ? "PM" : "AM";
    return { hour, minute: m, period };
};

const TimePopover = ({ selectedTime, onSelect, onClear }) => {
    // Lazy initializers run once, on mount — this popover is always
    // conditionally rendered (mounted fresh each time it opens), so this is
    // equivalent to the mount-only effect it replaces, without needing one.
    const [hour, setHour] = useState(() => parseInitialTime(selectedTime).hour);
    const [minute, setMinute] = useState(() => parseInitialTime(selectedTime).minute);
    const [period, setPeriod] = useState(() => parseInitialTime(selectedTime).period);

    // Sync back to parent when values change
    useEffect(() => {
        let h = hour;
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        const timeString = `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // We only call onSelect when final? Or live? 
        // Usually live for inputs, but maybe messy if user is scrolling.
        // Let's call it live to keep sync.
        onSelect(timeString);
    }, [hour, minute, period]);


    const adjust = (type, delta) => {
        if (type === 'hour') {
            let newH = hour + delta;
            if (newH > 12) newH = 1;
            if (newH < 1) newH = 12;
            setHour(newH);
        } else if (type === 'minute') {
            let newM = minute + delta;
            if (newM > 59) newM = 0;
            if (newM < 0) newM = 59;
            setMinute(newM);
        } else if (type === 'period') {
            setPeriod(period === "AM" ? "PM" : "AM");
        }
    };

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 min-w-[280px] relative overflow-hidden">

            {/* Gradient Masks */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[var(--bg-card)] to-transparent pointer-events-none z-20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--bg-card)] to-transparent pointer-events-none z-20"></div>

            {/* No Time Action */}
            <div className="flex justify-end mb-4 relative z-30">
                <button
                    type="button"
                    onClick={() => { if (onClear) onClear(); }}
                    className="text-xs font-medium text-[var(--text-tertiary)] hover:text-red-500 transition-colors"
                >
                    Clear / No Time
                </button>
            </div>

            <div className="flex items-center justify-center gap-2 py-4 relative z-10">
                <Column value={hour} type="hour" onAdjust={adjust} />
                <span className="text-2xl font-bold text-[var(--text-tertiary)] pb-1">:</span>
                <Column value={minute} type="minute" onAdjust={adjust} />
                <div className="w-4"></div>
                <Column value={period} type="period" onAdjust={adjust} />
            </div>

        </div>
    );
};

export default TimePopover;
