import { Resend } from 'resend';
import nodemailer from 'nodemailer';

// Singleton Transporter for Nodemailer
let transporter = null;

const createTransporter = () => {
    if (!transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, // SSL
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        // Verify connection configuration
        transporter.verify(function (error, success) {
            if (error) {
                console.log("❌ Nodemailer Verification Failed:", error);
                transporter = null; // Reset if failed
            } else {
                console.log("✅ Nodemailer is ready to take our messages");
            }
        });
    }
    return transporter;
};

// Initialize on load
createTransporter();

const sendEmail = async (options) => {
    let emailSent = false;

    // ==========================================
    // OPTION 1: Brevo (Sendinblue) - HTTP API
    // ==========================================
    if (process.env.BREVO_API_KEY) {
        try {
            // console.log(`Attempting to send email via Brevo API to ${options.email}...`);

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
            console.log(`✅ [Email Sent] via Brevo to ${options.email}`);
            emailSent = true;
            return data;

        } catch (error) {
            console.error("❌ Brevo Send Failed:", error.message);
            // Fallthrough to others
        }
    }

    // ==========================================
    // OPTION 2: Nodemailer (Gmail/SMTP)
    // ==========================================
    if (!emailSent) {
        const mailTransport = transporter || createTransporter();
        
        if (mailTransport) {
             try {
                // console.log(`Attempting to send email via Nodemailer (Gmail)...`);
                const info = await mailTransport.sendMail({
                    from: `${process.env.FROM_NAME || 'Task Manager'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
                    to: options.email,
                    subject: options.subject,
                    html: options.html,
                    text: options.message
                });
                console.log(`✅ [Email Sent] via Nodemailer to ${options.email}`);
                emailSent = true;
                return info;
            } catch (error) {
                console.error("❌ Nodemailer Send Failed:", error.message);
            }
        }
    }

    // ==========================================
    // OPTION 3: Resend
    // ==========================================
    if (!emailSent && process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
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
            console.log(`✅ [Email Sent] via Resend to ${options.email}`);
            return data;
        } catch (err) {
            console.error("❌ Resend Send Failed:", err.message);
        }
    }

    if (!emailSent) {
        console.error("❌ ALL EMAIL METHODS FAILED. Check server logs.");
        // We do NOT throw error here in fire-and-forget mode to avoid crashing the background process
        // unless we want to handle it in the caller.
        throw new Error("All email methods failed.");
    }
};

export default sendEmail;
