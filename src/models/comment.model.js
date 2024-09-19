import mongoose from "mongoose";
const { Schema, model } = mongoose;
const commentSchema = new Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    content:{
        type:String,
        required:true,
        trim:true
    }
},{versionKey:false})

const Comment = model('Comment', commentSchema);

export  {Comment};