// Seeds (or resets) a demo account with sample projects and tasks, so the
// app can be explored immediately without registering/verifying a real user.
//
// Usage:  npm run seed   (from server/)
//
// Safe to re-run: it deletes any existing demo user's data first, then
// recreates it fresh. It only ever touches the demo account (DEMO_EMAIL)
// — no other user's data is read or modified.

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";

const DEMO_EMAIL = "demo@doora.app";
const DEMO_PASSWORD = "Demo1234!";
const DEMO_NAME = "Demo User";

const daysFromNow = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
};

const run = async () => {
    await connectDB();

    const existing = await User.findOne({ email: DEMO_EMAIL });
    if (existing) {
        await Task.deleteMany({ user: existing._id });
        await Project.deleteMany({ user: existing._id });
        await existing.deleteOne();
        console.log("Removed existing demo account and its data.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, salt);

    const user = await User.create({
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        password: hashedPassword,
        isVerified: true, // skip email OTP verification for the demo account
    });

    const projects = await Project.insertMany([
        { user: user._id, name: "Website Redesign", color: "#6366f1", description: "Refresh the marketing site." },
        { user: user._id, name: "Mobile App", color: "#10b981", description: "Native app for iOS and Android." },
        { user: user._id, name: "Q1 Planning", color: "#f59e0b", description: "Roadmap and goals for the quarter." },
    ]);
    const [websiteProject, mobileProject, planningProject] = projects;

    await Task.insertMany([
        {
            user: user._id,
            project: websiteProject._id,
            title: "Design new landing page hero",
            description: "Explore 2-3 directions for the hero section.",
            priority: "p1",
            status: "doing",
            dueDate: daysFromNow(0),
        },
        {
            user: user._id,
            project: websiteProject._id,
            title: "Write homepage copy",
            priority: "p2",
            status: "todo",
            dueDate: daysFromNow(2),
            tags: ["copy"],
        },
        {
            user: user._id,
            project: websiteProject._id,
            title: "Fix mobile nav overflow bug",
            priority: "p1",
            status: "review",
            dueDate: daysFromNow(-1), // overdue, to populate the overdue/notifications views
        },
        {
            user: user._id,
            project: mobileProject._id,
            title: "Set up push notifications",
            priority: "p3",
            status: "todo",
            dueDate: daysFromNow(5),
        },
        {
            user: user._id,
            project: mobileProject._id,
            title: "Ship onboarding flow",
            priority: "p2",
            status: "done",
            completed: true,
            completedAt: daysFromNow(-2),
        },
        {
            user: user._id,
            project: planningProject._id,
            title: "Draft Q1 OKRs",
            priority: "p4",
            status: "todo",
            dueDate: daysFromNow(7),
        },
        {
            user: user._id,
            title: "Read 'Shape Up'",
            priority: "p4",
            status: "archived",
        },
    ]);

    console.log("Demo account ready:");
    console.log(`  Email:    ${DEMO_EMAIL}`);
    console.log(`  Password: ${DEMO_PASSWORD}`);
};

run()
    .catch((err) => {
        console.error("Seeding failed:", err);
        process.exitCode = 1;
    })
    .finally(() => mongoose.connection.close());
