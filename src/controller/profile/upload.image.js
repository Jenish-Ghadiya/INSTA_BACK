import ProfileSchema from "../../model/profile.model.js";


export default {
    handler: async (req, res) => {
        try {
            const id = req.user.id;
            const profilepic = req.file;
            const profile = await ProfileSchema.findOne({userId: id});
            if (!profile) {
                return res.status(404).json({message: "Profile not found"});
            }
            const savedProfilepic = await ProfileSchema.findByIdAndUpdate(
                profile._id,
                { profilepic: profilepic.path },
                { new: true }
            );
            res.status(200).json({message: "Profile picture uploaded successfully", profile: savedProfilepic});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
}