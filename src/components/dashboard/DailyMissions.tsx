import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Trophy, Flame, Zap, Target } from 'lucide-react';
import type { Mission } from '../../utils/dashboardStore';

interface DailyMissionsProps {
  missions: Mission[];
  onCompleteMission: (missionId: string) => void;
}

// ─── Category palette (light-theme only) ─────────────────────────────────────
const CATEGORY_META: Record<
  string,
  { bg: string; text: string; border: string; glow: string; dot: string }
> = {
  water:     { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',     glow: 'hover:shadow-sky-100',     dot: 'bg-sky-400'     },
  energy:    { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   glow: 'hover:shadow-amber-100',   dot: 'bg-amber-400'   },
  transport: { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200',  glow: 'hover:shadow-indigo-100',  dot: 'bg-indigo-400'  },
  waste:     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', glow: 'hover:shadow-emerald-100', dot: 'bg-emerald-400' },
  food:      { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  glow: 'hover:shadow-orange-100',  dot: 'bg-orange-400'  },
  lifestyle: { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  glow: 'hover:shadow-violet-100',  dot: 'bg-violet-400'  },
};

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  easy:   { label: 'Easy',   color: 'text-emerald-600' },
  medium: { label: 'Medium', color: 'text-amber-600'   },
  hard:   { label: 'Hard',   color: 'text-rose-500'    },
};

// Helper – reads optional difficulty field gracefully (future-proof)
function getDifficulty(mission: Mission): string {
  return (mission as unknown as { difficulty?: string }).difficulty ?? 'easy';
}

// ─── Particle symbols ─────────────────────────────────────────────────────────
const BURST_SYMBOLS = ['🍃', '🌿', '🌱', '✨', '⭐', '💚'];

export default function DailyMissions({ missions, onCompleteMission }: DailyMissionsProps) {
  const [xpFloats, setXpFloats]     = useState<{ id: string; amount: number }[]>([]);
  const [toast, setToast]           = useState<{ id: string; title: string; xp: number } | null>(null);
  const [bonusToast, setBonusToast] = useState<{ xp: number } | null>(null);
  const [activeBursts, setActiveBursts] = useState<Record<string, boolean>>({});
  const counter = useRef(0);

  const completedCount = missions.filter(m => m.completed).length;
  const progressPct    = missions.length > 0 ? (completedCount / missions.length) * 100 : 0;
  const totalXP        = missions.filter(m => m.completed).reduce((s, m) => s + m.xpReward, 0);

  // ── handle mission tap ───────────────────────────────────────────────────
  const handleComplete = (mission: Mission) => {
    if (mission.completed) return;
    counter.current += 1;
    const uid = `${mission.id}-${counter.current}`;

    // burst
    setActiveBursts(prev => ({ ...prev, [mission.id]: true }));
    setTimeout(() => setActiveBursts(prev => { const c = { ...prev }; delete c[mission.id]; return c; }), 950);

    // floating XP chip
    const fid = `float-${uid}`;
    setXpFloats(prev => [...prev, { id: fid, amount: mission.xpReward }]);
    setTimeout(() => setXpFloats(prev => prev.filter(f => f.id !== fid)), 1300);

    // toast
    const tid = `toast-${uid}`;
    setToast({ id: tid, title: mission.title, xp: mission.xpReward });
    setTimeout(() => setToast(c => (c?.id === tid ? null : c)), 3400);

    // all-done bonus
    if (completedCount + 1 === missions.length) {
      setBonusToast({ xp: 50 });
      setTimeout(() => setBonusToast(null), 4200);
    }

    onCompleteMission(mission.id);
  };

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Today's Missions"
    >

      {/* ── Toast Notifications ─────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -48, scale: 0.88 }}
            animate={{ opacity: 1, y: 0,   scale: 1    }}
            exit={{    opacity: 0, y: -28,  scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-[22rem]
                       bg-white rounded-2xl border border-brand-primary/30 shadow-2xl shadow-brand-primary/10
                       p-4 flex items-center gap-4 backdrop-blur-sm"
          >
            {/* XP pill */}
            <motion.div
              initial={{ scale: 0, rotate: -25 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 340 }}
              className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent
                         flex flex-col items-center justify-center text-white shadow-lg shadow-brand-primary/25"
            >
              <span className="text-[13px] font-black leading-none">+{toast.xp}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5 opacity-90">XP</span>
            </motion.div>

            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-extrabold text-slate-800 flex items-center gap-1.5">
                Mission Complete <span>🌱</span>
              </p>
              <p className="text-[11px] text-slate-500 font-semibold truncate mt-0.5">{toast.title}</p>
              <p className="text-[10px] font-bold text-brand-dark mt-1 flex items-center gap-1">
                EcoTwin is growing
                <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>🍃</motion.span>
              </p>
            </div>
          </motion.div>
        )}

        {bonusToast && (
          <motion.div
            key="bonus-toast"
            initial={{ opacity: 0, y: -28, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,   scale: 1   }}
            exit={{    opacity: 0, y: -18,  scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-xs
                       bg-gradient-to-r from-brand-primary to-brand-accent text-white
                       rounded-2xl p-3.5 shadow-xl shadow-brand-primary/30 flex items-center gap-3"
          >
            <Trophy className="w-5 h-5 shrink-0" />
            <span className="font-bold text-sm">All done! +{bonusToast.xp} Bonus XP 🎉</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Section Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5 gap-4">
        {/* Left: title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-brand-primary" />
            <h2 className="text-[1.35rem] font-extrabold text-slate-800 tracking-tight">Today's Missions</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">Complete quests to earn XP & grow your EcoTwin</p>
        </div>

        {/* Right: counters */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 bg-brand-light border border-brand-primary/20 rounded-full px-3.5 py-1.5">
            <Zap className="w-3.5 h-3.5 text-brand-primary" />
            <span className="text-xs font-extrabold text-brand-dark">{totalXP} XP today</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-500">
            <Flame className="w-3.5 h-3.5" />
            <span>3-day streak 🔥</span>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ────────────────────────────────────────────────── */}
      <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-600">Daily Progress</span>
          <motion.span
            className="text-xs font-extrabold text-brand-dark"
            key={completedCount}
            initial={{ scale: 1.25, color: '#22C55E' }}
            animate={{ scale: 1, color: '#15803D' }}
            transition={{ duration: 0.4 }}
          >
            {completedCount} / {missions.length} missions
          </motion.span>
        </div>

        {/* Track */}
        <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-between mt-2 px-0.5">
          {missions.map((m, i) => (
            <motion.div
              key={m.id}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                m.completed ? 'bg-brand-primary scale-110' : 'bg-slate-200'
              }`}
              animate={m.completed ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            />
          ))}
        </div>

        {completedCount === missions.length && missions.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs font-extrabold text-brand-dark mt-3 flex items-center justify-center gap-1.5"
          >
            <span>🎉</span> All missions complete — Bonus 50 XP earned! <span>🎉</span>
          </motion.p>
        )}
      </div>

      {/* ── Mission Cards ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3.5 relative">
        {/* XP float chips */}
        <AnimatePresence>
          {xpFloats.map(f => (
            <motion.div
              key={f.id}
              className="absolute right-6 top-1/3 z-30 pointer-events-none"
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -72, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.15, ease: 'easeOut' }}
            >
              <span className="text-brand-primary font-black text-lg drop-shadow">
                +{f.amount} XP
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {missions.map((mission, idx) => {
          const meta      = CATEGORY_META[mission.category] ?? CATEGORY_META.lifestyle;
          const diff      = DIFFICULTY_CONFIG[getDifficulty(mission)] ?? DIFFICULTY_CONFIG.easy;
          const isBurst   = activeBursts[mission.id];
          const isDone    = mission.completed;

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: isDone ? 0.72 : 1, y: 0 }}
              whileHover={isDone ? {} : { y: -3, scale: 1.015 }}
              transition={{ duration: 0.38, delay: 0.15 + idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`
                relative overflow-hidden rounded-2xl border
                transition-all duration-300 cursor-default
                ${isDone
                  ? 'bg-slate-50 border-slate-200 shadow-none'
                  : `bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-primary/25 ${meta.glow}`
                }
              `}
            >
              {/* Completion green left accent bar */}
              {isDone && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-primary to-brand-accent rounded-l-2xl" />
              )}

              {/* Particle burst */}
              {isBurst && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                  {BURST_SYMBOLS.map((sym, i) => {
                    const angle    = (i / BURST_SYMBOLS.length) * 2 * Math.PI;
                    const distance = 48 + Math.random() * 40;
                    return (
                      <motion.span
                        key={i}
                        className="absolute text-base select-none"
                        style={{ right: 72, bottom: 24 }}
                        initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                        animate={{
                          scale:   [0, 1.4, 0.8, 0],
                          opacity: [1, 1,   0.5, 0],
                          x:       Math.cos(angle) * distance,
                          y:       Math.sin(angle) * distance,
                          rotate:  [0, (Math.random() - 0.5) * 480],
                        }}
                        transition={{ duration: 0.88, ease: 'easeOut', delay: i * 0.03 }}
                      >
                        {sym}
                      </motion.span>
                    );
                  })}
                </div>
              )}

              <div className={`flex items-start gap-4 p-5 md:p-6 ${isDone ? 'pl-6' : ''}`}>
                {/* Icon bubble */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0
                  ${isDone ? 'bg-slate-100 border border-slate-200' : `${meta.bg} border ${meta.border}`}
                `}>
                  <span className={isDone ? 'grayscale opacity-50' : ''}>{mission.icon}</span>
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-[15px] font-bold leading-snug mb-0.5 transition-colors ${
                        isDone ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'
                      }`}>
                        {mission.title}
                      </h3>
                      <p className={`text-[13px] leading-relaxed transition-colors ${
                        isDone ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {mission.description}
                      </p>
                    </div>

                    {/* XP Badge */}
                    <motion.div
                      className={`
                        shrink-0 flex flex-col items-center justify-center rounded-xl px-3 py-2
                        border font-extrabold min-w-[56px]
                        ${isDone
                          ? 'bg-slate-100 border-slate-200'
                          : 'bg-brand-light border-brand-primary/20'
                        }
                      `}
                      animate={isDone ? { scale: [1, 1.12, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <Sparkles className={`w-3.5 h-3.5 mb-0.5 ${isDone ? 'text-slate-400' : 'text-brand-primary'}`} />
                      <span className={`text-[11px] leading-none ${isDone ? 'text-slate-400' : 'text-brand-dark'}`}>
                        +{mission.xpReward}
                      </span>
                      <span className={`text-[8px] uppercase tracking-widest font-bold mt-0.5 ${isDone ? 'text-slate-400' : 'text-brand-primary'}`}>
                        XP
                      </span>
                    </motion.div>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between mt-3.5">
                    <div className="flex items-center gap-2">
                      {/* Category chip */}
                      <span className={`
                        px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
                        ${isDone ? 'bg-slate-100 text-slate-400 border border-slate-200' : `${meta.bg} ${meta.text} border ${meta.border}`}
                      `}>
                        {mission.category}
                      </span>

                      {/* Difficulty dot */}
                      {!isDone && (
                        <span className={`text-[10px] font-bold ${diff.color} flex items-center gap-1`}>
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${meta.dot}`} />
                          {diff.label}
                        </span>
                      )}
                    </div>

                    {/* CTA button */}
                    <motion.button
                      onClick={() => handleComplete(mission)}
                      disabled={isDone}
                      whileHover={isDone ? {} : { scale: 1.04, y: -1 }}
                      whileTap={isDone   ? {} : { scale: 0.96 }}
                      className={`
                        flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold
                        transition-all duration-200
                        ${isDone
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                          : 'bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-md shadow-brand-primary/20 hover:shadow-lg hover:shadow-brand-primary/30 cursor-pointer'
                        }
                      `}
                    >
                      {isDone ? (
                        <>
                          <motion.span
                            initial={{ scale: 0, rotate: -40 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 14 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.span>
                          Done!
                        </>
                      ) : (
                        <>
                          <span>Mark Done</span>
                          <motion.span
                            animate={{ x: [0, 3, 0] }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-base leading-none"
                          >
                            →
                          </motion.span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Subtle shimmer on hover (non-completed) */}
              {!isDone && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none
                                bg-gradient-to-br from-white/0 to-brand-primary/[0.025]" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
