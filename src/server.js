import express from "express";
import { PORT } from "./config/db.config.js";
import dbConnect from "./config/db.config.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

dbConnect();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Hello from server" });
});

app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});