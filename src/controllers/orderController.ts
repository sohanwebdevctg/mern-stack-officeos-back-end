import { Request, Response } from 'express';
import Order from '../models/orderModel';
import Product from '../models/productModel';
import RejectedOrder from '../models/rejectedOrderMode';


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

// all order admin
const getAllOrderAdmin = async (req: Request, res: Response): Promise<void> => {
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
      message: 'All admin orders fetched successfully.',
      data: allOrders,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('get all admin orders error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during fetching admin orders.',
    });
    return;
  }
};

// approved order
const approvedOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = req.user;
    const { id } = req.params;

    // checking valid user
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized! Please login first.',
      });
      return;
    }

    // find order id
    const order = await Order.findById(id);
    if (!order) {
      res.status(404).json({
        success: false,
        message: 'Order not found with this ID.',
      });
      return;
    }

    // checking the order status
    if (order.status === 'Approved') {
      res.status(400).json({
        success: false,
        message: 'This order is already approved.',
      });
      return;
    }

    // change order status
    order.status = 'Approved';
    await order.save();

    // send success response
    res.status(200).json({
      success: true,
      message: 'Order status updated to Approved successfully.',
      data: order,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('approved order controller error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during approving the order.',
    });
    return;
  }
};

//  update product quantity in order
const updateProductQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { productId, action } = req.body; 

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found!' });
      return;
    }

    // find the product id in order
    const item = order.orderItems.find((item: any) => {
      const pId = item.product._id ? item.product._id.toString() : item.product.toString();
      return pId === productId;
    });

    if (!item) {
      res.status(404).json({ success: false, message: 'Product not found in this order!' });
      return;
    }

    // Increase or decrease quantity according to action
    if (action === 'increment') {
      item.quantity += 1;
    } else if (action === 'decrement') {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        res.status(400).json({ success: false, message: 'Quantity cannot be less than 1.' });
        return;
      }
    }

    // recalculate total bill
    order.totalBill = order.orderItems.reduce((total: number, current: any) => total + (current.price * current.quantity), 0);

    // modified the order item
    order.markModified('orderItems');
    
    await order.save();

    // find the user and product in order
    const populatedOrder = await Order.findById(orderId).populate('user', 'name email').populate('orderItems.product', 'name image price limit');

    
    res.status(200).json({ success: true, message: 'Quantity updated successfully.', data: populatedOrder });
    return;

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

// remove product from order
const removeProductFromOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, productId } = req.params;

    // find order id
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // find out if the product being removed is on order
    const itemToRemove = order.orderItems.find(
      (item: any) => (item.product._id ? item.product._id.toString() : item.product.toString()) === productId
    );

    if (!itemToRemove) {
      res.status(404).json({ success: false, message: 'Product not found in this order' });
      return;
    }

    // increase main card limit/stock according to product quantity
    await Product.findByIdAndUpdate(productId, {
      $inc: { limit: Number(itemToRemove.quantity) || 1 }
    });

    // filtering out specific products from orderItems
    order.orderItems = order.orderItems.filter(
      (item: any) => (item.product._id ? item.product._id.toString() : item.product.toString()) !== productId
    );

    // calculate the total bill
    order.totalBill = order.orderItems.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );

    // save the order database
    await order.save();

    
    const updatedOrder = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image price limit');

    res.status(200).json({
      success: true,
      message: 'Product removed from order successfully',
      orderDeleted: false, 
      data: updatedOrder,
    });
    return;
  } catch (error: any) {
    console.error("Remove Product Error:", error.message);
    res.status(500).json({
      success: false, 
      message: error.message 
    });
    return;
  }
};


// delete order admin
const deleteOrderAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found!' });
      return;
    }

    // populated if safe tracking loop
    for (const item of order.orderItems) {
      const pId = item.product && (item.product as any)._id 
        ? (item.product as any)._id.toString() 
        : item.product.toString();

      await Product.findByIdAndUpdate(pId, {
        $inc: { limit: Number(item.quantity) || 1 } 
      });
    }

    // find user id
    const userId = order.user && (order.user as any)._id 
      ? (order.user as any)._id.toString() 
      : order.user.toString();

    const formattedItems = order.orderItems.map((item: any) => ({
      product: item.product?._id ? item.product._id.toString() : item.product.toString(),
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0
    }));

    // create rejected order
    await RejectedOrder.create({
      user: userId,
      orderId: orderId.toString(), 
      orderItems: formattedItems,
      totalBill: Number(order.totalBill) || 0,
      isViewedByByUser: false
    });

    // remove the order in order table
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: 'Order deleted and stock updated successfully.',
    });
    return;
  } catch (error: any) {
    console.error(" Delete Order Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};


export { createOrder, getSingleUserOrders, deleteUserOrder, getAllOrderManager, getAllOrderAdmin, approvedOrder, updateProductQuantity, removeProductFromOrder, deleteOrderAdmin };
