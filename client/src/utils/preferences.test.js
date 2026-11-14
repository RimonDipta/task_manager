import { describe, it, expect, beforeEach } from "vitest";
import {
    DEFAULT_VIEW_OPTIONS,
    getDefaultView,
    setDefaultView,
    getWeekStartsOnMonday,
    setWeekStartsOnMonday,
} from "./preferences";

beforeEach(() => {
    localStorage.clear();
});

describe("getDefaultView / setDefaultView", () => {
    it("defaults to Home when nothing is stored", () => {
        expect(getDefaultView()).toBe("/dashboard/home");
    });

    it("round-trips a stored value", () => {
        setDefaultView("/dashboard/kanban");
        expect(getDefaultView()).toBe("/dashboard/kanban");
    });

    it("falls back to Home if the stored value isn't a known option", () => {
        localStorage.setItem("doora_default_view", "/some/removed/route");
        expect(getDefaultView()).toBe("/dashboard/home");
    });

    it("every documented option is a valid path", () => {
        DEFAULT_VIEW_OPTIONS.forEach((opt) => {
            setDefaultView(opt.value);
            expect(getDefaultView()).toBe(opt.value);
        });
    });
});

describe("getWeekStartsOnMonday / setWeekStartsOnMonday", () => {
    it("defaults to false (Sunday) when nothing is stored", () => {
        expect(getWeekStartsOnMonday()).toBe(false);
    });

    it("round-trips true and false", () => {
        setWeekStartsOnMonday(true);
        expect(getWeekStartsOnMonday()).toBe(true);

        setWeekStartsOnMonday(false);
        expect(getWeekStartsOnMonday()).toBe(false);
    });
});
