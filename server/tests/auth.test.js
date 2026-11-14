import { describe, it, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app.js";
import User from "../models/User.js";

describe("POST /api/auth/register", () => {
    it("creates an unverified user and returns their email", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ name: "Ada Lovelace", email: "ada@example.com", password: "Sup3rSecret!" });

        expect(res.status).toBe(201);
        expect(res.body.email).toBe("ada@example.com");

        const user = await User.findOne({ email: "ada@example.com" });
        expect(user).not.toBeNull();
        expect(user.isVerified).toBe(false);
        // The password must never be stored in plaintext.
        expect(user.password).not.toBe("Sup3rSecret!");
    });

    it("rejects a duplicate email", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({ name: "A", email: "dup@example.com", password: "Sup3rSecret!" });

        const res = await request(app)
            .post("/api/auth/register")
            .send({ name: "B", email: "dup@example.com", password: "Sup3rSecret!" });

        expect(res.status).toBe(400);
    });

    it("rejects missing required fields", async () => {
        const res = await request(app).post("/api/auth/register").send({ email: "x@example.com" });
        expect(res.status).toBe(400);
    });
});

describe("POST /api/auth/login", () => {
    const makeVerifiedUser = async ({ email = "verified@example.com", password = "Sup3rSecret!" } = {}) => {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({ name: "Verified User", email, password: hashed, isVerified: true });
        return { email, password };
    };

    it("rejects an unverified account", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({ name: "Unverified", email: "pending@example.com", password: "Sup3rSecret!" });

        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "pending@example.com", password: "Sup3rSecret!" });

        expect(res.status).toBe(401);
        expect(res.body.errorCode).toBe("EMAIL_NOT_VERIFIED");
    });

    it("rejects the wrong password", async () => {
        const { email } = await makeVerifiedUser();
        const res = await request(app).post("/api/auth/login").send({ email, password: "wrong-password" });
        expect(res.status).toBe(401);
    });

    it("rejects an unknown email", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "nobody@example.com", password: "whatever" });
        expect(res.status).toBe(401);
    });

    it("logs in a verified user and returns a token", async () => {
        const { email, password } = await makeVerifiedUser();
        const res = await request(app).post("/api/auth/login").send({ email, password });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeTruthy();
        expect(res.body.email).toBe(email);
    });
});

describe("POST /api/auth/verify-otp", () => {
    const createPendingUser = async (email, otp) => {
        const hashedOtp = await bcrypt.hash(otp, 10);
        const hashedPassword = await bcrypt.hash("Sup3rSecret!", 10);
        await User.create({
            name: "Pending",
            email,
            password: hashedPassword,
            otp: hashedOtp,
            emailVerificationExpire: Date.now() + 10 * 60 * 1000,
            isVerified: false,
        });
    };

    it("verifies a registered account with the correct OTP and returns a token", async () => {
        await createPendingUser("otp@example.com", "123456");

        const res = await request(app)
            .post("/api/auth/verify-otp")
            .send({ email: "otp@example.com", otp: "123456" });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeTruthy();

        const user = await User.findOne({ email: "otp@example.com" });
        expect(user.isVerified).toBe(true);
    });

    it("rejects an incorrect OTP", async () => {
        await createPendingUser("otp2@example.com", "123456");

        const res = await request(app)
            .post("/api/auth/verify-otp")
            .send({ email: "otp2@example.com", otp: "000000" });

        expect(res.status).toBe(400);
    });

    it("rejects an expired OTP", async () => {
        const hashedOtp = await bcrypt.hash("123456", 10);
        const hashedPassword = await bcrypt.hash("Sup3rSecret!", 10);
        await User.create({
            name: "Pending",
            email: "expired@example.com",
            password: hashedPassword,
            otp: hashedOtp,
            emailVerificationExpire: Date.now() - 1000, // already expired
            isVerified: false,
        });

        const res = await request(app)
            .post("/api/auth/verify-otp")
            .send({ email: "expired@example.com", otp: "123456" });

        expect(res.status).toBe(400);
    });
});
