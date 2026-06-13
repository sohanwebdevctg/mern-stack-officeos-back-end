import {Router} from 'express';
import {registration, login, getAllUser} from '../controllers/userController';
import {upload} from '../middlewares/uploadMiddleware';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';
import isManager from '../middlewares/isManager';

const router = Router();

// user router and controller
router.post('/registration', upload.single('image'), registration);
router.post('/login', login);
router.get('/getAllUserAdmin', verifyToken, isAdmin, getAllUser);
router.get('/getAllUserManager', verifyToken, isManager, getAllUser);


export default router;