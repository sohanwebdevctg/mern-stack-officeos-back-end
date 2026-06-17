import express = require('express');
import cors = require('cors');
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';
import attendanceRouter from './routes/attendanceRouter';
import productRouter from './routes/productRouter';
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));


// router name
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/product', productRouter);


// server running method
app.get('/', (req: any, res: any) => {
  return res.send({
    success: true,
    message: 'OfficeOS Backend Server is Running!'
  })
});

export default app;