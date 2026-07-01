import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  orderItems: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentNumber: string;
  date: Date;
}

const PaymentSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
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
  totalPrice: { 
    type: Number, 
    required: true 
  },
  paymentNumber: { 
    type: String, 
    required: true 
  }, 
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;