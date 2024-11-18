import validate from "../../middleware/validate.js";
import Joi from "joi";
import ProfileSchema from "../../model/profile.model.js";


export default {
    validater: validate({
        body: Joi.object({
            name: Joi.string().required(),
            username: Joi.string().required(),
            bio: Joi.string().min(5).max(100).allow("").optional(),
            profilepic: Joi.string().optional()
        })
    }),
    handler: async (req, res) => {
        try {
            const { name, username, bio } = req.body;
            let profilepic = req.file;
            const id = req.user.id;
            console.log("name",name,"username",username,"bio",bio,"profilepic",profilepic);
        const user = await ProfileSchema.findOne({ userId: id });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const existingUsername = await ProfileSchema.findOne({ 
            username: username,
            userId: { $ne: id }
        });

        if (existingUsername) {
            return res.status(400).json({
                message: "Username already exists",
            });
        }

        if (profilepic) {
            profilepic = profilepic.path;
        }

        const updatedUser = await ProfileSchema.findByIdAndUpdate(user._id, { name, username, bio, profilepic }, { new: true });
        res.status(200).json({
                message: "Profile updated successfully",
                data: updatedUser,
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message: error.message,
            });
        }
    },
};
