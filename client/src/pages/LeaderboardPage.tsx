import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Medal, RefreshCw, Trophy, Zap } from 'lucide-react';
import { progressApi } from '../api/roadmaps';
import { ProtectedLayout } from '../components/layout/AppLayout';
import { UserAvatar } from '../components/ui/UserAvatar';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const podiumStyles = ['border-amber-300/30 bg-amber-300/[.06] text-amber-200', 'border-slate-300/20 bg-slate-300/[.04] text-slate-200', 'border-orange-400/20 bg-orange-400/[.04] text-orange-200'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    setLoading(true); setError('');
    progressApi.leaderboard(page).then((res) => { setLeaders(res.data.leaders || []); setMyRank(res.data.myRank ?? null); setTotal(res.data.total || 0); setTotalPages(res.data.totalPages || 1); })
      .catch((err) => setError(err.response?.data?.error || 'Could not load the leaderboard. Please try again.'))
      .finally(() => setLoading(false));
  }, [page]);
  useEffect(() => { load(); }, [load]);

  return <ProtectedLayout title="Leaderboard">
    <div className="mx-auto max-w-5xl space-y-7">
      <div><p className="text-sm font-semibold text-violet-300">Learn together, grow together</p><h1 className="mt-1 text-3xl font-black text-white">Leaderboard</h1><p className="mt-2 text-sm text-slate-400">All {total} learners ranked by XP earned across Skillora.</p></div>
      {loading ? <div className="flex h-64 items-center justify-center"><LoadingSpinner size="lg" /></div>
        : error ? <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-sm text-rose-200"><p>{error}</p><Button className="mt-4" variant="outline" size="sm" onClick={load} icon={<RefreshCw className="h-4 w-4" />}>Try again</Button></div>
          : !leaders.length ? <div className="rounded-3xl border border-dashed border-violet-500/25 p-12 text-center"><Trophy className="mx-auto h-10 w-10 text-violet-300" /><h2 className="mt-4 text-lg font-bold text-white">Be the first on the board</h2><p className="mt-2 text-sm text-slate-400">Complete lessons and quizzes to earn XP.</p></div>
            : <>
              {page === 1 && <div className="grid grid-cols-3 items-end gap-3 sm:gap-5">{[1, 0, 2].map((position) => {
                const leader = leaders[position];
                return leader ? <motion.div key={leader._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: position * .08 }} className={`flex min-w-0 flex-col items-center rounded-2xl border p-3 text-center sm:p-5 ${podiumStyles[position]}`}>
                  <div className="mb-2 text-xs font-bold uppercase tracking-wider">{position === 0 ? '1st place' : position === 1 ? '2nd place' : '3rd place'}</div>
                  <UserAvatar name={leader.name} src={leader.avatar} className={`${position === 0 ? 'h-16 w-16' : 'h-12 w-12'} border-2 border-white/10 text-lg`} />
                  <p className="mt-3 max-w-full truncate text-sm font-bold text-white">{leader.name}{leader._id === user?._id ? ' (You)' : ''}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold"><Zap className="h-3.5 w-3.5" />{leader.xp || 0} XP</p>
                </motion.div> : <div key={position} />;
              })}</div>}
              <div className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#12151e]">
                <div className="grid grid-cols-[42px_minmax(0,1fr)_auto] gap-3 border-b border-white/[.07] px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sm:grid-cols-[56px_minmax(0,1fr)_100px_110px]"><span>Rank</span><span>Learner</span><span className="hidden sm:block">Lessons</span><span className="text-right">XP</span></div>
                {leaders.map((leader: any, index: number) => <div key={leader._id} className={`grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[.04] px-4 py-3 last:border-0 sm:grid-cols-[56px_minmax(0,1fr)_100px_110px] ${leader._id === user?._id ? 'bg-violet-500/[.07]' : ''}`}>
                  <span className="text-sm font-bold text-slate-400">#{index + 1}</span><div className="flex min-w-0 items-center gap-3"><UserAvatar name={leader.name} src={leader.avatar} className="h-9 w-9 text-xs" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{leader.name}{leader._id === user?._id ? <span className="ml-2 text-xs text-violet-300">You</span> : null}</p><p className="text-xs text-slate-500">{leader.level || 'Learner'}</p></div></div>
                  <span className="hidden text-sm text-slate-400 sm:block">{leader.totalLessonsCompleted || 0}</span><span className="inline-flex items-center justify-end gap-1 text-sm font-bold text-amber-300"><Zap className="h-3.5 w-3.5" />{leader.xp || 0}</span>
                </div>)}
              </div>
              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row"><p className="text-xs text-slate-500">Showing {(page - 1) * 50 + 1}–{(page - 1) * 50 + leaders.length} of {total} learners{myRank ? ` · Your rank: #${myRank}` : ''}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button><span className="self-center px-2 text-xs text-slate-400">{page} / {totalPages}</span><Button variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</Button></div></div>
            </>}
    </div>
  </ProtectedLayout>;
}
