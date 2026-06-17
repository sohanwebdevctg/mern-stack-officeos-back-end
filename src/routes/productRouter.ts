import {Router} from 'express';
import {createProduct, getAdminProduct, getAllProduct, getSingleProduct, approveProduct, updateSingleProduct} from '../controllers/productController';
import {upload} from '../middlewares/uploadMiddleware';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';
import isManager from '../middlewares/isManager';
import isEmployee from '../middlewares/isEmployee';

const router = Router();

router.post('/createProduct', verifyToken, upload.single('image'), createProduct);
router.get('/getAdminProduct', verifyToken, isAdmin, getAdminProduct);
router.get('/getAllProduct', verifyToken, getAllProduct);
router.get('/getSingleProduct/:id', verifyToken, isAdmin, getSingleProduct);
router.put('/approveProduct/:id', verifyToken, isAdmin, approveProduct);
router.put('/updateSingleProduct/:id', verifyToken, isAdmin, upload.single('image'), updateSingleProduct);


export default router;