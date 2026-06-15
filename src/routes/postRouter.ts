import {Router} from 'express';
import {createPost, getAllPost} from '../controllers/postController';
import { upload } from '../middlewares/uploadMiddleware';
import verifyToken from '../middlewares/authMiddleware';


const router = Router();


// post router and controller
router.post('/createPost', verifyToken, upload.single('image'), createPost);
router.get('/getAllPost', verifyToken, getAllPost);


export default router;