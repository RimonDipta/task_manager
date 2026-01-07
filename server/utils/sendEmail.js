import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    let emailSent = false;

    // Option 1: Try Resend FIRST (Preferred on Production)
    if (process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);

            // Fix for Resend: Cannot send from generic domains like gmail.com unless verified
            let fromAddress = process.env.FROM_EMAIL || 'onboarding@resend.dev';
            const genericDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
            const domain = fromAddress.split('@')[1];

            if (genericDomains.includes(domain)) {
                console.warn(`Resend: Switched sender from ${fromAddress} to onboarding@resend.dev (generic domain requires verification)`);
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
                console.error("Resend API Error:", error);
                throw new Error(error.message);
            }

            console.log("Message sent successfully via Resend:", data);
            emailSent = true;
            return data;

        } catch (err) {
            console.error("Resend Send Failed:", err);
            // Fallthrough to Nodemailer if Resend fails
            console.log("Falling back to Nodemailer...");
        }
    }

    // Option 2: Try Nodemailer (Gmail/SMTP)
    if (!emailSent && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
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
            throw new Error(`Email failed: ${error.message}`);
        }
    }

    if (!emailSent) {
        throw new Error("Email configuration missing (Define RESEND_API_KEY or EMAIL_USER/PASS)");
    }
};

export default sendEmail;
