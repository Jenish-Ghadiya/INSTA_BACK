import mongoose from "mongoose";

const ProfileModel = new mongoose.Schema(
    {
        name:{
            type:String,
            require:true
        },
        username:{
            type:String,
            require:true
        },
        bio:{
            type:String,
            default:""
        },
        profilepic:{
            type:String,
            default:""
        },
        pronouns:{
            type:String,
            default:""
        },
    }
)