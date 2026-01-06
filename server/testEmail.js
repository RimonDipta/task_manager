import dotenv from 'dotenv';
dotenv.config();
import sendEmail from './utils/sendEmail.js';

const test = async () => {
    console.log("Testing Email Sending...");
    try {
        await sendEmail({
            email: process.env.EMAIL_USER, // Send to self
            subject: "Test Email",
            message: "This is a test email to verify credentials.",
        });
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Email failed:", error);
    }
};

test();
