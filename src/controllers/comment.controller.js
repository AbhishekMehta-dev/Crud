import mongoose from "mongoose";
import {Comment} from "../models/comment.model.js"


const createComment = async(req,res)=>{
    try {
        const {postId,name,email,content} = req.body

        if ([postId,name, email,content].some((field) => field?.trim() === "")) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const userId = req.user._id;

        const comment = await Comment.create({postId,userId,name,email,content})
        return res.status(201).
        json({
            message:"comment is posted",
            comment,
        })
    } catch (error) {
        console.error("Error creating comment:", error.message)
        return res.status(500).
        json({
            error:error.message,
        })

        
    }
}

const getComment = async (req, res) => {
    try {
        const comments = await Comment.find();
        return res.status(200).json({
            message: "Comments retrieved successfully",
            comments,
        });
    } catch (error) {
        console.error("Error retrieving comments:", error.message);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
};

const getCommentById = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        // Validate the ID format before querying the database
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid ID format",
            });
        }

        // Find the post by ID
        const comment = await Comment.findOne({ _id: id });

        if (!comment) {
            return res.status(404).json({
                message: "post not found",
            });
        }

        return res.status(200).json({
            message: "Comment retrieved successfully",
            comment,
        });
    } catch (error) {
        console.error("Error retrieving post:", error.message);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
};


const updateComment = async(req, res) => {
    const {postId,name,email,content} = req.body

    if (!( postId || name || email || content)) {
        return res.status(400)
        .json({error: "All fields are required"})
        
    }

    const update = await Comment.findByIdAndUpdate(
       {_id:req.params.id} ,
        {
            $set: {
                postId,
                name,
                email,
                content
            }
        },
        {new: true}
        
    )
    return res.status(200).json({
        message: "Comment update successfully",
        update,
})
}

const deleteComment = async (req, res) => {
    try {
        
        const comment = await Comment.findByIdAndDelete(req.params.id);
        
        if (!comment) {
            return res.status(404).json({
                message: "comment not found",
            });
        }
        
        return res.status(200).json({
            message: "comment deleted successfully",
        });
        
    } catch (error) {
        console.error("Error deleting comment:", error.message);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
    }
    
export { createComment,getComment,getCommentById,updateComment,deleteComment};