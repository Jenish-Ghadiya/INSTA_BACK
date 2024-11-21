import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
    {
        email: {
            type: String,
            default: null,
        },
        username: {
            type: String,
            default: null,
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
        },
        isSignedUp: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isLoggedIn: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const UserSchema = mongoose.model("User", UserModel);

export default UserSchema;