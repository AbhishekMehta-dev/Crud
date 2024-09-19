import mongoose from "mongoose";
import {Post} from "../models/post.model.js";

// Create post
const createPost = async (req, res) => {
    try {
        const {  title, description } = req.body;
        

        if ([title, description].some((field) => field?.trim() === "")) {
            return res.status(400).json({ error: "All fields are required" });
        }
        // const userId = req.user._id;

        const post = await Post.create({ title, description });

        return res.status(201).json({
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error("Error creating post:", error.message);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
};

// Get All posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        return res.status(200).json({
            message: "Post retrieved successfully",
            posts,
        });
    } catch (error) {
        console.error("Error retrieving posts:", error.message);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
};

const getPostById = async (req, res) => {
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
        const post = await Post.findOne({ _id: id });

        if (!post) {
            return res.status(404).json({
                message: "post not found",
            });
        }

        return res.status(200).json({
            message: "Post retrieved successfully",
            post,
        });
    } catch (error) {
        console.error("Error retrieving post:", error.message);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
};

const updatePost = async(req, res) => {
    const {title,description} = req.body

    if (!(title || description)) {
        return res.status(400)
        .json({error: "All fields are required"})
        
    }

    const post = await Post.findByIdAndUpdate(
       {_id:req.params.id} ,
        {
            $set: {
                title,
                description
            }
        },
        {new: true}
        
    )
    return res.status(200).json({
        message: "Post update successfully",
        post,
})
}

const deletePost = async (req, res) => {
    try {
        // Find the post by ID
        const post = await Post.findByIdAndDelete(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                message: "post not found",
            });
        }
        
        return res.status(200).json({
            message: "Post deleted successfully",
        });
        
    } catch (error) {
        console.error("Error deleting post:", error.message);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
    }
    }

export { createPost, getPosts,getPostById,updatePost,deletePost };
