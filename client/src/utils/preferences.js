// Lightweight, per-browser user preferences. These are display/navigation
// conveniences only (no sensitive data), so plain localStorage is enough —
// no backend field or sync is needed.

const DEFAULT_VIEW_KEY = "doora_default_view";
const WEEK_STARTS_MONDAY_KEY = "doora_week_starts_monday";

export const DEFAULT_VIEW_OPTIONS = [
    { value: "/dashboard/home", label: "Home" },
    { value: "/dashboard/today", label: "Today" },
    { value: "/dashboard/kanban", label: "Kanban Board" },
    { value: "/dashboard/priority", label: "Priority View" },
    { value: "/dashboard/calendar", label: "Calendar" },
];

export const getDefaultView = () => {
    try {
        const stored = localStorage.getItem(DEFAULT_VIEW_KEY);
        return DEFAULT_VIEW_OPTIONS.some((o) => o.value === stored) ? stored : "/dashboard/home";
    } catch {
        return "/dashboard/home";
    }
};

export const setDefaultView = (value) => {
    try {
        localStorage.setItem(DEFAULT_VIEW_KEY, value);
    } catch {
        // Storage can be unavailable (private mode, quota); the preference just won't persist.
    }
};

export const getWeekStartsOnMonday = () => {
    try {
        return localStorage.getItem(WEEK_STARTS_MONDAY_KEY) === "true";
    } catch {
        return false;
    }
};

export const setWeekStartsOnMonday = (value) => {
    try {
        localStorage.setItem(WEEK_STARTS_MONDAY_KEY, String(value));
    } catch {
        // Storage can be unavailable (private mode, quota); the preference just won't persist.
    }
};
