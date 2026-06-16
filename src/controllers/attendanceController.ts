import { Request, Response } from 'express';
import Attendance from '../models/attendanceModel';

const createAttendance = async (req: Request, res: Response): Promise<void> => {
  try {

    // verify user token
    const currentUser = req.user;

    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized! Please login first.',
      });
      return;
    }

    
    // logic to find the start of today's day (00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // logic to find the end of today's day (23:59:59)
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // checking the database to see if the user has already presented today
    const alreadyAttended = await Attendance.findOne({
      user: currentUser.userId,
      date: {
        $gte: startOfToday, // greater than or equal to the start of today
        $lte: endOfToday,   // less than or equal to today's end
      },
    });

    // if a present is already given, it will be blocked
    if (alreadyAttended) {
      res.status(400).json({
        success: false,
        message: 'You have already submitted your attendance for today!',
      });
      return;
    }

    // if the button is pressed for the first time today, the new attendance will be saved
    const newAttendance = new Attendance({
      user: currentUser.userId,
      status: 'present',
      date: new Date()
    });

    const saveAttendance = await newAttendance.save();

    if(!saveAttendance){
      res.status(401).json({
      success: false,
      message: 'Attendance not submitted!',
      });
      return;
    }else{
          res.status(201).json({
      success: true,
      message: 'Attendance submitted successfully for today!',
      data: newAttendance,
    });
    return;
    }

  } catch (error: any) {
    console.error("Error in createAttendance:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while submitting attendance.',
    });
    return;
  }
};

// get admin attendance
const getAdminAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    // get user token
    const currentUser = req.user;

    // validation the user
    if (!currentUser || currentUser.userRoleName !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Access Denied! Only Admin can access this data.',
      });
      return;
    }

    // query the date
    const { date } = req.query; 
    let query: any = {};

    if (date) {
      const searchDate = new Date(date as string);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // sorting the data
    const allAttendance = await Attendance.find(query).populate('user', 'name email image').sort({ createdAt: -1 });

    // if no post here
    if (!allAttendance || allAttendance.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No allAttendance available right now.',
        data: [],
      });
      return;
    }

    // send the success attendance
    res.status(200).json({
      success: true,
      count: allAttendance.length,
      message: 'All attendances retrieved successfully for Admin (Latest First).',
      data: allAttendance,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('attendance error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while fetching admin attendance.',
    });
    return;
  }
};


const getManagerAttendance = async (req: Request, res: Response): Promise<void> => {
  try {

    // get user token
    const currentUser = req.user;

    // validation the user
    if (!currentUser || currentUser.userRoleName !== 'manager') {
      res.status(403).json({
        success: false,
        message: 'Access Denied! Only Manager can access this data.',
      });
      return;
    }

    // query the date
    const { date } = req.query; 
    let query: any = {};

    if (date) {
      const searchDate = new Date(date as string);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // sorting the data
    const allAttendance = await Attendance.find(query).populate('user', 'name email image').sort({ createdAt: -1 });

    // if no attendance here
    if (!allAttendance || allAttendance.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No allAttendance available right now for Manager.',
        data: [],
      });
      return;
    }

    // send the success attendance
    res.status(200).json({
      success: true,
      count: allAttendance.length,
      message: 'All attendances retrieved successfully for Manager (Latest First).',
      data: allAttendance,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('manager attendance error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while fetching manager attendance.',
    });
    return;
  }
};

// get my attendance
const getMyAttendance = async (req: Request, res: Response): Promise<void> => {
  try {

    // get user token
    const currentUser = req.user;

    // validation the user
    if (!currentUser) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized! Please login first.',
      });
      return;
    }

    // 🔒 সিকিউরিটি লক: শুধুমাত্র এই লগইন করা ইউজারের ডাটাই ডাটাবেজ থেকে খোঁজা হবে
    const myAttendance = await Attendance.find({ user: currentUser.userId })
      .populate('user', 'name email image')
      .sort({ createdAt: -1 }); // ইউজারের নিজের হাজিরারও শেষেরটা আগে থাকবে

    // if no attendance history here
    if (!myAttendance || myAttendance.length === 0) {
      res.status(200).json({
        success: true,
        message: 'You have no attendance history available right now.',
        data: [],
      });
      return;
    }

    // send the success attendance history
    res.status(200).json({
      success: true,
      count: myAttendance.length,
      message: 'Your personal attendance history retrieved successfully (Latest First).',
      data: myAttendance,
    });
    return;

  } catch (error: any) {
    console.log(error.message);
    console.log('my attendance error.');

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error while fetching your attendance history.',
    });
    return;
  }
};


export {createAttendance, getAdminAttendance, getManagerAttendance, getMyAttendance};