import {Router} from 'express';
import { createRejectedOrder } from '../controllers/rejectedOrderController';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';


const router = Router();

// rejectedOrder router and controller
router.post('/createRejectedOrder', createRejectedOrder);




export default router;