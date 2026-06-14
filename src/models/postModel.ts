import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  image?: string;
}

const PostSchema: Schema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: [true, 'please enter your title'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'please enter your description'],
    trim: true
  },
  image: { 
    type: String,
    default: 'default-image.png'
  }
}, { timestamps: true }); 

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;