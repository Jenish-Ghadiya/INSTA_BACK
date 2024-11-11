import express from "express";
import { PORT } from "./config/db.config.js";
import dbConnect from "./config/db.config.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

