import validate from "../../middleware/validate.js";
import UserSchema from "../../model/user.model.js";
import bcrypt from "bcrypt";
import { MAIL_FROM } from "../../config/db.config.js";
import Joi from "joi";
import transporter from "../../utils/emailService.js";


export const sendMail = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000); // Extended to 5 minutes

    const mailOptions = {
        from: MAIL_FROM,
        to: email,
        subject: "OTP Verification",
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #ff0000;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .otp-code {
                    font-size: 36px;
                    font-weight: bold;
                    color: #ff0000;
                    letter-spacing: 5px;
                    margin: 20px 0;
                    padding: 10px;
                    background-color: #fce4e7;
                    border-radius: 5px;
                    display: inline-block;
                }
                .timer {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .note {
                    font-size: 12px;
                    color: #888;
                    margin-top: 20px;
                    font-style: italic;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #ff0000;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Verification</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to verify your identity:</p>
                    <div class="otp-code">${otp}</div>
                    <div class="timer">This OTP will expire in 1 minute</div>
                    <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                    <a href="#" class="button">Reset Password</a>
                    <div class="note">
                        This is an automated message. Please do not reply to this email.
                    </div>
                </div>
            </div>
        </body>
        </html>
        `,
    };

    try {
        const existingUser = await UserSchema.findOne({ email });
        let user;

        if (existingUser) {
            user = await UserSchema.findOneAndUpdate(
                { email },
                { otp, otpExpires },
                { new: true }
            );
        } else {
            user = await UserSchema.create({ email, otp, otpExpires });
        }

        await transporter.sendMail(mailOptions);
        return { success: true, otp, userId: user._id };
    } catch (error) {
        console.error("Error in sendMail:", error);
        return {
            success: false,
            message: "Failed to send OTP. Please try again.",
        };
    }
};

export default {
    emailValidate: validate({
        body: Joi.object({
            email: Joi.string().email().required(),
        }),
    }),
    otpValidate: validate({
        body: Joi.object({
            otp: Joi.number().required(),
        }),
        params: Joi.object({
            id: Joi.string().required(),
        }),
    }),
    validater: validate({
        body: Joi.object({
            password: Joi.string().min(4).max(10).required(),
            confirmPassword: Joi.string().min(4).max(10).required(),
        }),
    }),

    sendOtpMail: async (req, res) => {
        const { email } = req.body;
        const existingUser = await UserSchema.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const result = await sendMail(email);
        if (result.success) {
            res.status(200).json({ message: "OTP sent to email", otp: result });
        } else {
            res.status(500).json({ message: result.message });
        }
    },

    verifyOtp: async (req, res) => {
        try {
            const { otp } = req.body;
            const userId = req.params.id;

            const user = await UserSchema.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.otp !== otp) {
                return res.status(400).json({ message: "Invalid OTP" });
            }

            res.status(200).json({ message: "OTP verified" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    handler: async (req, res) => {
        try {
            const { password , confirmPassword } = req.body;
            const userId = req.params.id;

            console.log(password,confirmPassword)
            const user = await UserSchema.findById(userId);

        if (password !== confirmPassword) {
            return res.status(400).json({message:"Password and confirm password does not match"})
        }
            const hashedPassword = await bcrypt.hash(password, 10);
            await UserSchema.findByIdAndUpdate(userId, { password: hashedPassword });
            res.status(200).json({ message: "Password updated successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
