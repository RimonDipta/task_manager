import { describe, it, expect } from "vitest";
import { getPasswordStrength } from "./passwordStrength";

describe("getPasswordStrength", () => {
    it("scores an empty password as weak", () => {
        const result = getPasswordStrength("");
        expect(result.score).toBe(0);
        expect(result.label).toBe("Weak");
    });

    it("scores a short, all-lowercase password as weak", () => {
        const result = getPasswordStrength("abc");
        expect(result.label).toBe("Weak");
    });

    it("scores a password missing a character class as medium", () => {
        // 8+ chars, upper, lower, number, but no symbol -> score 4... let's use
        // exactly 3 classes to land on "Medium".
        const result = getPasswordStrength("abcdefgh1");
        // length(1) + lower(1) + number(1) = 3, no upper, no symbol
        expect(result.score).toBe(3);
        expect(result.label).toBe("Medium");
    });

    it("scores a long password with every character class as strong", () => {
        const result = getPasswordStrength("Sup3rSecret!");
        expect(result.score).toBe(5);
        expect(result.label).toBe("Strong");
    });

    it("never scores above 5 or below 0", () => {
        const weakest = getPasswordStrength("a");
        const strongest = getPasswordStrength("Aa1!Aa1!Aa1!");
        expect(weakest.score).toBeGreaterThanOrEqual(0);
        expect(strongest.score).toBeLessThanOrEqual(5);
    });
});
