import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        // Removed 'service' to force using the explicit host/port config below
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Debug & Timeout settings
        logger: true,
        debug: true,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
    });

    console.log("Create Transport Config:", {
        host: "smtp.gmail.com",
        port: 587,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? "****" : "MISSING"
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Task Manager'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    console.log("Attempting to send email via Nodemailer...");
    const info = await transporter.sendMail(message);
    console.log("Message sent successfully: %s", info.messageId);
};

export default sendEmail;
