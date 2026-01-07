import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    let emailSent = false;

    // ==========================================
    // OPTION 1: Brevo (Sendinblue) - HTTP API
    // ==========================================
    // Best for Render/Cloud because it uses HTTPS (Port 443), not SMTP.
    // 1. Sign up at brevo.com
    // 2. Get API Key (xkeysib-...)
    // 3. Set BREVO_API_KEY in .env
    if (process.env.BREVO_API_KEY) {
        try {
            console.log(`Attempting to send email via Brevo API to ${options.email}...`);

            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: process.env.FROM_NAME || 'Task Manager',
                        email: process.env.FROM_EMAIL || process.env.EMAIL_USER // Validated Sender
                    },
                    to: [{ email: options.email }],
                    subject: options.subject,
                    htmlContent: options.html,
                    textContent: options.message
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Brevo API Error: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log("✅ Message sent successfully via Brevo:", data.messageId);
            emailSent = true;
            return data;

        } catch (error) {
            console.error("❌ Brevo Send Failed:", error);
            // Fallthrough to others
        }
    }

    // ==========================================
    // OPTION 2: Nodemailer (Gmail/SMTP)
    // ==========================================
    if (!emailSent && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            console.log(`Attempting to send email via Nodemailer (Gmail)...`);
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465, // SSL
                secure: true,
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });

            const info = await transporter.sendMail({
                from: `${process.env.FROM_NAME || 'Task Manager'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
                to: options.email,
                subject: options.subject,
                html: options.html,
                text: options.message
            });
            console.log("✅ Message sent successfully via Nodemailer:", info.messageId);
            emailSent = true;
            return info;
        } catch (error) {
            console.error("❌ Nodemailer Send Failed:", error.message);
        }
    }

    // ==========================================
    // OPTION 3: Resend
    // ==========================================
    if (!emailSent && process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            // Resend requires verified domain or specific sender
            let fromAddress = process.env.FROM_EMAIL || 'onboarding@resend.dev';
            if (fromAddress.includes('gmail.com')) fromAddress = 'onboarding@resend.dev';

            const { data, error } = await resend.emails.send({
                from: `Task Manager <${fromAddress}>`,
                to: options.email,
                subject: options.subject,
                html: options.html,
                text: options.message
            });

            if (error) throw new Error(error.message);
            console.log("✅ Message sent successfully via Resend:", data);
            return data;
        } catch (err) {
            console.error("❌ Resend Send Failed:", err.message);
        }
    }

    if (!emailSent) {
        throw new Error("All email methods failed. Configure BREVO_API_KEY, EMAIL_USER/PASS, or RESEND_API_KEY.");
    }
};

export default sendEmail;
