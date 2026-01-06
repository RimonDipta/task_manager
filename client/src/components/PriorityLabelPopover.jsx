import React, { useState } from "react";
import { Flag, Tag, Check, Plus, Search } from "lucide-react";

const PriorityLabelPopover = ({ priority, setPriority, selectedTags, setSelectedTags, onClose }) => {

    const [searchText, setSearchText] = useState("");
    const predefinedTags = ["🏠 Home", "💻 Work", "🔥 Urgent", "🛒 Shopping", "🚀 Project"];

    // Combine predefined with any currently selected tags that might not be in predefined (if we supported loading tags from backend, for now just local)
    const allTags = Array.from(new Set([...predefinedTags, ...selectedTags]));

    const filteredTags = allTags.filter(tag =>
        tag.toLowerCase().includes(searchText.toLowerCase())
    );

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
        // Don't close on tag toggle, allow multiple
    };

    const createTag = () => {
        if (!searchText.trim()) return;
        // Add logic to just select it (upstream TaskForm handles keeping it in selectedTags)
        // Since it's just a string array, selecting it "creates" it on the Task.
        // We might want to clear search after.
        toggleTag(searchText.trim());
        setSearchText("");
    };

    return (
        <div className="absolute top-10 left-0 sm:left-auto z-50 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl w-[280px] p-3 animate-in fade-in zoom-in-95 duration-200">

            {/* Priority Section */}
            <div className="mb-4">
                <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Flag size={12} /> Priority
                </h4>
                <div className="flex gap-2">
                    {["p1", "p2", "p3", "p4"].map(p => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            className={`flex-1 p-2 rounded-lg border transition-all flex justify-center items-center ${priority === p
                                    ? "bg-[var(--bg-surface)] border-[var(--primary-color)] ring-1 ring-[var(--primary-color)] shadow-sm"
                                    : "border-[var(--border-color)] hover:bg-[var(--bg-surface)]"
                                }`}
                            title={`Priority ${p.charAt(1)}`}
                        >
                            <Flag
                                size={16}
                                className={
                                    p === 'p1' ? "fill-red-500 text-red-600" :
                                        p === 'p2' ? "fill-amber-500 text-amber-600" :
                                            p === 'p3' ? "fill-green-500 text-green-600" :
                                                "text-slate-400"
                                }
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Labels Section */}
            <div>
                <h4 className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Tag size={12} /> Labels
                </h4>

                {/* Search Input */}
                <div className="relative mb-2">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
                    <input
                        type="text"
                        placeholder="Search or Create..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition-all"
                    />
                </div>

                <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] transition-colors group"
                        >
                            <span className="flex-1 text-left truncate">{tag}</span>
                            {selectedTags.includes(tag) && <Check size={14} className="text-[var(--primary-color)]" />}
                        </button>
                    ))}

                    {/* Create Option */}
                    {searchText && !filteredTags.includes(searchText) && (
                        <button
                            type="button"
                            onClick={createTag}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--primary-light)]/10 text-[var(--primary-color)] text-sm transition-colors font-medium"
                        >
                            <Plus size={14} />
                            Create "{searchText}"
                        </button>
                    )}

                    {filteredTags.length === 0 && !searchText && (
                        <p className="text-xs text-[var(--text-tertiary)] text-center py-2">Type to create new tags</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default PriorityLabelPopover;
