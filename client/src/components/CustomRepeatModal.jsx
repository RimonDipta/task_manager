import React, { useState } from "react";
import { X, Calendar as CalendarIcon } from "lucide-react";
import DatePopover from "./DatePopover";
import { format } from "date-fns";

const CustomRepeatModal = ({ onClose, onSave, initialConfig }) => {
    const [frequency, setFrequency] = useState(initialConfig?.interval || 1);
    const [unit, setUnit] = useState(initialConfig?.type || "daily");
    const [ends, setEnds] = useState("never"); // never, date
    const [endDate, setEndDate] = useState("");
    const [showDatePopover, setShowDatePopover] = useState(false);

    const handleSave = () => {
        onSave({
            type: unit,
            interval: parseInt(frequency),
            end: ends === "date" ? endDate : null
        });
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-[var(--bg-card)] w-full max-w-[320px] rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="px-4 py-3 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-surface)]">
                    <h3 className="font-semibold text-[var(--text-primary)]">Custom Repeat</h3>
                    <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">

                    {/* Frequency & Unit */}
                    <div className="flex gap-3">
                        <div className="w-1/3">
                            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Every</label>
                            <input
                                type="number"
                                min="1"
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-[var(--text-secondary)] mb-1 block">Unit</label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                            >
                                <option value="daily">Day{frequency > 1 ? 's' : ''}</option>
                                <option value="weekly">Week{frequency > 1 ? 's' : ''}</option>
                                <option value="monthly">Month{frequency > 1 ? 's' : ''}</option>
                                <option value="yearly">Year{frequency > 1 ? 's' : ''}</option>
                            </select>
                        </div>
                    </div>

                    {/* Ends */}
                    <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-2 block">Ends</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="ends"
                                    value="never"
                                    checked={ends === "never"}
                                    onChange={() => setEnds("never")}
                                    className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                                />
                                <span className="text-sm text-[var(--text-primary)]">Never</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="ends"
                                    value="date"
                                    checked={ends === "date"}
                                    onChange={() => setEnds("date")}
                                    className="text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                                />
                                <span className="text-sm text-[var(--text-primary)]">On</span>
                            </label>

                            {ends === "date" && (
                                <div className="ml-6 relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowDatePopover(!showDatePopover)}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] hover:border-[var(--primary-color)] transition-colors"
                                    >
                                        <span>
                                            {endDate ? format(new Date(endDate), "PPP") : "Select date"}
                                        </span>
                                        <CalendarIcon size={14} className="text-[var(--text-tertiary)]" />
                                    </button>

                                    {showDatePopover && (
                                        <div className="absolute top-full left-0 mt-2 z-50">
                                            <DatePopover
                                                selectedDate={endDate}
                                                onSelect={(d) => {
                                                    setEndDate(format(d, "yyyy-MM-dd"));
                                                    setShowDatePopover(false);
                                                }}
                                                onClose={() => setShowDatePopover(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-[var(--bg-surface)] border-t border-[var(--border-color)] flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-1.5 text-sm font-medium bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 shadow-sm"
                    >
                        Done
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CustomRepeatModal;
