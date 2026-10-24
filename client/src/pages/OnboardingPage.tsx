import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ChevronRight, ChevronLeft, Zap, Clock, BookOpen, Code, Layers, Briefcase } from 'lucide-react';
import { roadmapsApi } from '../api/roadmaps';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

const STEPS_CONFIG = ['Goal', 'Level', 'Schedule', 'Format', 'Outcome'];

const LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'Little or no prior knowledge', icon: '🌱' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Some experience, ready to go deeper', icon: '🔥' },
  { id: 'advanced', label: 'Advanced', desc: 'Strong foundation, want to master', icon: '⚡' },
];

const FORMATS = [
  { id: 'reading', label: 'Reading & Theory', icon: BookOpen },
  { id: 'examples', label: 'Examples First', icon: Code },
  { id: 'practice', label: 'Hands-on Practice', icon: Zap },
  { id: 'projects', label: 'Project-Based', icon: Briefcase },
  { id: 'mixed', label: 'Mixed Approach', icon: Layers },
];

const POPULAR_GOALS = [
  'Full Stack Web Development', 'Machine Learning', 'Python Programming',
  'Data Science', 'Cybersecurity', 'UI/UX Design', 'Mobile Development', 'Cloud Computing',
];

const TIME_OPTIONS = [
  { value: 30, label: '30 min/day', desc: 'Light pace' },
  { value: 60, label: '1 hr/day', desc: 'Steady pace' },
  { value: 120, label: '2 hrs/day', desc: 'Focused' },
  { value: 180, label: '3+ hrs/day', desc: 'Intensive' },
];

