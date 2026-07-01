import {Router} from 'express';
import { createOrder, deleteUserOrder, getSingleUserOrders, getAllOrderManager } from '../controllers/orderController';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';
import isManager from '../middlewares/isManager';


const router = Router();

// order router and controller
router.post('/createOrder', verifyToken, createOrder);
router.get('/getSingleOrder', verifyToken, getSingleUserOrders);
router.delete('/deleteOrder/:id', verifyToken, deleteUserOrder);
router.get('/getAllOrderManager', verifyToken, isManager, getAllOrderManager);


export default router;