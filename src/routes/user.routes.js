import express from "express";
import signupController from "../controller/user/signup.controller.js";

const userRoutes = express.Router();

userRoutes.post("/signup/sendmail",signupController.emailValidate,signupController.sendMail);
userRoutes.post("/signup/verifyotp/:id",signupController.verifyOtp,signupController.verifyOtp );
userRoutes.post("/signup/createuser/:id",signupController.validater,signupController.handler);

export default userRoutes;