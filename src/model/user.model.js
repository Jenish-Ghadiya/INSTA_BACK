import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            default: null,
        },
        username: {
            type: String,
            default: null,
            unique: true,
        },
        password: {
            type: String,
            default: null,
        },
        otp: {
            type: Number,
            default: null
        },
        otpExpires: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const UserSchema = mongoose.model("User", UserModel);

export default UserSchema;