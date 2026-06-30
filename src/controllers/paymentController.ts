import { Request, Response } from 'express';
import Payment from '../models/payment';


// create payment
const createPayment = async (req: Request, res: Response): Promise<void> => {
  try{
    res.status(201).json({
        success: true,
        message: "create payment successfully",
      });
      return;

  }catch(error:any){

    console.log(error.message);
    console.log('create payment error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during product creation.'
    });
    return;
  }
}

export {createPayment};