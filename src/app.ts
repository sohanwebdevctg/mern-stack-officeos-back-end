import express = require('express');
import cors = require('cors');
import userRouter from './routes/userRouter';
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));


// router name
app.use('/api/v1/user', userRouter);


// server running method
app.get('/', (req: any, res: any) => {
  return res.send({
    success: true,
    message: 'OfficeOS Backend Server is Running!'
  })
});

export default app;