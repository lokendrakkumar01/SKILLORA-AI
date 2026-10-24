import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import roadmapRoutes from './routes/roadmaps';
import lessonRoutes from './routes/lessons';
import quizRoutes from './routes/quizzes';
import aiRoutes from './routes/ai';
import progressRoutes from './routes/progress';
import profileRoutes from './routes/profile';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security & utilities
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression() as any);
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/profile', profileRoutes);
app.get('/api/achievements', (_req, res) => res.json({ achievements: [] }));

// Serve React frontend in production (single-service mode)
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handler
app.use(errorHandler as any);

app.listen(PORT, () => {
  console.log(`🚀 SKILLORA AI Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
