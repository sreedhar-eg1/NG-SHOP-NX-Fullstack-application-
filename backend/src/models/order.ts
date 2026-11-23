import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrder extends Document {
  id: string;
  orderItems: Types.ObjectId[];
  shippingAddress1: string;
  shippingAddress2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  status: string;
  totalPrice: number;
  user: Types.ObjectId;
  dateOrdered: Date;
}

const orderSchema = new Schema<IOrder>({
  orderItems: [
    { type: Schema.Types.ObjectId, ref: "OrderItem", required: true },
  ],
  shippingAddress1: { type: String, required: true },
  shippingAddress2: { type: String },
  city: { type: String, default: "" },
  zip: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: String, required: true },
  status: { type: String, required: true, default: "Pending" },
  totalPrice: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  dateOrdered: { type: Date, default: Date.now },
});

orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
orderSchema.set('toJSON', { virtuals: true });

export const Order = mongoose.model<IOrder>('Order', orderSchema)