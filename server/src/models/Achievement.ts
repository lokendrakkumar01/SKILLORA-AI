import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  description: string;
  icon: string;
  xpBonus: number;
  earnedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🏆' },
  xpBonus: { type: Number, default: 50 },
  earnedAt: { type: Date, default: Date.now },
});

AchievementSchema.index({ userId: 1, type: 1 }, { unique: true });

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
