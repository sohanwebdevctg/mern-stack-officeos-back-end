import { Request, Response } from 'express';
import fs from 'fs';
import axios from 'axios';
import Post from '../models/postModel';

// create post
const createPost = async (req: Request, res: Response): Promise<void> => {
  try {

    // get data from token and post method
    const { title, description } = req.body;
    const currentUser = req.user; 

    // check the condition user valid
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized! Please login first to create a post.',
      });
      return;
    }

    // title and description must be required
    if (!title || !description) {
      res.status(400).json({
        success: false,
        message: 'Title and description are required!',
      });
      return;
    }

    // set image default value
    let postImageUrl = "default-image.png";

    // Image Handling (Default image name)
    if (req.file) {

      // The path to the file that Malter saved to our 'uploads/' folder
      const filePath = req.file.path;

      // Convert the file to Base64 format (rules for sending to ImgBB)
      const fileData = fs.readFileSync(filePath);
      const base64Image = fileData.toString("base64");

      // Arrange the object as FormData to send data to the ImgBB API
      const params = new URLSearchParams();
      params.append("image", base64Image);

      // Sending POST request to ImgBB API
      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        params
      );

      // Get the live URL link if the upload is successful
      if (imgbbResponse.data && imgbbResponse.data.data.url) {
        postImageUrl = imgbbResponse.data.data.url;
      }

      // Security and space saving: Delete the file from the local 'uploads/' folder after uploading to ImgBB
      fs.unlinkSync(filePath);
    }

    // Create new post
    const newPost = new Post({
      user: currentUser.userId,
      title: title,
      description: description,
      image: postImageUrl
    });

    // save new user in database
    const savedPost = await newPost.save();

    if(!savedPost){
      res.status(404).json({
        success: false,
        message: "Can not create post",
      });
      return;
    }else{
      res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      data: savedPost
    });
    return;
    }

  } catch (error: any) {
    console.log(error.message);
    console.log('post error.');

    // If an error occurs and there are images in the uploads/ folder, they will be deleted immediately.
    if (req.file && req.file.path) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log('Error occurred! Cleanup done: Local uploaded file deleted.');
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during creating post.',
    });
    return;
  }
};

// getAllPost
const getAllPost = async (req: Request, res: Response): Promise<void> => {
  try {

    // find the post and get user info
    const posts = await Post.find().populate('user', 'name email image').sort({ createdAt: -1 });

    // if no post here
    if (!posts || posts.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No posts available right now.',
        data: [],
      });
      return;
    }
    // send the success post
      res.status(200).json({
      success: true,
      count: posts.length,
      message: 'All posts retrieved successfully!',
      data: posts,
    });
    return;

  } catch (error: any) {

    console.log(error.message);
    console.log('post error.');
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while fetching posts.',
    });
    return;
  }

};

// get single post
const getSinglePost = async (req: Request, res: Response): Promise<void> => {
  try {

    // get data params and user token data
    const { id } = req.params;
    const currentUser = req.user;

    // validation the token
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized! Please login first.',
      });
      return;
    }

    // check the post id
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found!',
      });
      return;
    }

    // checking whether the user id of the post is the same as the logged in user id
    if (post.user.toString() !== currentUser.userId) {
      res.status(403).json({
        success: false,
        message: 'Access Denied! You are not the owner of this post.',
      });
      return;
    }

    // send the success data
    res.status(200).json({
      success: true,
      message: 'Single post retrieved successfully!',
      data: post,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('post error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while fetching single post.',
    });
    return;
  }
};

// delete single post
const deleteSinglePost = async (req: Request, res: Response): Promise<void> => {
  try {

    // get data params and user token data
    const { id } = req.params;
    const currentUser = req.user;

    // check the validation
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized! Please login first.',
      });
      return;
    }

    // check the validate id
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'Post not found!',
      });
      return;
    }

    // checking whether the person trying to delete is the real owner or not
    if (post.user.toString() !== currentUser.userId) {
      res.status(403).json({
        success: false,
        message: 'Access Denied! You cannot delete someone else post.',
      });
      return;
    }

    // delete the post
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully!',
    });
    return;

  } catch (error: any) {

    console.log(error.message);
    console.log('post error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while deleting post.',
    });
    return;
  }
};



export { createPost, getAllPost, getSinglePost, deleteSinglePost };