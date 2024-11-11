import mongoose from "mongoose";
import dotenv from "dotenv/config";

export const PORT = process.env.PORT || 8888;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/INSTA_DB";
export const MAIL_FROM = process.env.MAIL_FROM || "example@gmail.com";
export const MAIL_PASS = process.env.MAIL_PASS || "app paswword";
export const SECRET_KEY = process.env.SECRET_KEY || "12345678"


const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("db conect successfully");
    } catch (error) {
        console.log("dbConnect error", error.message);
    }
};

export default dbConnect;
