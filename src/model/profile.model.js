import mongoose from "mongoose";

const ProfileModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        name: {
            type: String,
        },
        username: {
            type: String,
        },
        bio: {
            type: String,
            default: ""
        },
        profilepic: {
            type: String,
            default: "https://res.cloudinary.com/dovx2njqv/image/upload/v1731911050/none_lh5klu.webp"
        },
    },
    {
        timestamps: true
    }
);

const ProfileSchema = mongoose.model("Profile", ProfileModel);
export default ProfileSchema;