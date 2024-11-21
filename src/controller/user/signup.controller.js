import Joi from "joi";
import validate from "../../middleware/validate.js";
import UserSchema from "../../model/user.model.js";
import transporter from "../../utils/emailService.js";
import { MAIL_FROM } from "../../config/db.config.js";
import bcrypt from "bcrypt";


export const sendMail = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000); 

    

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
                <title>Email Verification</title>
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
                        background-color: #ffe6e6;
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
                        color: #fff;
                    }
                    a{
                        text-decoration: none;
                        color: #fff;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Email Verification</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>Thank you for signing up! Please use the following One-Time Password (OTP) to verify your email address:</p>
                        <div class="otp-code">${otp}</div>
                        <div class="timer">This OTP will expire in 5 minutes</div>
                        <p>If you didn't request this verification, please ignore this email.</p>
                        <a href="https://vatu.vercel.app/verify-otp/${user._id}?otp=${otp}" class="button">Verify Email</a>
                        <div class="note">
                            This is an automated message. Please do not reply to this email.
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `,
        };

        await transporter.sendMail(mailOptions);
        return { success: true, otp, userId: user._id };
    } catch (error) {
        console.error("Error in sendMail:", error);
        return { success: false, message: "Failed to send OTP. Please try again." };
    }
};

export default {
    emailValidate: validate({
        body: Joi.object({
            email: Joi.string().email().required(),
        }),
    }),
    verifyOtp: validate({
        body: Joi.object({
            otp: Joi.number().required(),
        }),
        params: Joi.object({
            id: Joi.string().required(),
        }),
    }),
    validater: validate({
        body: Joi.object({
            username: Joi.string().min(3).max(10).required(),
            password: Joi.string().min(4).max(10).required(),
        }),
        params: Joi.object({
            id: Joi.string().required(),
        }),
    }),
    resendOtp: validate({
        params: Joi.object({
            id: Joi.string().required(),
        }),
    }),
    sendMail: async (req, res) => {
        const { email } = req.body;
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser && existingUser.isSignedUp) {
            return res.status(400).json({ message: "User already signed up" });
        }
        const result = await sendMail(email)
        if (result.success) {
            res.status(200).json({message:"OTP sent to email",otp:result})
        } else {
            res.status(500).json({message:"Internal server error"})
        }
    },
    verifyOtp: async (req,res) => {
        const {otp} = req.body;
        const userId = req.params.id;
        const user = await UserSchema.findById(userId);
        if (!user) {
            return res.status(400).json({message:"User not found"})
        }
        console.log(user.otp,otp);
        if (user.otp !== otp) {
            return res.status(400).json({message:"Invalid OTP"})
        }
        if (user.otpExpires < new Date()) {
            return res.status(400).json({message:"OTP expired"})
        }
        await UserSchema.findByIdAndUpdate(userId,{otp:null,otpExpires:null,isVerified:true})
        res.status(200).json({message:"OTP verified"})
    },
    handler:async (req,res) => {
        try {
            const userId = req.params.id;
            const user = await UserSchema.findById(userId);
            if (!user) {
                return res.status(400).json({message:"User not found"})
            }
            const {username,password} = req.body;
            const existingUser = await UserSchema.findOne({username});
            if (existingUser) {
                return res.status(400).json({message:"Username already exists"})
            }
            const hashedPassword = await bcrypt.hash(password,10);
            await UserSchema.findByIdAndUpdate(userId,{username,password:hashedPassword,isSignedUp:true})
            res.status(200).json({message:"User created successfully"})
        } catch (error) {
            res.status(500).json({message:error.message})
        }
    },
    resendOtp: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await UserSchema.findById(userId);
            
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            
            if (user.isSignedUp) {
                return res.status(400).json({ message: "User already signed up" });
            }

            const result = await sendMail(user.email);
            if (result.success) {
                res.status(200).json({ message: "New OTP sent to email", otp: result });
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};
