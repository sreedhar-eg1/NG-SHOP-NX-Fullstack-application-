import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItem extends Document {
  quantity: number;
  product: Types.ObjectId;
}

const orderItemSchema = new Schema<IOrderItem>({
  quantity: { type: Number, required: true },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

export const OrderItem = mongoose.model<IOrderItem>(
  "OrderItem",
  orderItemSchema,
);
