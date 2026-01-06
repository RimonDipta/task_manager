import React from "react";
import { Repeat, CalendarClock, Settings2 } from "lucide-react";

const RepeatPopover = ({ onSelect, onOpenCustom }) => {
    const options = [
        { label: "Daily", value: { type: "daily", interval: 1 }, icon: <Repeat size={16} /> },
        { label: "Weekly", value: { type: "weekly", interval: 1 }, icon: <Repeat size={16} /> },
        { label: "Monthly", value: { type: "monthly", interval: 1 }, icon: <CalendarClock size={16} /> },
        { label: "Yearly", value: { type: "yearly", interval: 1 }, icon: <CalendarClock size={16} /> },
    ];

    return (
        <div className="absolute top-10 left-0 z-50 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl w-[200px] p-1 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-0.5">
                {options.map((opt, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => onSelect(opt.value)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors text-left"
                    >
                        <span className="text-[var(--text-tertiary)]">{opt.icon}</span>
                        {opt.label}
                    </button>
                ))}
                <div className="h-px bg-[var(--border-color)] my-1" />
                <button
                    type="button"
                    onClick={onOpenCustom}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors text-left"
                >
                    <Settings2 size={16} className="text-[var(--text-tertiary)]" />
                    Custom...
                </button>
            </div>
        </div>
    );
};

export default RepeatPopover;
