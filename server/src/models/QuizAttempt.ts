import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  roadmapId: mongoose.Types.ObjectId;
  stepId: mongoose.Types.ObjectId;
  answers: number[];
  score: number;
  totalQuestions: number;
  passed: boolean;
  xpEarned: number;
  attemptNumber: number;
  createdAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roadmapId: { type: Schema.Types.ObjectId, ref: 'Roadmap', required: true },
    stepId: { type: Schema.Types.ObjectId, required: true },
    answers: [Number],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    xpEarned: { type: Number, default: 0 },
    attemptNumber: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
