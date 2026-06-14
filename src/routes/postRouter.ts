import {Router} from 'express';
import {createPost} from '../controllers/postController';
import { upload } from '../middlewares/uploadMiddleware';
import verifyToken from '../middlewares/authMiddleware';


const router = Router();


// post router and controller
router.post('/createPost', verifyToken, upload.single('image'), createPost);


export default router;