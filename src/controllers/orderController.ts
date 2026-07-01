import { Request, Response } from 'express';
import Order from '../models/orderModel';
import Product from '../models/productModel';


// create order
const createOrder = async (req: Request, res: Response): Promise<void> => {
  try{
    
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
    const { orderItems, totalBill } = req.body;

    // Validation: required fields check
    if (!orderItems || orderItems.length === 0 || !totalBill) {
      res.status(400).json({
        success: false,
        message: "Order items and total bill are required!",
      });
      return;
    }

    // Create new order object
    const createNewOrder = new Order({
      user: currentUser.userId,
      orderItems: orderItems,
      totalBill: totalBill,
      status: 'Pending'
    });

    // save new order in database
    const newOrder = await createNewOrder.save();

    if (!newOrder) {
      res.status(404).json({
        success: false,
        message: "Can not create order",
      });
      return;
    }

    // decrement the product limit from product when user ordering the product
    const decrementProduct = orderItems.map((item: any) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { limit: -item.quantity } }
      }
    }));

    await Product.bulkWrite(decrementProduct);

    // If everything is successful
    res.status(201).json({
      success: true,
      acknowledged: true,
      message: "Order created successfully and stock updated!",
      data: newOrder,
    });
    return;

  }catch(error:any){

    console.log(error.message);
    console.log('create order error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during order creation.'
    });
    return;
  }
}

// get single user orders
const getSingleUserOrders = async (req: Request, res: Response): Promise<void> => {
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

    // find all orders for this specific user and populate product details
    const userOrders = await Order.find({ user: currentUser.userId }).populate('orderItems.product').populate('user');

    // send success response
    res.status(200).json({
      success: true,
      message: "User orders fetched successfully.",
      data: userOrders,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('get single user orders error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during fetching orders.'
    });
    return;
  }
};

// delete user order
const deleteUserOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = req.user;
    const { id } = req.params;

    if (!currentUser) {
      res.status(401).json({ success: false, message: 'Unauthorized!' });
      return;
    }

    
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      res.status(404).json({ success: false, message: 'Order not found!' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully!',
    });
    return;

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

// all order manager
const getAllOrderManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = req.user;

    // validation the user
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized! Please login first.',
      });
      return;
    }

    // find all orders from database, populate user details and product details
    const allOrders = await Order.find({}).populate('user', 'name email').populate('orderItems.product').sort({ createdAt: -1 });

    // send success response
    res.status(200).json({
      success: true,
      message: 'All manager orders fetched successfully.',
      data: allOrders,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('get all manager orders error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during fetching manager orders.',
    });
    return;
  }
};



export { createOrder, getSingleUserOrders, deleteUserOrder, getAllOrderManager };
