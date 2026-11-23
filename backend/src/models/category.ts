import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  icon: { type: String },
  color: { type: String },
});

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
categorySchema.set("toJSON", { virtuals: true });

export const Category = mongoose.model<ICategory>("Category", categorySchema);
