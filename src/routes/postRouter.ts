import {Router} from 'express';
import {createPost, getAllPost, getSinglePost, updateSinglePost, deleteSinglePost} from '../controllers/postController';
import { upload } from '../middlewares/uploadMiddleware';
import verifyToken from '../middlewares/authMiddleware';


const router = Router();


// post router and controller
router.post('/createPost', verifyToken, upload.single('image'), createPost);
router.get('/getAllPost', verifyToken, getAllPost);
router.get('/getSinglePost/:id', verifyToken, getSinglePost);
router.put('/updateSinglePost/:id', verifyToken, upload.single('image'), updateSinglePost);
router.delete('/deleteSinglePost/:id', verifyToken, deleteSinglePost);


export default router;