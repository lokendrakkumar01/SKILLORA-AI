import User from '../models/User';
import Achievement from '../models/Achievement';
import StudyActivity from '../models/StudyActivity';

const ACHIEVEMENTS = [
  { type: 'first_lesson', title: 'First Step!', description: 'Completed your first lesson', icon: '🎯', xpBonus: 100 },
  { type: 'streak_3', title: '3-Day Streak!', description: 'Studied 3 days in a row', icon: '🔥', xpBonus: 150 },
  { type: 'streak_7', title: 'Week Warrior!', description: 'Studied 7 days in a row', icon: '⚡', xpBonus: 300 },
  { type: 'quiz_master', title: 'Quiz Master!', description: 'Passed 5 quizzes with 80%+', icon: '🧠', xpBonus: 200 },
  { type: 'roadmap_complete', title: 'Roadmap Explorer!', description: 'Completed a full roadmap', icon: '🗺️', xpBonus: 500 },
  { type: 'lessons_10', title: 'Consistent Learner!', description: 'Completed 10 lessons', icon: '📚', xpBonus: 250 },
];

export async function awardXP(userId: string, amount: number): Promise<void> {
  await User.findByIdAndUpdate(userId, { $inc: { xp: amount } });
}

export async function updateStreak(userId: string): Promise<number> {
  const today = new Date().toISOString().split('T')[0];
  const user = await User.findById(userId);
  if (!user) return 0;

  const lastActive = user.lastActiveDate
    ? user.lastActiveDate.toISOString().split('T')[0]
    : null;

  let newStreak = user.streak;

  if (lastActive === today) {
    return newStreak; // Already active today
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActive === yesterdayStr) {
    newStreak += 1;
  } else {
    newStreak = 1; // Reset streak
  }

  const longestStreak = Math.max(newStreak, user.longestStreak);
  await User.findByIdAndUpdate(userId, {
    streak: newStreak,
    longestStreak,
    lastActiveDate: new Date(),
  });

  // Update study activity
  await StudyActivity.findOneAndUpdate(
    { userId, date: today },
    { $inc: { minutesStudied: 20, lessonsCompleted: 1 } },
    { upsert: true, new: true }
  );

  return newStreak;
}

export async function checkAndAwardAchievements(userId: string): Promise<string[]> {
  const user = await User.findById(userId);
  if (!user) return [];

  const earned: string[] = [];
  const existing = await Achievement.find({ userId }).select('type');
  const existingTypes = new Set(existing.map((a) => a.type));

  for (const ach of ACHIEVEMENTS) {
    if (existingTypes.has(ach.type)) continue;

    let shouldAward = false;

    if (ach.type === 'first_lesson' && user.totalLessonsCompleted >= 1) shouldAward = true;
    if (ach.type === 'lessons_10' && user.totalLessonsCompleted >= 10) shouldAward = true;
    if (ach.type === 'streak_3' && user.streak >= 3) shouldAward = true;
    if (ach.type === 'streak_7' && user.streak >= 7) shouldAward = true;

    if (shouldAward) {
      try {
        await Achievement.create({ userId, ...ach });
        await awardXP(userId, ach.xpBonus);
        earned.push(ach.type);
      } catch (_) {
        // ignore duplicate errors
      }
    }
  }

  return earned;
}
