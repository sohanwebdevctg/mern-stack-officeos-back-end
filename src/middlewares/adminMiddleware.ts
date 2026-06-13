import { Request, Response, NextFunction } from 'express';

const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  // get token user
  const user = req.user;

  try {
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Unauthorized! Please login first.' 
      });
      return;
    }

    // check user role
    if (user.userRoleName !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access Denied! Only admins can access this route.',
      });
      return;
    }

    next();

  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error in isAdmin guard.' 
    });
    return;
  }
};

export default isAdmin;