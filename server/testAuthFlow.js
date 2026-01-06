import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

// Mock Response
const res = {
    status: (code) => ({
        json: (data) => console.log(`[${code}]`, data),
        send: (data) => console.log(`[${code}]`, data)
    }),
    json: (data) => console.log(`[200]`, data)
};

const testAuth = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const testEmail = "test_auth_flow@example.com";
        await User.deleteOne({ email: testEmail });

        // 1. Register (Simulated)
        console.log("\n--- Registering ---");
        const otp = "123456";
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
        const password = await bcrypt.hash("password123", salt);

        const user = await User.create({
            name: "Test User",
            email: testEmail,
            password: password,
            otp: hashedOtp,
            emailVerificationExpire: Date.now() + 600000,
            isVerified: false
        });
        console.log("User Created:", user.email, "Is Verified:", user.isVerified);

        // 2. Verify (Calling Controller Logic logic manually or via import?)
        // Let's import the actual controller functions to test them!
        // But we need to mock req/res.

        // Import controllers
        const { verifyOtp, loginUser } = await import('./controllers/authController.js');

        // 2. Verify OTP
        console.log("\n--- Verifying OTP ---");
        const reqVerify = { body: { email: testEmail, otp: "123456" } };
        await verifyOtp(reqVerify, res);

        // Check DB
        const verifiedUser = await User.findOne({ email: testEmail });
        console.log("User after verify:", verifiedUser.isVerified);

        if (!verifiedUser.isVerified) {
            console.error("❌ FAILURE: User not verified after verifyOtp!");
        } else {
            console.log("✅ SUCCESS: User is verified.");
        }

        // 3. Login
        console.log("\n--- Logging In ---");
        const reqLogin = { body: { email: testEmail, password: "password123" } };
        await loginUser(reqLogin, res);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

testAuth();
