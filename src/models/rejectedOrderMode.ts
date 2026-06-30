import mongoose, { Schema, Document } from 'mongoose';

export interface IRejectedOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderId: string;
  orderItems: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalBill: number;
  isViewedByByUser: boolean;
}

const RejectedOrderSchema: Schema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { type: String, required: true },
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
  isViewedByByUser: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

const RejectedOrder = mongoose.model<IRejectedOrder>('RejectedOrder', RejectedOrderSchema);
export default RejectedOrder;