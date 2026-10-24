import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  level: string;
  xp: number;
  streak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  preferences: {
    dailyTimeMinutes: number;
    learningFormats: string[];
    targetDays: number;
  };
  totalLessonsCompleted: number;
  totalQuizzesTaken: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    level: { type: String, default: 'beginner' },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    preferences: {
      dailyTimeMinutes: { type: Number, default: 60 },
      learningFormats: [String],
      targetDays: { type: Number, default: 30 },
    },
    totalLessonsCompleted: { type: Number, default: 0 },
    totalQuizzesTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => { delete ret.password; return ret; },
});

export default mongoose.model<IUser>('User', UserSchema);
