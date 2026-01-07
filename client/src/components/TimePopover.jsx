import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const TimePopover = ({ selectedTime, onSelect, onClose }) => {
    // Parse initial time or default to current rounded time
    const [hour, setHour] = useState(12);
    const [minute, setMinute] = useState(0);
    const [period, setPeriod] = useState("PM");

    useEffect(() => {
        if (selectedTime) {
            const [h, m] = selectedTime.split(':').map(Number);
            let parsedHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
            let parsedPeriod = h >= 12 ? "PM" : "AM";
            setHour(parsedHour);
            setMinute(m);
            setPeriod(parsedPeriod);
        } else {
            // Default to now
            const now = new Date();
            let h = now.getHours();
            let m = now.getMinutes();
            // Round to nearest 5
            m = Math.round(m / 5) * 5;
            if (m === 60) { m = 0; h += 1; }

            let parsedHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
            let parsedPeriod = h >= 12 ? "PM" : "AM";
            setHour(parsedHour);
            setMinute(m);
            setPeriod(parsedPeriod);
        }
    }, []);

    const handleSave = () => {
        let h = hour;
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;

        const timeString = `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        onSelect(timeString);
    };

    const adjustHour = (delta) => {
        let newH = hour + delta;
        if (newH > 12) newH = 1;
        if (newH < 1) newH = 12;
        setHour(newH);
    };

    const adjustMinute = (delta) => {
        let newM = minute + delta;
        if (newM > 55) newM = 0;
        if (newM < 0) newM = 55;
        setMinute(newM);
    };

    return (
        <div className="absolute top-10 left-0 z-50 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4 items-center min-w-[200px]">

            {/* Stepper Controls */}
            <div className="flex items-center gap-4">

                {/* Time Dial */}
                <div className="flex flex-col gap-2">
                    {/* Hour Row */}
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => adjustHour(-1)} className="p-1 hover:bg-[var(--bg-surface)] rounded-full text-[var(--text-secondary)]"><ChevronLeft size={16} /></button>
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] flex items-center justify-center border border-[var(--border-color)]">
                            <span className="text-lg font-bold text-[var(--text-primary)]">{hour.toString().padStart(2, '0')}</span>
                        </div>
                        <button type="button" onClick={() => adjustHour(1)} className="p-1 hover:bg-[var(--bg-surface)] rounded-full text-[var(--text-secondary)]"><ChevronRight size={16} /></button>
                    </div>

                    {/* Minute Row */}
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => adjustMinute(-5)} className="p-1 hover:bg-[var(--bg-surface)] rounded-full text-[var(--text-secondary)]"><ChevronLeft size={16} /></button>
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] flex items-center justify-center border border-[var(--border-color)]">
                            <span className="text-lg font-bold text-[var(--text-primary)]">{minute.toString().padStart(2, '0')}</span>
                        </div>
                        <button type="button" onClick={() => adjustMinute(5)} className="p-1 hover:bg-[var(--bg-surface)] rounded-full text-[var(--text-secondary)]"><ChevronRight size={16} /></button>
                    </div>
                </div>

                {/* AM/PM Toggle */}
                <div className="flex flex-col gap-1">
                    <button
                        type="button"
                        onClick={() => setPeriod("AM")}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${period === "AM" ? "bg-amber-100 text-amber-700" : "text-[var(--text-tertiary)] hover:bg-[var(--bg-surface)]"}`}
                    >
                        AM
                    </button>
                    <button
                        type="button"
                        onClick={() => setPeriod("PM")}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${period === "PM" ? "bg-indigo-100 text-indigo-700" : "text-[var(--text-tertiary)] hover:bg-[var(--bg-surface)]"}`}
                    >
                        PM
                    </button>
                </div>

            </div>

            {/* Done Button */}
            <button
                type="button"
                onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-1.5 bg-[var(--primary-color)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
                <Check size={14} />
                Set Time
            </button>

        </div>
    );
};

export default TimePopover;
