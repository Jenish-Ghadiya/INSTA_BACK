import mongoose from "mongoose";
import ProfileSchema from "../../model/profile.model.js";

export default {
    handler: async (req, res) => {
        try {
            const id = new mongoose.Types.ObjectId(req.user.id);
            const profile = await ProfileSchema.findOne({userId: id});
            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }
            res.status(200).json({
                success: true,
                data: profile
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}