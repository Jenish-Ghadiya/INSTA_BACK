import express from "express";
import postUpload from "../controller/post/post.upload.js";
import auth from "../middleware/auth.js";
import upLoad from "../utils/storage.js";

const postRouter = express.Router();

postRouter.post("/upload", auth,upLoad.single("image"), postUpload.validate, postUpload.handler);
postRouter.post("/:postId/like", auth, postUpload.likeValidate, postUpload.likeHandler);
postRouter.post("/:postId/comment", auth, postUpload.commentValidate, postUpload.commentHandler);
postRouter.get("/user-posts", auth, postUpload.getUserPosts);
postRouter.get("/explore", postUpload.getExplorePosts);
postRouter.get("/post-detail/:id", postUpload.getPostDetail);

export default postRouter;
