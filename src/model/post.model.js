import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true
    },
    caption: {
        type: String,
        maxLength: 1000
    },
    image: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            _id: String,
            username: String,
            profilepic: String
        }
    }]
}, {
    timestamps: true
});

const PostModel = mongoose.model("Post", PostSchema);

export default PostModel;
