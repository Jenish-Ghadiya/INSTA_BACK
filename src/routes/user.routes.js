import express from "express";
import signupController from "../controller/user/signup.controller.js";
import loginController from "../controller/user/login.controller.js";
import forgotPassword from "../controller/user/forgot.password.js";
import auth from "../middleware/auth.js";

const userRoutes = express.Router();

userRoutes.post("/signup/sendmail",signupController.emailValidate,signupController.sendMail);
userRoutes.post("/signup/verifyotp/:id",signupController.verifyOtp,signupController.verifyOtp );
userRoutes.post("/signup/createuser/:id",signupController.validater,signupController.handler);
userRoutes.post('/resend-otp/:id', signupController.resendOtp, signupController.resendOtp);
userRoutes.post('/login',loginController.validater,loginController.handler)
userRoutes.post('/logout',auth ,loginController.logout)

//forgot password
userRoutes.post('/forgot-password/sendmail',forgotPassword.emailValidate,forgotPassword.sendOtpMail)
userRoutes.post('/forgot-password/verifyotp/:id',forgotPassword.otpValidate,forgotPassword.verifyOtp)
userRoutes.put('/forgot-password/updatepassword/:id',forgotPassword.validater,forgotPassword.handler)
userRoutes.post('/forgot-password/resend-otp/:id',forgotPassword.resendOtp)

export default userRoutes;