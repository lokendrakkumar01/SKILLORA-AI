import mongoose, { Document, Schema } from 'mongoose';

export interface ILessonProgress extends Document {
  userId: mongoose.Types.ObjectId;
  roadmapId: mongoose.Types.ObjectId;
  stepId: mongoose.Types.ObjectId;
  status: 'not_started' | 'in_progress' | 'completed';
  timeSpentMinutes: number;
  notes: string;
  bookmarked: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LessonProgressSchema = new Schema<ILessonProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roadmapId: { type: Schema.Types.ObjectId, ref: 'Roadmap', required: true },
    stepId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
    timeSpentMinutes: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    bookmarked: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

LessonProgressSchema.index({ userId: 1, roadmapId: 1, stepId: 1 }, { unique: true });

export default mongoose.model<ILessonProgress>('LessonProgress', LessonProgressSchema);
