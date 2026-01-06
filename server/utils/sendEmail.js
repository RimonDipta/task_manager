import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use 'gmail' service which handles host/port automatically, or specify explicitly
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
        service: process.env.EMAIL_SERVICE,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS ? "****" : "MISSING"
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
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
