import { motion } from 'framer-motion';
import { Lock, Check, Footprints, Calendar, Zap, ShieldAlert, Globe, Scissors, Droplets } from 'lucide-react';
import type { Achievement } from '../../utils/dashboardStore';

interface AchievementPreviewProps {
  achievements: Achievement[];
}

export default function AchievementPreview({ achievements }: AchievementPreviewProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const renderBadgeSVG = (id: string, colorClass: string) => {
    switch (id) {
      case 'a1': return <Footprints className={`w-6 h-6 ${colorClass}`} />;
      case 'a2': return <Calendar className={`w-6 h-6 ${colorClass}`} />;
      case 'a3': return <Zap className={`w-6 h-6 ${colorClass}`} />;
      case 'a4': return <ShieldAlert className={`w-6 h-6 ${colorClass}`} />;
      case 'a5': return <Globe className={`w-6 h-6 ${colorClass}`} />;
      case 'a6': return <Scissors className={`w-6 h-6 ${colorClass}`} />;
      case 'a7': return <Droplets className={`w-6 h-6 ${colorClass}`} />;
      default: return <Globe className={`w-6 h-6 ${colorClass}`} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex flex-col gap-1">
          <span className="section-kicker text-xs uppercase tracking-widest text-brand-dark">Milestones</span>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Achievements</h2>
        </div>
        <span className="px-3.5 py-1.5 bg-brand-light text-brand-dark rounded-full text-xs font-extrabold border border-brand-primary/10">
          {unlockedCount}/{achievements.length} Unlocked
        </span>
      </div>

      {/* Horizontal Scroll Row */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 -mx-4 px-4 scrollbar-hide">
        {achievements.map((achievement, idx) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={
              achievement.unlocked
                ? {
                  scale: 1.06,
                  y: -6,
                  boxShadow: '0 12px 24px rgba(34, 197, 94, 0.16), 0 0 15px rgba(34, 197, 94, 0.08)',
                  borderColor: 'rgba(34, 197, 94, 0.45)'
                }
                : { scale: 1.02, y: -2 }
            }
            transition={{ type: 'spring', stiffness: 380, damping: 15, delay: idx * 0.03 }}
            className={`flex-shrink-0 w-44 rounded-3xl p-5 border transition-colors duration-300 relative overflow-hidden ${achievement.unlocked
                ? 'glass border-brand-primary/20 shadow-sm'
                : 'bg-white border-slate-200 opacity-70'
              }`}
          >
            {/* Shimmer Overlay for unlocked achievements */}
            {achievement.unlocked && (
              <div className="absolute inset-0 shimmer opacity-20 pointer-events-none rounded-2xl" />
            )}

            {/* Badge Icon */}
            <div className="relative mb-4">
              <motion.div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${achievement.unlocked
                    ? 'bg-brand-light border border-brand-primary/20 text-brand-dark'
                    : 'bg-slate-100 border border-slate-200 text-slate-400 grayscale'
                  }`}
                whileHover={achievement.unlocked ? { rotate: [0, -12, 12, 0], scale: 1.12 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              >
                {renderBadgeSVG(achievement.id, achievement.unlocked ? 'text-brand-primary' : 'text-slate-400')}
              </motion.div>

              {/* Status indicator */}
              {achievement.unlocked ? (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center shadow-xs border border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.8 + idx * 0.06 }}
                >
                  <Check className="w-3 h-3 text-white stroke-[3px]" />
                </motion.div>
              ) : (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center shadow-xs border border-white">
                  <Lock className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className={`text-sm font-extrabold mb-1 ${achievement.unlocked ? 'text-slate-800' : 'text-slate-400'
              }`}>
              {achievement.title}
            </h3>
            <p className={`text-[10px] leading-relaxed mb-4 ${achievement.unlocked ? 'text-slate-500' : 'text-slate-400'
              }`}>
              {achievement.description}
            </p>

            {/* Progress Bar */}
            {!achievement.unlocked && (
              <div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-brand-primary/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
                <span className="text-[9px] text-slate-400 font-bold mt-1.5 block">
                  {achievement.progress}/{achievement.target}
                </span>
              </div>
            )}

            {achievement.unlocked && (
              <span className="text-[10px] font-extrabold text-brand-dark">✓ Unlocked</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
