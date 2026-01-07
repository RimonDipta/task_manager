import React, { useState } from "react";
import {
    addDays,
    nextSaturday,
    nextMonday,
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    addMonths,
    subMonths,
    isValid,
    isBefore,
    startOfDay
} from "date-fns";
import {
    Calendar as CalendarIcon,
    X,
    ChevronLeft,
    ChevronRight,
    Sun,
    Sunset,
    Coffee,
    CalendarDays,
    Ban
} from "lucide-react";

const DatePopover = ({ selectedDate, onSelect, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Shortcuts
    const shortcuts = [
        { label: "Tomorrow", date: addDays(new Date(), 1), icon: <Sun size={16} className="text-amber-500" /> },
        { label: "Later this week", date: addDays(new Date(), 2), icon: <Sunset size={16} className="text-indigo-500" /> }, // Simplified logic
        { label: "This weekend", date: nextSaturday(new Date()), icon: <Coffee size={16} className="text-green-500" /> },
        { label: "Next week", date: nextMonday(new Date()), icon: <CalendarDays size={16} className="text-purple-500" /> },
        { label: "No date", date: null, icon: <Ban size={16} className="text-slate-400" /> },
    ];

    // Calendar Logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    const handleDateClick = (date) => {
        onSelect(date);
    };

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    return (
        <div className="absolute top-10 left-0 sm:left-auto sm:right-auto z-50 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl w-[280px] p-2 animate-in fade-in zoom-in-95 duration-200 xs:max-w-[90vw] xs:left-1/2 xs:-translate-x-1/2 xs:top-12">
            {/* Search/Input (Optional - skipping for now as per req "shortcuts + calendar") */}

            {/* Shortcuts */}
            <div className="space-y-1 mb-3 border-b border-[var(--border-color)] pb-2">
                {shortcuts.map((option, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => onSelect(option.date)}
                        className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-[var(--bg-surface)] rounded text-sm text-[var(--text-primary)] transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            {option.icon}
                            <span>{option.label}</span>
                        </div>
                        {option.date && (
                            <span className="text-xs text-[var(--text-tertiary)]">
                                {format(option.date, "eee")}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Calendar Header */}
            <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {format(currentMonth, "MMMM yyyy")}
                </span>
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={isSameMonth(currentMonth, new Date()) || isBefore(currentMonth, new Date())}
                        className="p-1 hover:bg-[var(--bg-surface)] rounded text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-[var(--bg-surface)] rounded text-[var(--text-secondary)]">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {weekDays.map(d => (
                    <span key={d} className="text-xs font-medium text-[var(--text-tertiary)]">
                        {d}
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                    const isSelected = selectedDate && isValid(new Date(selectedDate)) && isSameDay(day, new Date(selectedDate));
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isTodayDate = isToday(day);
                    const isPast = isBefore(day, startOfDay(new Date()));

                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => !isPast && handleDateClick(day)}
                            disabled={isPast}
                            className={`
                    h-8 w-8 text-sm rounded-full flex items-center justify-center transition-colors
                    ${isPast ? "text-slate-200 cursor-not-allowed line-through opacity-30" : ""}
                    ${!isCurrentMonth && !isPast ? "text-[var(--text-tertiary)] opacity-50" : ""}
                    ${isCurrentMonth && !isPast ? "text-[var(--text-primary)]" : ""}
                    ${isSelected ? "bg-[var(--primary-color)] text-white font-bold hover:bg-[var(--primary-color)]" : (!isPast ? "hover:bg-[var(--bg-surface)]" : "")}
                    ${isTodayDate && !isSelected ? "ring-1 ring-[var(--primary-color)] text-[var(--primary-color)]" : ""}
                 `}
                        >
                            {format(day, "d")}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DatePopover;
