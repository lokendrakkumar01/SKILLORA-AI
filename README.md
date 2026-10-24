# 🚀 SKILLORA AI — Learn Anything, One Step at a Time

An AI-powered, production-ready learning platform that turns any learning goal into a personalized roadmap with guided lessons, interactive quizzes, AI tutor, and gamified progress tracking.

![SKILLORA AI](https://img.shields.io/badge/SKILLORA-AI-violet?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)

---

## ✨ Features

- **🧠 AI Roadmap Engine** — Generate personalized, multi-phase learning roadmaps for any goal
- **📖 Interactive Lessons** — Structured content with examples, exercises, and code blocks
- **🧩 Smart Quizzes** — Multiple choice assessments with instant feedback and explanations
- **🤖 AI Tutor** — Context-aware chat assistant available in every lesson
- **📊 Progress Dashboard** — Real-time analytics with charts, streaks, and completion tracking
- **🏆 Gamification** — XP points, day streaks, achievements, and milestone celebrations
- **🔐 Secure Auth** — JWT authentication with bcrypt password hashing
- **📱 Fully Responsive** — Premium dark UI inspired by Linear, Vercel, Notion
- **🚀 Render-Ready** — Single-service deployment with health check endpoint

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs |
| AI | OpenAI-compatible API (server-side) |
| Charts | Recharts |
| Icons | Lucide React |
| State | TanStack Query, React Context |
| Deployment | Render (single Web Service) |

---

## 📁 Project Structure

```
SKILLORA-AI/
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── api/           # API client & endpoint wrappers
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # Button, Card, Badge, Input, ProgressRing...
│   │   │   ├── layout/    # Navbar, Sidebar, AppLayout
│   │   │   └── landing/   # Landing page sections
│   │   ├── context/       # AuthContext
│   │   ├── pages/         # All route pages
│   │   └── index.css      # Global styles + Tailwind
│   └── dist/              # Production build output
├── server/                # Express backend
│   ├── src/
│   │   ├── config/        # Database, Cloudinary
│   │   ├── middleware/     # Auth, error handler
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # AI, gamification services
│   │   └── index.ts       # Server entry point
│   └── dist/              # Compiled JS output
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🏁 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier works)
- Optional: OpenAI API key for AI features

### 1. Clone the repository
```bash
git clone https://github.com/lokendrakkumar01/SKILLORA-AI.git
cd SKILLORA-AI
```

### 2. Set up environment variables
Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_very_long_random_secret_key_change_this
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-3.8-flash
CLIENT_URL=http://localhost:5173
```

### 3. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 4. Run in development
Terminal 1 (Backend):
```bash
cd server && npm run dev
```
Terminal 2 (Frontend):
```bash
cd client && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Current user |
| POST | `/api/roadmaps` | Generate AI roadmap |
| GET | `/api/roadmaps` | List user's roadmaps |
| GET | `/api/roadmaps/:id` | Get roadmap details |
| PATCH | `/api/roadmaps/:id` | Update roadmap |
| GET | `/api/lessons/:stepId` | Get lesson content |
| POST | `/api/lessons/:stepId/complete` | Complete lesson |
| POST | `/api/quizzes/:stepId/submit` | Submit quiz answers |
| POST | `/api/ai/chat` | AI tutor chat |
| GET | `/api/progress/overview` | Dashboard stats |
| GET | `/api/profile` | User profile |
| PATCH | `/api/profile` | Update profile |

---

## 🚀 Render Deployment

### Single Web Service (Recommended)

1. Push code to GitHub
2. Create a **New Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo

**Build & Deploy Settings:**

| Setting | Value |
|---------|-------|
| **Root Directory** | _(leave blank)_ |
| **Build Command** | `cd client && npm install && npx vite build && cd ../server && npm install && npm run build` |
| **Start Command** | `cd server && node dist/index.js` |

**Environment Variables:**

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | a long random secret string |
| `GEMINI_API_KEY` | your Google AI Studio API key |
| `GEMINI_MODEL` | `gemini-3.8-flash` |
| `CLIENT_URL` | your Render URL (e.g. `https://skillora-ai.onrender.com`) |

### MongoDB Atlas Network Access
1. Go to MongoDB Atlas → Network Access
2. Add IP Address: **0.0.0.0/0** (Allow access from anywhere)
3. This is required for Render's dynamic IPs

---

## 🎮 Demo Mode

1. Register a new account
2. Enter goal: **"Learn Web Development from Zero"**
3. Complete onboarding → AI roadmap generates
4. Open first lesson → Read content
5. Ask the AI tutor a question
6. Take the quiz
7. Mark lesson complete → See XP + streak update
8. Check dashboard for progress analytics

The entire demo works in under 60 seconds.

---

## 🔐 Security

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT tokens with 7-day expiry
- AI API keys never exposed to client
- User data isolation (ownership checks on all routes)
- Rate limiting on AI endpoints (30 req/hour)
- Helmet security headers
- CORS configuration
- Input validation with express-validator

---

## 📝 License

MIT License — Built for hackathons and learning.

---

**Built with ❤️ by SKILLORA AI Team**
