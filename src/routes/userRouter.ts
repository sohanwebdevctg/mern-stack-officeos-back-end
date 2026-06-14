import {Router} from 'express';
import {registration, login, getAllUser, getSingleUser, updateUserStatusAndRole} from '../controllers/userController';
import {upload} from '../middlewares/uploadMiddleware';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';
import isManager from '../middlewares/isManager';
import isEmployee from '../middlewares/isEmployee';

const router = Router();

// user router and controller
router.post('/registration', upload.single('image'), registration);
router.post('/login', login);
router.get('/getAllUserAdmin', verifyToken, isAdmin, getAllUser);
router.get('/getAllUserManager', verifyToken, isManager, getAllUser);
router.get('/singleUser/:id', verifyToken, getSingleUser);
router.patch('/updateUserStatus/:id', verifyToken, isAdmin, updateUserStatusAndRole);



export default router;