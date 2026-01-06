import { Resend } from 'resend';

const sendEmail = async (options) => {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is missing in environment variables.");
        throw new Error("Email configuration missing (RESEND_API_KEY)");
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Use 'onboarding@resend.dev' if you don't have a custom domain verified in Resend yet.
    // If you verified a domain (e.g., 'updates@myapp.com'), update FROM_EMAIL in your .env
    const fromAddress = process.env.FROM_EMAIL && process.env.FROM_EMAIL.includes('@resend.dev')
        ? process.env.FROM_EMAIL
        : 'onboarding@resend.dev';

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

        console.log("Message sent successfully:", data);
    } catch (err) {
        console.error("Resend Send Failed:", err);
        throw err;
    }
};

export default sendEmail;
