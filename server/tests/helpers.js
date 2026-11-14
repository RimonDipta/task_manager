import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

let counter = 0;

// Creates an already-verified user directly via the model (bypassing the
// register/verify-otp flow) and returns a ready-to-use auth token, for
// tests that only care about what happens *after* login.
export const createAuthedUser = async (overrides = {}) => {
    counter += 1;
    const password = overrides.password || "Sup3rSecret!";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name: overrides.name || "Test User",
        email: overrides.email || `user-${Date.now()}-${counter}@example.com`,
        password: hashedPassword,
        isVerified: true,
    });

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return { user, token, password };
};
