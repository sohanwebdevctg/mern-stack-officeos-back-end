import {Router} from 'express';
import { createPayment, getAllPaymentAdmin, getAllPaymentManager, getSingleUserPayment } from '../controllers/paymentController';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';
import isManager from '../middlewares/isManager';


const router = Router();

// payment router and controller
router.post('/createPayment',verifyToken, isAdmin, createPayment);
router.get('/getAllPaymentAdmin', verifyToken, isAdmin, getAllPaymentAdmin);
router.get('/getAllPaymentManager', verifyToken, isManager, getAllPaymentManager);
router.get('/getSingleUserPayment/:id', verifyToken, getSingleUserPayment);




export default router;