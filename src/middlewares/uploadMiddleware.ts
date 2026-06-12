import { Request } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';

// 1. Configure where the file will be saved and under what name
const storage: StorageEngine = multer.diskStorage({

  // The file will be saved in the 'uploads' directory of the root folder
  destination:(req: Request, file: Express.Multer.File, cb)=> {
    cb(null, 'uploads/');
  },

  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Create a unique name for the file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});


// 2. Logic to filter only image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images in .png, .jpg and .jpeg formats can be uploaded!'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});