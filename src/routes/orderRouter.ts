import {Router} from 'express';
import { createOrder, deleteUserOrder, getSingleUserOrders } from '../controllers/orderController';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';


const router = Router();

// order router and controller
router.post('/createOrder', verifyToken, createOrder);
router.get('/getSingleOrder', verifyToken, getSingleUserOrders);
router.delete('/deleteOrder/:id', verifyToken, deleteUserOrder);


export default router;