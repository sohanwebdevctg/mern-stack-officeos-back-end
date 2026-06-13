import {Router} from 'express';
import {registration, login} from '../controllers/userController';
import {upload} from '../middlewares/uploadMiddleware';

const router = Router();

// user router and controller
router.post('/registration', upload.single('image'), registration);
router.post('/login', login);




export default router;