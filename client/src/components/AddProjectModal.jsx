import { useEffect, useState } from "react";
import Modal from "./Modal";

const COLORS = [
    "#6366f1", // indigo
    "#ec4899", // pink
    "#f59e0b", // amber
    "#10b981", // emerald
    "#3b82f6", // blue
    "#ef4444", // red
    "#8b5cf6", // violet
    "#64748b", // slate
];

const AddProjectModal = ({ isOpen, onClose, onCreate, onUpdate, project }) => {
    const isEdit = Boolean(project);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState(COLORS[0]);
    const [saving, setSaving] = useState(false);

    // Re-seed the form from the project being edited each time the modal opens.
    useEffect(() => {
        if (isOpen) {
            setName(project?.name || "");
            setDescription(project?.description || "");
            setColor(project?.color || COLORS[0]);
        }
    }, [isOpen, project]);

    const reset = () => {
        setName("");
        setDescription("");
        setColor(COLORS[0]);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || saving) return;

        setSaving(true);
        try {
            if (isEdit) {
                await onUpdate(project._id, { name: name.trim(), description: description.trim(), color });
            } else {
                await onCreate({ name: name.trim(), description: description.trim(), color });
            }
            reset();
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEdit ? "Edit Project" : "New Project"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Name
                    </label>
                    <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Website Redesign"
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Description <span className="text-[var(--text-tertiary)]">(optional)</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's this project about?"
                        rows={2}
                        className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Color
                    </label>
                    <div className="flex items-center gap-2">
                        {COLORS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-7 h-7 rounded-full transition-transform ${color === c ? "ring-2 ring-offset-2 ring-offset-[var(--bg-card)]" : ""}`}
                                style={{ backgroundColor: c, ...(color === c ? { "--tw-ring-color": c } : {}) }}
                                aria-label={`Choose color ${c}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim() || saving}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--primary-color)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        {isEdit
                            ? (saving ? "Saving..." : "Save Changes")
                            : (saving ? "Creating..." : "Create Project")}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddProjectModal;
