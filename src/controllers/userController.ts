import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import fs from "fs";
import User from "../models/userModel";

// registration
const registration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validation: If name, email or password is not sent
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email, and password are required!",
      });
      return;
    }

    // Check: if there is already a user in this email
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email is already registered! Please login.",
      });
      return;
    }

    // Image Handling (Default image name)
    let imageUrl = "default-image.png";

    if (req.file) {
      // The path to the file that Marlter saved to our 'uploads/' folder
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
        params,
      );

      // Get the live URL link if the upload is successful
      if (imgbbResponse.data && imgbbResponse.data.data.url) {
        imageUrl = imgbbResponse.data.data.url;
      }

      // Security and space saving: Delete the file from the local 'uploads/' folder after uploading to ImgBB
      fs.unlinkSync(filePath);
    }

    // password hashing bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const createUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      image: imageUrl,
      roleName: null,
      isActive: false,
    });

    // save new user in database
    const newUser = await createUser.save();

    if (!newUser) {
      res.status(404).json({
        success: false,
        message: "Can not create user",
      });
      return;
    } else {
      res.status(201).json({
        success: true,
        message: "User registered successfully! Account is pending activation.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
          roleName: newUser.roleName,
          isActive: newUser.isActive,
        },
      });
      return;
    }
  } catch (error: any) {
    console.log(error.message);
    console.log('registration error.');

    // If an error occurs and there are images in the uploads/ folder, they will be deleted immediately.
    if (req.file && req.file.path) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log('Error occurred! Cleanup done: Local uploaded file deleted.');
      }
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during registration.'
    });
    return;
  }
};

// login
const login = async (req: Request, res: Response): Promise<void> => {
  try {

    const {email, password} = req.body;

    // Validation: If email or password is not sent
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required!",
      });
      return;
    }

    //  Find user by email in database
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found! Please register first.",
      });
      return;
    }

    // If the user account is not role
    if (user.roleName === null) {
      res.status(403).json({
        success: false,
        message: "Access denied! You do not have a assigned role. Please contact Admin.",
      });
      return;
    }

    // If the user account is not role and pending
    if (user.isActive === false) {
      res.status(403).json({
        success: false,
        message: "Your account is pending activation! Please contact Admin.",
      });
      return;
    }

    // Compare front-end password with database hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password as string);

    if (!isPasswordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password!",
      });
      return;
    }

    // create token data
    const userData = { 
      userId: user._id, 
      userEmail: user.email, 
      userRoleName: user.roleName,
      userIsActive: user.isActive
    }

    // JWT Token Generate
    const token = jwt.sign(userData, process.env.JWT_SECRET as string,{ expiresIn: "1d" });

    if(!token){
      res.status(401).json({
        success: false,
        message: "Invalid email or password!"
      });
      return;
    }else{
      res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        roleName: user.roleName,
        isActive: user.isActive,
      },
    });
    return;
    }
  } catch (error: any) {
    console.log(error.message);
    console.log("login error.");

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during registration.'
    });
    return;
  }
};

export { registration, login };
