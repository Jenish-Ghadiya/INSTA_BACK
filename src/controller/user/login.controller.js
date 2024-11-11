import validate from "../../middleware/validate.js";
import Joi from "joi";
import UserSchema from "../../model/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../../config/db.config.js";

export default {
    validater: validate({
        body: Joi.object({
            username: Joi.string().min(3).max(20).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(4).max(10).required(),
        }).xor("email","username"),
    }),
    handler:async (rer,res)=>{
        try {
            const {username,email,password} = req.body

            const user = await UserSchema.findOne({$or : [{email}, {username}]})

            if (!user) {
                return res.status(400).jsob({message:"user not found"})
            }
            
            const passwordmatch = await  bcrypt.compare(password , user.password)
            if (!passwordmatch) {
                return res.status(400).jsob({message:"password khoto chhe"})
            }

            const token = jwt.sign({id:user._id},SECRET_KEY)
            const profile = await ProfileSchema.findOne({userId:user._id})

            const splitEmail = user.email.split("@")[0]

            if (!profile) {
                await ProfileSchema.create({userId:user._id,username:user.username,name:splitEmail})
            }
            
            res.status(200).json({message:"login succesfully",token:token})
        } catch (error) {
            res.status(500).json({loginError:error.message})
        }
    }
};
