import React from "react";
import { X, Clock, Sun, Sunset, Moon } from "lucide-react";
import { format, addHours, startOfHour, setHours, setMinutes } from "date-fns";

const TimePopover = ({ selectedTime, onSelect, onClose }) => {
    // Predefined slots
    const slots = [
        { label: "Morning", time: "09:00", icon: <Sun size={16} className="text-amber-500" /> },
        { label: "Afternoon", time: "13:00", icon: <Sun size={16} className="text-orange-500" /> },
        { label: "Evening", time: "18:00", icon: <Sunset size={16} className="text-indigo-500" /> },
        { label: "Night", time: "21:00", icon: <Moon size={16} className="text-purple-500" /> },
    ];

    // Generate hourly slots for the scrollable list
    const hours = Array.from({ length: 24 }).map((_, i) => i);
    const minutes = [0, 15, 30, 45];

    const handleCustomTime = (h, m) => {
        const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        onSelect(timeString);
    };

    return (
        <div className="absolute top-10 left-0 z-50 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl w-[280px] p-2 animate-in fade-in zoom-in-95 duration-200">

            {/* Header / No Time */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-color)] px-2 pt-1">
                <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase">Select Time</span>
                <button
                    onClick={() => onSelect("")}
                    className="text-xs text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                >
                    Clear
                </button>
            </div>

            {/* Quick Slots */}
            <div className="grid grid-cols-2 gap-1 mb-3">
                {slots.map((slot) => (
                    <button
                        key={slot.label}
                        onClick={() => onSelect(slot.time)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] transition-colors border border-transparent hover:border-[var(--border-color)]"
                    >
                        {slot.icon}
                        <span>{slot.label}</span>
                        <span className="ml-auto text-[10px] text-[var(--text-tertiary)]">{slot.time}</span>
                    </button>
                ))}
            </div>

            {/* Manual Selection (Scrollable Columns) */}
            <div className="h-32 flex border-t border-[var(--border-color)] pt-2">
                {/* Hours */}
                <div className="flex-1 overflow-y-auto custom-scrollbar border-r border-[var(--border-color)] pr-1">
                    {hours.map(h => (
                        <button
                            key={h}
                            onClick={() => handleCustomTime(h, selectedTime ? parseInt(selectedTime.split(':')[1]) : 0)}
                            className={`w-full text-center py-1 rounded text-sm hover:bg-[var(--bg-surface)] transition-colors ${selectedTime && parseInt(selectedTime.split(':')[0]) === h ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)] font-bold" : "text-[var(--text-secondary)]"
                                }`}
                        >
                            {h.toString().padStart(2, '0')}
                        </button>
                    ))}
                </div>

                {/* Minutes */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pl-1">
                    {hours.map(h => ( // Using hours to generate rows, but we only have 4 mins? maybe just calculate better.
                        // Actually lets just list 00, 15, 30, 45, and then maybe 5 min increments?
                        // Let's stick to 5 min increments
                        Array.from({ length: 12 }).map((_, i) => i * 5).map(m => (
                            <button
                                key={m}
                                onClick={() => handleCustomTime(selectedTime ? parseInt(selectedTime.split(':')[0]) : 12, m)}
                                className={`w-full text-center py-1 rounded text-sm hover:bg-[var(--bg-surface)] transition-colors ${selectedTime && parseInt(selectedTime.split(':')[1]) === m ? "bg-[var(--primary-light)]/10 text-[var(--primary-color)] font-bold" : "text-[var(--text-secondary)]"
                                    }`}
                            >
                                {m.toString().padStart(2, '0')}
                            </button>
                        ))
                    ))}
                </div>
            </div>

        </div>
    );
};

export default TimePopover;
