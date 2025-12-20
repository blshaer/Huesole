import nodemailer from "nodemailer";

interface EmailOptions {
    email: string;
    subject: string;
    message: string;
}

const sendEmail = async (options: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.EMAIL_FROM}`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.message // Sending the message as both text and HTML
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
