import {Router} from 'express';
import { createPayment } from '../controllers/paymentController';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';


const router = Router();

// payment router and controller
router.post('/createPayment', createPayment);




export default router;