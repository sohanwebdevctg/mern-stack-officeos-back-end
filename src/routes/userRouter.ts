import {Router} from 'express';
import {registration, login} from '../controllers/userController';

const router = Router();

// user router and controller
router.post('/registration', registration);
router.post('/login', login);




export default router;