const TARGET_DAYS = [
  { value: 14, label: '2 Weeks' },
  { value: 30, label: '1 Month' },
  { value: 60, label: '2 Months' },
  { value: 90, label: '3 Months' },
  { value: 180, label: '6 Months' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    goal: localStorage.getItem('skillora_goal_draft') || '',
    level: 'beginner',
    dailyMinutes: 60,
    targetDays: 30,
    preferredFormat: 'mixed',
    desiredOutcome: '',
  });

  const next = () => setStep((s) => Math.min(s + 1, STEPS_CONFIG.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleGenerate = async () => {
    if (!data.goal.trim()) { toast.error('Please enter a learning goal'); return; }
    setLoading(true);
    try {
      const res = await roadmapsApi.create(data);
      localStorage.removeItem('skillora_goal_draft');
      toast.success('🎉 Your roadmap is ready!');
      navigate(`/roadmap/${res.data.roadmap._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to generate roadmap');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] grid-bg flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black">S</span>
            </div>
            <span className="text-white font-bold text-lg">SKILLORA AI</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Let's Build Your Path</h1>
          <p className="text-slate-400 text-sm">Answer a few quick questions for your personalized roadmap</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS_CONFIG.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'bg-white/5 text-slate-500'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] hidden sm:block ${i === step ? 'text-violet-300' : 'text-slate-600'}`}>{label}</span>
              </div>
              {i < STEPS_CONFIG.length - 1 && (
                <div className={`flex-1 h-0.5 transition-all duration-500 ${i < step ? 'bg-violet-500' : 'bg-white/[0.06]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-[#0F0F1A] border border-white/[0.07] rounded-2xl p-8 shadow-2xl min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div key={step} variants={slideVariants} initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.3 }}>

              {/* Step 0: Goal */}
              {step === 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                      <Target className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">What do you want to learn?</h2>
                      <p className="text-xs text-slate-400">Be specific for a better roadmap</p>
                    </div>
                  </div>
                  <input
                    value={data.goal}
                    onChange={(e) => setData({ ...data, goal: e.target.value })}
                    placeholder="e.g. Learn Full Stack Web Development from scratch..."
                    className="w-full px-5 py-4 rounded-xl border bg-[#111118] text-slate-200 placeholder-slate-500 text-sm outline-none border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all mb-5"
                  />
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_GOALS.map((g) => (
                      <button key={g} onClick={() => setData({ ...data, goal: g })}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${data.goal === g ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-violet-500/30 hover:text-violet-400'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Level */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">What's your current level?</h2>
                  <p className="text-sm text-slate-400 mb-6">We'll adjust the roadmap complexity accordingly</p>
                  <div className="space-y-3">
                    {LEVELS.map((lvl) => (
                      <motion.button key={lvl.id} onClick={() => setData({ ...data, level: lvl.id })}
                        whileHover={{ x: 4 }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                          data.level === lvl.id ? 'bg-violet-500/15 border-violet-500/40 shadow-sm' : 'bg-white/[0.02] border-white/[0.07] hover:border-violet-500/25'}`}>
                        <span className="text-2xl">{lvl.icon}</span>
                        <div>
                          <div className="font-semibold text-white text-sm">{lvl.label}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{lvl.desc}</div>
                        </div>
                        {data.level === lvl.id && <div className="ml-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs">✓</div>}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Schedule */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">How much time can you commit?</h2>
                  <p className="text-sm text-slate-400 mb-5">We'll create a realistic schedule for you</p>
                  <div className="mb-6">
                    <p className="text-xs text-slate-400 mb-3 font-medium">Daily study time</p>
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_OPTIONS.map((t) => (
                        <button key={t.value} onClick={() => setData({ ...data, dailyMinutes: t.value })}
                          className={`p-4 rounded-xl border text-left transition-all ${data.dailyMinutes === t.value ? 'bg-violet-500/15 border-violet-500/40' : 'bg-white/[0.02] border-white/[0.07] hover:border-violet-500/25'}`}>
                          <div className="flex items-center gap-2 mb-1"><Clock className="w-3.5 h-3.5 text-violet-400" /><span className="font-semibold text-white text-sm">{t.label}</span></div>
                          <div className="text-xs text-slate-400">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-3 font-medium">Target completion</p>
                    <div className="flex flex-wrap gap-2">
                      {TARGET_DAYS.map((t) => (
                        <button key={t.value} onClick={() => setData({ ...data, targetDays: t.value })}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${data.targetDays === t.value ? 'bg-violet-500/15 border-violet-500/40 text-violet-300' : 'bg-white/[0.02] border-white/[0.07] text-slate-400 hover:border-violet-500/25 hover:text-slate-200'}`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Format */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">How do you prefer to learn?</h2>
                  <p className="text-sm text-slate-400 mb-6">Pick your preferred learning style</p>
                  <div className="space-y-2.5">
                    {FORMATS.map((f) => (
                      <motion.button key={f.id} onClick={() => setData({ ...data, preferredFormat: f.id })}
                        whileHover={{ x: 4 }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${data.preferredFormat === f.id ? 'bg-violet-500/15 border-violet-500/40' : 'bg-white/[0.02] border-white/[0.07] hover:border-violet-500/25'}`}>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${data.preferredFormat === f.id ? 'bg-violet-500/25 text-violet-400' : 'bg-white/5 text-slate-400'}`}>
                          <f.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm text-white">{f.label}</span>
                        {data.preferredFormat === f.id && <div className="ml-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs">✓</div>}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Outcome */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">What's your desired outcome?</h2>
                  <p className="text-sm text-slate-400 mb-6">This helps us tailor your final project and goals</p>
                  <textarea
                    value={data.desiredOutcome}
                    onChange={(e) => setData({ ...data, desiredOutcome: e.target.value })}
                    placeholder="e.g. Get a job as a frontend developer, build my own SaaS product, pass the AWS certification..."
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl border bg-[#111118] text-slate-200 placeholder-slate-500 text-sm outline-none border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none mb-4"
                  />
                  <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-xs text-violet-300 font-medium mb-2">Your personalized roadmap will include:</p>
                    <div className="space-y-1">
                      {['Structured phases and modules for your goal', `${data.targetDays}-day timeline with daily ${data.dailyMinutes}-min sessions`, `${data.level} level content with interactive lessons`, 'AI tutor support and quiz assessments'].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                          <span className="text-violet-400">✓</span>{item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={prev} disabled={step === 0} icon={<ChevronLeft className="w-4 h-4" />}>
            Back
          </Button>
          {step < STEPS_CONFIG.length - 1 ? (
            <Button variant="primary" onClick={next} disabled={step === 0 && !data.goal.trim()}>
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="primary" size="lg" loading={loading} onClick={handleGenerate}
              icon={<Zap className="w-4 h-4" />}>
              Generate My Roadmap
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
