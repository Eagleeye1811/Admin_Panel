import mongoose, { Document, Schema } from 'mongoose';

export interface IStory extends Document {
  title: string;
  description: string;
  audioUrl: string;
  category: mongoose.Types.ObjectId;
  duration: number;
  plays: number;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const storySchema = new Schema<IStory>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  audioUrl: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  duration: { type: Number, required: true },
  plays: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Story = mongoose.model<IStory>('Story', storySchema);
export default Story;