import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    let emailSent = false;

    // Option 1: Try Nodemailer (Gmail/SMTP) with Secure Settings
    // We prioritize this for you because it allows sending to ANYONE for free (up to 500/day).
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            console.log(`Attempting to send email via Nodemailer (Gmail SSL/465)...`);

            const transporter = nodemailer.createTransport({
                service: 'gmail', // Built-in service ensures correct host (smtp.gmail.com)
                port: 465,        // FORCE SSL PORT (Critical for Render/Cloud)
                secure: true,     // Must be true for port 465
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: `${process.env.FROM_NAME || 'Task Manager'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
                to: options.email,
                subject: options.subject,
                html: options.html,
                text: options.message,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log("✅ Message sent successfully via Nodemailer:", info.messageId);
            emailSent = true;
            return info;
        } catch (error) {
            console.error("❌ Nodemailer Send Failed:", error);
            // Don't throw immediately, try Resend fallback if available
            if (process.env.RESEND_API_KEY) {
                console.log("Falling back to Resend...");
            } else {
                if (error.code === 'ETIMEDOUT') {
                    console.error("👉 Tip: Check your firewall or try a different port (though 465 should work).");
                }
                throw new Error(`Email failed: ${error.message}`);
            }
        }
    }

    // Option 2: Try Resend (Fallback or Primary if no Gmail credentials)
    if (!emailSent && process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);

            // Fix for Resend Sender Validation
            let fromAddress = process.env.FROM_EMAIL || 'onboarding@resend.dev';
            const genericDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
            const domain = fromAddress.split('@')[1];

            if (genericDomains.includes(domain)) {
                fromAddress = 'onboarding@resend.dev';
            }

            console.log(`Attempting to send email via Resend to ${options.email}...`);

            const { data, error } = await resend.emails.send({
                from: `Task Manager <${fromAddress}>`,
                to: options.email,
                subject: options.subject,
                html: options.html,
                text: options.message // Fallback plain text
            });

            if (error) {
                if (error.message && error.message.includes('only send testing emails to your own email')) {
                    console.warn(`\n⚠️ RESEND LIMITATION: ${error.message}`);
                }
                console.error("Resend API Error:", error);
                throw new Error(error.message);
            }

            console.log("✅ Message sent successfully via Resend:", data);
            return data;

        } catch (err) {
            console.error("❌ Resend Send Failed:", err);
            throw err;
        }
    }

    if (!emailSent) {
        throw new Error("Email configuration missing (Define EMAIL_USER/PASS or RESEND_API_KEY)");
    }
};

export default sendEmail;
