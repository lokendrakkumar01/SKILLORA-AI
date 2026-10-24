import mongoose, { Document, Schema } from 'mongoose';

export interface IStudyActivity extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  lessonsCompleted: number;
  xpEarned: number;
}

const StudyActivitySchema = new Schema<IStudyActivity>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  minutesStudied: { type: Number, default: 0 },
  lessonsCompleted: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
});

StudyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IStudyActivity>('StudyActivity', StudyActivitySchema);
