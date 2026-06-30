import { Request, Response } from 'express';
import RejectedOrder from '../models/rejectedOrderMode';



// create rejected order
const createRejectedOrder = async (req: Request, res: Response): Promise<void> => {
  try{
    res.status(201).json({
        success: true,
        message: "create rejected Order successfully",
      });
      return;

  }catch(error:any){

    console.log(error.message);
    console.log('rejected order error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during product creation.'
    });
    return;
  }
}

export {createRejectedOrder};