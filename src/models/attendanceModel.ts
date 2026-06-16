import mongoose, {Schema,Document} from 'mongoose';

export interface IAttendance extends Document{
  user: mongoose.Types.ObjectId;
  status: string;
  date: Date;
}

const AttendanceSchema: Schema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['present', 'absent'], 
    default: 'present' 
  },
  date: { 
    type: Date, 
    default: Date.now
  }
}, { timestamps: true }); 

const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
export default Attendance;