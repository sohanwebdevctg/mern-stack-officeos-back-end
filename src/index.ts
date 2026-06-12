import app from './app';
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


// server listening port
const port: string | number = process.env.PORT || 3002;


// database connection
const databaseConnection = async (): Promise<void> => {

  const MONGODB_URL: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a20rr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
  
  try{
    await mongoose.connect(MONGODB_URL);
    console.log('DataBase Connect Successfully.');
  }catch(error: any){
    console.log(error.message);
    console.log('DataBase Error');
    process.exit(1);
  }
}

// server listing port
app.listen(port, async (): Promise<void> => {
  console.log(`Server is running at http://localhost:${port}`);
  await databaseConnection();
});