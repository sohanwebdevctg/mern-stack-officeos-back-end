import {Router} from 'express';
import {createAttendance, getAdminAttendance, getManagerAttendance, getMyAttendance} from '../controllers/attendanceController';
import verifyToken from '../middlewares/authMiddleware';
import isAdmin from '../middlewares/adminMiddleware';
import isManager from '../middlewares/isManager';


const router = Router();

// attendance router and controller
router.post('/createAttendance', verifyToken, createAttendance);
router.get('/getAdminAttendance', verifyToken, isAdmin, getAdminAttendance);
router.get('/getManagerAttendance', verifyToken, isManager, getManagerAttendance);
router.get('/getMyAttendance', verifyToken, getMyAttendance);

export default router;