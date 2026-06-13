import {Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        userEmail: string;
        userRoleName: string;
        userIsActive: boolean;
      };
    }
  }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try{
    // get authorization from headers
  const {authorization} = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access! Token is missing.',
      });
      return;
    }

  // get token from authorization
    const token = authorization.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access! Invalid token format.',
      });
      return;
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // get data from decoded
    const {userId, userEmail, userRoleName, userIsActive} = decoded;
    
      req.user = {
      userId,
      userEmail,
      userRoleName,
      userIsActive
    };

    next();


  }catch(error: any){
    console.error('Token Verification Error');
    console.error(error.message);
    res.status(401).json({
      success: false,
      message: 'Unauthorized user! Token is invalid or expired.',
    });
    return;
  }


}

export default verifyToken;