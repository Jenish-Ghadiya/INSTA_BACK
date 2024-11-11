import mongoose from "mongoose";
import dotenv from "dotenv/config";

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const MAIL_FROM = process.env.MAIL_FROM;
export const MAIL_PASS = process.env.MAIL_PASS;
export const SECRET_KEY = process.env.SECRET_KEY;


const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("db conect successfully");
    } catch (error) {
        console.log("dbConnect error", error.message);
    }
};

export default dbConnect;
