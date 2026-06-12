import {Request, Response} from 'express';

// registration
const registration = async (req: Request, res: Response) : Promise<void> => {
  try{
    res.status(200).json({
    success: true,
    message: "registration success"
  });
  }catch(error: any){
    console.log(error.message);
    console.log('registration error.');
  }
}


// login
const login = async (req: Request, res: Response): Promise<void> => {
  try{
    res.status(200).json({
    success: true,
    message: "login success"
  });
  }catch(error: any){
    console.log(error.message);
    console.log('login error.');
  }
}

export {registration, login};