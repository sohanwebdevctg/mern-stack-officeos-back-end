import { Request, Response } from 'express';
import Order from '../models/orderModel';


// create order
const createOrder = async (req: Request, res: Response): Promise<void> => {
  try{
    res.status(201).json({
        success: true,
        message: "Order created successfully",
      });
      return;

  }catch(error:any){

    console.log(error.message);
    console.log('create order error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during product creation.'
    });
    return;
  }
}

export {createOrder};