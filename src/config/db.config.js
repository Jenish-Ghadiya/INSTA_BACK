import mongoose from "mongoose";
import dotenv from "dotenv/config";

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const MAIL_FROM = process.env.MAIL_FROM;
export const MAIL_PASS = process.env.MAIL_PASS;
export const SECRET_KEY = process.env.SECRET_KEY;
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
export const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(process.env.MONGO_URI);
        console.log("db conect successfully");
    } catch (error) {
        console.log("dbConnect error", error.message);
    }
};

export default dbConnect;
