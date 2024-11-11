import nodemailer from "nodemailer";
import { MAIL_FROM, MAIL_PASS } from "../config/db.config.js";
import UserSchema from "../model/user.model.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: MAIL_FROM,
        pass: MAIL_PASS,
    },
});

export default transporter;