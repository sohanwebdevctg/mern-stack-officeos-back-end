import { Request, Response, NextFunction } from 'express';

const isManager = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {

    // get token user
    const user = req.user;

    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Unauthorized! Please login first.' 
      });
      return;
    }

    // check user role
    if (user.userRoleName !== 'manager') {
      res.status(403).json({
        success: false,
        message: 'Access Denied! Only managers can access this route.',
      });
      return;
    }

    next();

  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error in isManager guard.' 
    });
    return;
  }
};

export default isManager;