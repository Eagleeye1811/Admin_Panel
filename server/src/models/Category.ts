// models/Category.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  subcategories: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  subcategories: [{ type: String }], // Array of strings
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Category = mongoose.model<ICategory>('Category', categorySchema);
export default Category;
