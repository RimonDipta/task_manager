import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const TimePopover = ({ selectedTime, onSelect, onClose, onClear }) => {
    const [hour, setHour] = useState(12);
    const [minute, setMinute] = useState(0);
    const [period, setPeriod] = useState("PM");

    // Initialize
    useEffect(() => {
        if (selectedTime) {
            const [h, m] = selectedTime.split(':').map(Number);
            let parsedHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
            let parsedPeriod = h >= 12 ? "PM" : "AM";
            setHour(parsedHour);
            setMinute(m);
            setPeriod(parsedPeriod);
        } else {
            const now = new Date();
            let h = now.getHours();
            let m = now.getMinutes();
            let parsedHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
            let parsedPeriod = h >= 12 ? "PM" : "AM";
            setHour(parsedHour);
            setMinute(m);
            setPeriod(parsedPeriod);
        }
    }, []);

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

    const Column = ({ value, type, label }) => {
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
                    onClick={(e) => { e.stopPropagation(); adjust(type, -1); }}
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
                    onClick={(e) => { e.stopPropagation(); adjust(type, 1); }}
                    className="absolute -bottom-6 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1"
                >
                    <ChevronDown size={16} />
                </button>
            </div>
        );
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
                <Column value={hour} type="hour" />
                <span className="text-2xl font-bold text-[var(--text-tertiary)] pb-1">:</span>
                <Column value={minute} type="minute" />
                <div className="w-4"></div>
                <Column value={period} type="period" />
            </div>

        </div>
    );
};

export default TimePopover;
