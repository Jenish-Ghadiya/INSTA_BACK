import validate from "../../middleware/validate.js";
import Joi from "joi";
import ProfileSchema from "../../model/profile.model.js";
import PostModel from "../../model/post.model.js";
export default {
    validate: validate({
        body: Joi.object({
            caption: Joi.string().max(1000).allow(''),
        }),
    }),
    likeValidate: validate({
        params: Joi.object({
            postId: Joi.string().required(),
        }),
    }),
    commentValidate: validate({
        params: Joi.object({
            postId: Joi.string().required(),
        }),
        body: Joi.object({
            content: Joi.string().required(),
        }),
    }),
    handler: async (req, res) => {
        console.log(req.body)
        try {
            const id = req.user.id;
            const { caption} = req.body;
            const imagePath = req.file.path;

            console.log(id,caption,imagePath)


            const profile = await ProfileSchema.findOne({userId:id});
            if (!profile)
                return res.status(404).json({ message: "profile not found" });

            const post = await PostModel.create({
                userId: id,
                profileId: profile._id,
                caption,
                image: imagePath,
            });
            return res.status(201).json({ message: "post uploaded successfully", post });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    likeHandler: async (req, res) => {
        try {
            const userId = req.user.id;
            const { postId } = req.params;

            const post = await PostModel.findById(postId);
            if (!post) return res.status(404).json({ message: "post not found" });

            if (post.likes.includes(userId)) {
                post.likes = post.likes.filter((id) => id.toString() !== userId);
            } else {
                post.likes.push(userId);
            }

            await post.save();
            return res.status(200).json({ message: "post liked successfully", post });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    commentHandler: async (req, res) => {
        try {
            const userId = req.user.id;
            const { postId } = req.params;
            const { content } = req.body;

            const post = await PostModel.findById(postId);
            const userProfile = await ProfileSchema.findOne({ userId });

            if (!post) {
                return res.status(404).json({ message: "post not found" });
            }

            const comment = {
                userId,
                content,
                user: {
                    _id: userId,
                    username: userProfile.username,
                    profilepic: userProfile.profilepic
                }
            };

            post.comments.push(comment);
            await post.save();
            return res.status(200).json({ message: "comment added successfully", post });
        } catch (error) {
            if (!res.headersSent) {
                return res.status(500).json({ message: error.message });
            }
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const userId = req.user.id;
            const posts = await PostModel.find({ userId })
                .sort({ createdAt: -1 }); // Sort by newest first
            
            return res.status(200).json({ posts });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getExplorePosts: async (req, res) => {
        try {
            const posts = await PostModel.find({}).sort({ createdAt: -1 });
            return res.status(200).json({ posts });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getPostDetail: async (req, res) => {
        try {
            const postId = req.params.id;
            const post = await PostModel.findById(postId)
                .populate('userId', '_id username')
                .populate('profileId', 'profilepic')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'userId',
                        select: '_id username'
                    }
                });
            
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            return res.status(200).json({ post });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
