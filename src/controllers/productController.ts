import { Request, Response } from 'express';
import axios from "axios";
import fs from "fs";
import Product from '../models/productModel';

// create product
const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // get user token
    const currentUser = req.user;

    // validation the user
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized! Please login first.',
      });
      return;
    }

    // get user request data
    const { name, description, price, limit } = req.body;

    // Validation: required fields check
    if (!name || !description || !price || !limit) {
      res.status(400).json({
        success: false,
        message: "Name, description, price, and limit are required!",
      });
      return;
    }

    // Image Handling (Default image name)
    let imageUrl = "default-product.png";

    if (req.file) {
      // The path to the file that Multer saved to our 'uploads/' folder
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
        imageUrl = imgbbResponse.data.data.url;
      }

      // Security and space saving: Delete the file from the local 'uploads/' folder after uploading to ImgBB
      fs.unlinkSync(filePath);
    }

    // Create new product object
    const createNewProduct = new Product({
      name: name,
      description: description,
      price: price,
      limit: limit,
      image: imageUrl,
      isApproved: false, 
      createdBy: currentUser.userId,
    });

    // save new product in database
    const newProduct = await createNewProduct.save();

    if (!newProduct) {
      res.status(404).json({
        success: false,
        message: "Can not create product",
      });
      return;
    } else {
      res.status(201).json({
        success: true,
        message: "Product created successfully! Pending for Admin approval.",
        data: newProduct,
      });
      return;
    }

  } catch (error: any) {
    console.log(error.message);
    console.log('create product error.');

    // If an error occurs and there are images in the uploads/ folder, they will be deleted immediately.
    if (req.file && req.file.path) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log('Error occurred! Cleanup done: Local uploaded file deleted.');
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during product creation.'
    });
    return;
  }
}

// get admin product only admin can see
const getAdminProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // get user token
    const currentUser = req.user;

    // validation the user
    if (!currentUser || currentUser.userRoleName !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access Denied! Only Admin can access this data.',
      });
      return;
    }

    // get all product
    const allProducts = await Product.find({}).populate('createdBy', 'name email').sort({ createdAt: -1 });

    // if no products here
    if (!allProducts || allProducts.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No products available right now.',
        data: [],
      });
      return;
    }

    // send the success products for admin table
    res.status(200).json({
      success: true,
      count: allProducts.length,
      message: 'All products retrieved successfully for Admin table (Latest First).',
      data: allProducts,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('getAdminProduct error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while fetching admin products.',
    });
    return;
  }
};

// get all approved products
const getAllProduct = async (req: Request, res: Response): Promise<void> => {
  try {

    // get user token
    const currentUser = req.user;

    // validation the user
    if (!currentUser) {
      res.status(403).json({
        success: false,
        message: 'Access Denied! Only Admin can access this data.',
      });
      return;
    }

    // only products that have been approved by the admin
    const approvedProducts = await Product.find({ isApproved: true })
      .populate('createdBy', 'name image').sort({ createdAt: -1 });

    // if no approved products here
    if (!approvedProducts || approvedProducts.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No approved products available right now.',
        data: [],
      });
      return;
    }

    // send success response
    res.status(200).json({
      success: true,
      count: approvedProducts.length,
      message: 'All approved products retrieved successfully for user cards (Latest First).',
      data: approvedProducts,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('getAllProduct error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while fetching products.',
    });
    return;
  }
};

// get single product
const getSingleProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // get user token
    const currentUser = req.user;

    // validation the user
    if (!currentUser || currentUser.userRoleName !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access Denied! Only Admin can fetch single product details.',
      });
      return;
    }

    const { id } = req.params;

    // find the user
    const singleProduct = await Product.findById(id);

    // if product not found in database
    if (!singleProduct) {
      res.status(404).json({
        success: false,
        message: 'Product not found!',
      });
      return;
    }

    // send success response for admin
    res.status(200).json({
      success: true,
      message: 'Single product retrieved successfully for Admin.',
      data: singleProduct,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('getSingleProduct error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while fetching single product.',
    });
    return;
  }
};


export {createProduct, getAdminProduct, getAllProduct, getSingleProduct};