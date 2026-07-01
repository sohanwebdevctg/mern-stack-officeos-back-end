import { Request, Response } from 'express';
import Payment from '../models/payment';
import Order from '../models/orderModel';
import Product from '../models/productModel';


// create payment
const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, paymentNumber } = req.body;

    // find the order first from the main order table
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found!' });
      return;
    }

    // create a new document in the payment table, taking data from the order
    const newPayment = await Payment.create({
      user: order.user,
      orderId: order._id,
      orderItems: order.orderItems.map((item: any) => ({
        product: item.product?._id || item.product,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0
      })),
      totalPrice: Number(order.totalBill) || 0,
      paymentNumber: paymentNumber.toString()
    });

    // reducing the limit of the main product by running a loop
    for (const item of order.orderItems) {
      const pId = item.product && (item.product as any)._id 
        ? (item.product as any)._id.toString() 
        : item.product.toString();

      await Product.findByIdAndUpdate(pId, {
        $inc: { limit: -Number(item.quantity) }
      });
    }

    // delete the order form order table
    await Order.findByIdAndDelete(orderId);

    res.status(201).json({
      success: true,
      message: "create payment successfully",
      data: newPayment
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('create payment error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during payment creation.'
    });
    return;
  }
};

// all payment admin
const getAllPaymentAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    
    // payment data
    const payments = await Payment.find().populate('user', 'name email').populate('orderItems.product', 'name image price').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Admin payment history fetched successfully.",
      data: payments
    });
    return;
  } catch (error: any) {
    console.error(" Get All Payment Admin Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during fetching admin payments.'
    });
    return;
  }
};

// all payment manager
const getAllPaymentManager = async (req: Request, res: Response): Promise<void> => {
  try {

    // payment data
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Manager payment history fetched successfully.",
      data: payments
    });
    return;
  } catch (error: any) {
    console.error(" Get All Payment Manager Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during fetching manager payments.'
    });
    return;
  }
};

// get single user payment
const getSingleUserPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    // get user id
    const { id: userId } = req.params;

    if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required in params!" });
      return;
    }

    // find that user's payment history in the database
    const userPayments = await Payment.find({ user: userId }).populate('user', 'name email').populate('orderItems.product', 'name').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "User payment history fetched successfully.",
      data: userPayments
    });
    return;
  } catch (error: any) {
    console.error(" Get Single User Payment Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during fetching user payments.'
    });
    return;
  }
};


export { createPayment, getAllPaymentAdmin, getAllPaymentManager, getSingleUserPayment };

