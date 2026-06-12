import express = require('express');
import cors = require('cors');
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));


// server running method
app.get('/', (req: any, res: any) => {
  return res.send({
    success: true,
    message: 'OfficeOS Backend Server is Running!'
  })
});

export default app;