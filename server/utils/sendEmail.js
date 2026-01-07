import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    let emailSent = false;

    // Option 1: Try Nodemailer (Gmail/SMTP) if configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            console.log(`Attempting to send email via Nodemailer (${process.env.EMAIL_SERVICE || 'smtp'})...`);

            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
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
            console.log("Message sent successfully via Nodemailer:", info.messageId);
            emailSent = true;
            return info;
        } catch (error) {
            console.error("Nodemailer Send Failed:", error);
            // If Resend is available, fall back to it
            if (process.env.RESEND_API_KEY) {
                console.log("Falling back to Resend...");
            } else {
                throw new Error(`Email failed: ${error.message}`);
            }
        }
    }

    // Option 2: Try Resend (as primary or fallback)
    if (!emailSent && process.env.RESEND_API_KEY) {
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is missing in environment variables.");
            throw new Error("Email configuration missing (RESEND_API_KEY)");
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        // Use 'onboarding@resend.dev' if you don't have a custom domain verified in Resend yet.
        // If you verified a domain (e.g., 'updates@myapp.com'), update FROM_EMAIL in your .env
        const fromAddress = process.env.FROM_EMAIL || 'onboarding@resend.dev';

        console.log(`Attempting to send email via Resend to ${options.email}...`);

        try {
            const { data, error } = await resend.emails.send({
                from: `Task Manager <${fromAddress}>`,
                to: options.email,
                subject: options.subject,
                html: options.html,
                text: options.message // Fallback plain text
            });

            if (error) {
                console.error("Resend API Error:", error);
                throw new Error(error.message);
            }

            console.log("Message sent successfully via Resend:", data);
            return data;
        } catch (err) {
            console.error("Resend Send Failed:", err);
            throw err;
        }
    }

    if (!emailSent) {
        throw new Error("Email configuration missing (Define EMAIL_USER/PASS or RESEND_API_KEY)");
    }
};

export default sendEmail;
