import validate from "../../middleware/validate.js";
import Joi from "joi";
import UserSchema from "../../model/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../../config/db.config.js";
import ProfileSchema from "../../model/profile.model.js";   

export default {
    validater: validate({
        body: Joi.object({
            username: Joi.string().min(3).max(20),
            email: Joi.string().email(),
            password: Joi.string().min(4).max(10).required(),
        }).xor("email","username"),
    }),
    handler:async (req,res)=>{
        try {
            const {username,email,password} = req.body

            const user = await UserSchema.findOne({$or : [{email}, {username}]})

            if (!user) {
                return res.status(400).json({message:"user not found"})
            }
            
            const passwordmatch = await  bcrypt.compare(password , user.password)
            if (!passwordmatch) {
                return res.status(400).json({message:"password khoto chhe"})
            }
            const id = user._id.toString();
            const token = jwt.sign({id:id},SECRET_KEY)
            const profile = await ProfileSchema.findOne({userId:id})

            if (!profile) {
                const splitEmail = user.email.split("@")[0]
                await ProfileSchema.create({
                    userId: id,
                    username: user.username,
                    name: splitEmail
                })
            }
            await UserSchema.findByIdAndUpdate(id,{isLoggedIn:true})
            return res.status(200).json({success:true,message:"login successfully",token:token})
        } catch (error) {
            return res.status(500).json({success:false,message:error.message})
        }
    },
    logout: async (req, res) => {
        const id = req.user.id;
        await UserSchema.findByIdAndUpdate(id, { isLoggedIn: false });
        return res.status(200).json({ success: true, message: "logout successfully" });
    },
};
