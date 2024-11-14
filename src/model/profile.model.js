import mongoose from "mongoose";

const ProfileModel = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        bio: {
            type: String,
            default: ""
        },
        profilepic: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true
    }
);

const ProfileSchema = mongoose.model("Profile", ProfileModel);
export default ProfileSchema;