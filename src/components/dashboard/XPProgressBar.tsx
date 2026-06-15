import { motion } from 'framer-motion';
import { xpRequiredForLevel } from '../../utils/dashboardStore';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface XPProgressBarProps {
  level: number;
  xp: number;
  totalXP: number;
}

export default function XPProgressBar({ level, xp, totalXP }: XPProgressBarProps) {
  const xpRequired = xpRequiredForLevel(level);
  const progress = Math.min(100, Math.round((xp / xpRequired) * 100));
  const [pulse, setPulse] = useState(false);

  // Trigger pulse animation when xp, level, or totalXP changes
  useEffect(() => {
    if (totalXP > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 650);
      return () => clearTimeout(timer);
    }
  }, [xp, level, totalXP]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: pulse ? 1.03 : 1,
        borderColor: pulse ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255, 255, 255, 0.4)',
        boxShadow: pulse
          ? '0 12px 24px rgba(34, 197, 94, 0.15), 0 0 20px rgba(34, 197, 94, 0.1)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 14 }}
      whileHover={{ y: -2 }}
      className="glass rounded-2xl p-5 border shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-md shadow-brand-primary/20"
            animate={pulse ? { rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <Star className="w-5 h-5 text-white fill-white" />
          </motion.div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Level</span>
            <h3 className="text-xl font-extrabold text-slate-800 leading-tight">{level}</h3>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total XP</span>
          <p className="text-lg font-extrabold text-brand-dark">{totalXP.toLocaleString()}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer rounded-full" />
          </motion.div>
        </div>
        
        {/* XP Text */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-semibold text-slate-500">
            {xp} / {xpRequired} XP
          </span>
          <span className="text-xs font-bold text-brand-dark">
            {xpRequired - xp} XP to Level {level + 1}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
