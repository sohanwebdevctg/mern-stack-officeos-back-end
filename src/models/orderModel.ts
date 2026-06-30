import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalBill: number;
  status: 'Pending' | 'Approved';
}

const OrderSchema: Schema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderItems: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      quantity: { 
        type: Number, 
        required: true 
      }, 
      price: { 
        type: Number, 
        required: true 
      }
    }
  ],
  totalBill: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved'], 
    default: 'Pending' 
  }
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;