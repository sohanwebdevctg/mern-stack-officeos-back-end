import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  limit: number;
  image?: string;
  isApproved: boolean;
  createdBy: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  limit: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    default: 'default-product.png' 
  },
  isApproved: { 
    type: Boolean, 
    default: false 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;