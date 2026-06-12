import mongoose, {Schema, Document} from 'mongoose';

export interface IUser extends Document{
  name:string;
  email:string;
  password?:string;
  image?: string;
  roleName: 'admin' | 'manager' | 'employee' | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema({
  name:{ 
    type: String, 
    required: [true, 'please enter your name'], 
    trim: true 
  },
  email:{ 
    type: String, 
    required: [true, 'please enter your email'], 
    unique: true, 
    lowercase: true,
    validate: {
      validator: function(v: string) {
        // Regular Expression (Regex) for checking email
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: 'Please enter a valid email address (e.g., example@gmail.com)'
    }
  },
  password:{ 
    type: String, 
    required: [true, 'please enter your password'],
    validate: {
      validator: function(v: string) {
        // Password policy: at least 6 characters, 1 uppercase letter, 1 lowercase letter, and 1 number
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(v);
      },
      message: 'Password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, and one number!'
    }
  },
  image: { 
    type: String,
    default: 'default-image.png'
  },
  roleName: { 
    type: String, 
    enum: {
      values: ['admin', 'manager', 'employee', null],
      message: 'Role must be either admin, manager, employee, or null'
    }, 
    default: null
  },
  isActive: { 
    type: Boolean, 
    default: false
  }
}, {timestamps: true});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;