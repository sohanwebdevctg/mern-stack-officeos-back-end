import {Router} from 'express';
import { createOrder, deleteUserOrder, getSingleUserOrders, getAllOrderManager, getAllOrderAdmin, approvedOrder,updateProductQuantity, removeProductFromOrder, deleteOrderAdmin } from '../controllers/orderController';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';
import isManager from '../middlewares/isManager';


const router = Router();

// order router and controller
router.post('/createOrder', verifyToken, createOrder);
router.get('/getSingleOrder', verifyToken, getSingleUserOrders);
router.delete('/deleteOrder/:id', verifyToken, deleteUserOrder);
router.get('/getAllOrderManager', verifyToken, isManager, getAllOrderManager);
router.get('/getAllOrderAdmin', verifyToken, isAdmin, getAllOrderAdmin);
router.put('/approvedOrder/:id', verifyToken, isAdmin, approvedOrder);
router.put('/:orderId/updateProductQuantity', verifyToken, isAdmin, updateProductQuantity);
router.delete('/:orderId/removeProduct/:productId', verifyToken, isAdmin, removeProductFromOrder);
router.delete('/deleteOrderAdmin/:orderId', verifyToken, isAdmin, deleteOrderAdmin);


export default router;