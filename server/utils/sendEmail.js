import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        // Generic SMTP configuration - replace with provider env vars
        // For Gmail: service: 'gmail', auth: { user, pass }
        // For others: host, port, secure, auth
        service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    console.log("Create Transport Config:", {
        service: process.env.EMAIL_SERVICE,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? "****" : "MISSING"
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Optional HTML body
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
