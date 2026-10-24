import mongoose, { Document, Schema } from 'mongoose';

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  goal: string;
  level: string;
  estimatedDays: number;
  dailyMinutes: number;
  preferredFormat: string;
  desiredOutcome: string;
  phases: any[];
  status: string;
  completionPercentage: number;
  tags: string[];
  totalXpReward: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema({
  question: String,
  options: [String],
  correct: Number,
  explanation: String,
});

const StepSchema = new Schema({
  title: String,
  description: String,
  content: { type: String, default: '' },
  examples: { type: String, default: '' },
  exercises: { type: String, default: '' },
  quizQuestions: [QuizQuestionSchema],
  estimatedMinutes: { type: Number, default: 20 },
  order: Number,
  status: { type: String, default: 'locked' },
  xpReward: { type: Number, default: 50 },
});

const ModuleSchema = new Schema({
  title: String,
  description: String,
  order: Number,
  estimatedHours: { type: Number, default: 2 },
  steps: [StepSchema],
});

const PhaseSchema = new Schema({
  title: String,
  description: String,
  order: Number,
  modules: [ModuleSchema],
});

const RoadmapSchema = new Schema<IRoadmap>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    goal: { type: String, required: true },
    level: { type: String, default: 'beginner' },
    estimatedDays: { type: Number, default: 30 },
    dailyMinutes: { type: Number, default: 60 },
    preferredFormat: { type: String, default: 'mixed' },
    desiredOutcome: { type: String, default: '' },
    phases: [PhaseSchema],
    status: { type: String, default: 'active' },
    completionPercentage: { type: Number, default: 0 },
    tags: [String],
    totalXpReward: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
