"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create transporter once and reuse it
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
const sendEmail = async (options) => {
    console.log(`Sending email to: ${options.email} with subject: ${options.subject}`);
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
exports.default = sendEmail;
