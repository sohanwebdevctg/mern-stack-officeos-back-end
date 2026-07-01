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

export {createPayment};