import {Router} from 'express';
import {createProduct} from '../controllers/productController';
import {upload} from '../middlewares/uploadMiddleware';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';
import isManager from '../middlewares/isManager';
import isEmployee from '../middlewares/isEmployee';

const router = Router();

router.post('/createProduct', verifyToken, upload.single('image'), createProduct);


export default router;