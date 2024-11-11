import Joi from "joi";
import validate from "../../middleware/validate.js";
import UserSchema from "../../model/user.model.js";
import transporter from "../../utils/emailService.js";
import { MAIL_FROM } from "../../config/db.config.js";
import bcrypt from "bcrypt";


export const sendMail = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 1 * 60 * 1000);

    const user = await UserSchema.create({email,otp,otpExpires})


    await user.save();
    const mailOptions = {
        from: MAIL_FROM,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp} and it will expire in 1 minutes`,
    };
    try {
        await transporter.sendMail(mailOptions);
        return {success:true,otp}
    } catch (error) {
        return {success:false,message:"Internal server error"}
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
    sendMail: async (req, res) => {
        const { email } = req.body;
        const existingUser = await UserSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
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
        console.log(userId);
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
        await UserSchema.findByIdAndUpdate(userId,{otp:null,otpExpires:null})
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
            await UserSchema.findByIdAndUpdate(userId,{username,password:hashedPassword})
            res.status(200).json({message:"User created successfully"})
        } catch (error) {
            res.status(500).json({message:error.message})
        }
    }
};
