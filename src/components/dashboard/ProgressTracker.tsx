import { motion } from 'framer-motion';
import { Flame, Target, TrendingUp, Award } from 'lucide-react';
import type { UserStats } from '../../utils/dashboardStore';

interface ProgressTrackerProps {
  stats: UserStats;
}

export default function ProgressTracker({ stats }: ProgressTrackerProps) {
  const maxDailyMissions = Math.max(...stats.weeklyProgress, 3);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const statCards = [
    {
      icon: <Target className="w-5 h-5" />,
      label: 'This Week',
      value: `${stats.weeklyProgress.reduce((a, b) => a + b, 0)}`,
      sub: 'missions done',
      bg: 'bg-brand-light',
      iconColor: 'text-brand-dark',
    },
    {
      icon: <Flame className="w-5 h-5" />,
      label: 'Streak',
      value: `${stats.currentStreak}`,
      sub: 'days',
      bg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Carbon Improvement',
      value: `${stats.carbonImprovement}%`,
      sub: 'reduction',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: 'Total Missions',
      value: `${stats.missionsCompleted}`,
      sub: 'completed',
      bg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-xl font-extrabold text-slate-800 mb-4">Progress Tracker 📊</h2>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.035, y: -4, boxShadow: '0 8px 16px rgba(34, 197, 94, 0.06)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 17, delay: idx * 0.04 }}
            className="glass rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:shadow-brand-primary/[0.05] transition-shadow duration-300"
          >
            <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center ${card.iconColor} mb-3`}>
              {card.icon}
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-800">{card.value}</span>
              <span className="text-xs text-slate-400 font-semibold">{card.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Bar Chart */}
      <motion.div
        className="glass rounded-2xl p-5 border border-slate-200 shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-brand-primary/[0.05]"
        whileHover={{ scale: 1.015, y: -2, boxShadow: '0 10px 20px rgba(34, 197, 94, 0.04)' }}
        transition={{ type: 'spring', stiffness: 450, damping: 20 }}
      >
        <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Weekly Activity</h3>
        <div className="flex items-end justify-between gap-2 h-28">
          {stats.weeklyProgress.map((val, idx) => {
            const height = maxDailyMissions > 0 ? (val / maxDailyMissions) * 100 : 0;
            const isToday = idx === 6;
            
            return (
              <div key={idx} className="flex flex-col items-center flex-1 gap-1.5">
                {/* Value label */}
                <span className={`text-[10px] font-extrabold ${isToday ? 'text-brand-dark' : 'text-slate-400'}`}>
                  {val > 0 ? val : ''}
                </span>
                
                {/* Bar */}
                <div className="w-full flex justify-center" style={{ height: '80px' }}>
                  <motion.div
                    className={`w-full max-w-[28px] rounded-lg relative overflow-hidden ${
                      isToday
                        ? 'bg-gradient-to-t from-brand-primary to-brand-accent'
                        : val > 0
                          ? 'bg-brand-primary/30'
                          : 'bg-slate-100'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 8)}%` }}
                    transition={{ duration: 0.6, delay: 0.5 + idx * 0.05, ease: 'easeOut' }}
                    style={{ alignSelf: 'flex-end' }}
                  >
                    {isToday && <div className="absolute inset-0 shimmer" />}
                  </motion.div>
                </div>
                
                {/* Day label */}
                <span className={`text-[10px] font-bold ${isToday ? 'text-brand-dark' : 'text-slate-400'}`}>
                  {dayLabels[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
