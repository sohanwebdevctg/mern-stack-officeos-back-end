import {Router} from 'express';
import { createOrder } from '../controllers/orderController';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';


const router = Router();

// order router and controller
router.post('/createOrder', createOrder);


export default router;