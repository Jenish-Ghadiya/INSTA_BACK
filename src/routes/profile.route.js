import express from "express";
import updateController from "../controller/profile/update.controller.js";
import auth from "../middleware/auth.js";
import upLoad from "../utils/storage.js";
import profileController from "../controller/profile/get.profile.js";
import uploadImage from "../controller/profile/upload.image.js";

const profileRouter = express.Router();

profileRouter.put("/update",auth,upLoad.single("profilepic"),updateController.validater,updateController.handler);
profileRouter.get("/",auth,profileController.handler);
profileRouter.put("/upload-image",auth,upLoad.single("profilepic"),uploadImage.handler);


export default profileRouter;
