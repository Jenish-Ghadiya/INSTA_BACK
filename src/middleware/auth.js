import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/db.config.js";

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header is missing",
            });
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Token is required",
            });
        }
        
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token",
            error: error.message
        });
    }
};

export default auth;