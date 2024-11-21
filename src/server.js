import express from "express";
import { PORT } from "./config/db.config.js";
import dbConnect from "./config/db.config.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import profileRoutes from "./routes/profile.route.js";
import postRoutes from "./routes/post.route.js";

const app = express();

dbConnect();
app.use(
    cors({
        origin: ["http://localhost:5173", "https://vatu.vercel.app"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Hello from server" });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/user/profile", profileRoutes);
app.use("/api/v1/user/post", postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
