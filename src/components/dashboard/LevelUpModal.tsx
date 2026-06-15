import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import type { AvatarStageConfig } from '../../utils/dashboardStore';
import { Sparkles } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  previousStage: AvatarStageConfig;
  newStage: AvatarStageConfig;
  newLevel: number;
  xpEarned: number;
  onClose: () => void;
}

const LEAF_EMOJIS = ['🍃', '🌿', '🌱', '🍂', '✨', '🌟', '🍀'];

// Updated LeafParticle with memoized random values
function LeafParticle({ delay, index }: { delay: number; index: number }) {
  const { destX, destY, emoji, size, duration, rotate } = useMemo(() => {
    const angle = (index / 36) * 2 * Math.PI;
    const speed = 70 + Math.random() * 95;
    const destX = Math.cos(angle) * speed;
    const destY = Math.sin(angle) * speed - 50;
    const emoji = LEAF_EMOJIS[Math.floor(Math.random() * LEAF_EMOJIS.length)];
    const size = 12 + Math.random() * 18;
    const duration = 1.4 + Math.random() * 0.8;
    const rotate = (Math.random() - 0.5) * 720;
    return { destX, destY, emoji, size, duration, rotate };
  }, [index]);

  return (
    <motion.span
      className="absolute select-none pointer-events-none z-20"
      style={{
        left: '50%',
        top: '40%',
        fontSize: size,
      }}
      initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
      animate={{
        scale: [0, 1.4, 1, 0],
        opacity: [1, 1, 0.7, 0],
        x: destX,
        y: destY,
        rotate: [0, rotate],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    >
      {emoji}
    </motion.span>
  );
}

export default function LevelUpModal({ isOpen, previousStage, newStage, newLevel, xpEarned, onClose }: LevelUpModalProps) {
  const stageChanged = previousStage.stage !== newStage.stage;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl z-10 border border-slate-200"
            style={{ background: stageChanged ? newStage.gradient : 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)' }}
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.05 }}
          >
            {/* Confetti Explosion Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(36)].map((_, i) => (
                <LeafParticle
                  key={i}
                  index={i}
                  delay={0.25 + (i % 6) * 0.04}
                />
              ))}
            </div>

            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-white/20 filter blur-3xl" />
            <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-brand-primary/10 filter blur-3xl" />

            <div className="relative p-7 flex flex-col items-center text-center">
              {/* Top Sparkle Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.25 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/15 flex items-center justify-center mb-3">
                  <Sparkles className="w-7 h-7 text-brand-primary animate-pulse" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-black text-slate-800 mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {stageChanged ? 'Evolution Achieved!' : 'Level Up!'}
              </motion.h2>
              
              {/* Evolution Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                {stageChanged ? (
                  <span className="text-brand-dark font-extrabold text-sm bg-brand-light/75 border border-brand-primary/20 rounded-full px-3 py-1 inline-flex items-center gap-1.5 animate-pulse shadow-xs">
                    🌟 Your EcoTwin is evolving. 🌟
                  </span>
                ) : (
                  <span className="text-slate-500 font-bold text-xs">
                    Your EcoTwin is growing stronger.
                  </span>
                )}
              </motion.div>

              {/* Stage Transition Visual */}
              {stageChanged ? (
                <motion.div
                  className="flex items-center gap-4 mb-5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  {/* Previous Stage */}
                  <div className="flex flex-col items-center opacity-50">
                    <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center border border-slate-200/50 text-3xl">
                      {previousStage.emoji}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1">{previousStage.label}</span>
                  </div>

                  {/* Arrow */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                  >
                    <svg className="w-6 h-6 text-brand-primary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.div>

                  {/* New Stage */}
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                  >
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2 border-brand-primary/30 shadow-lg relative"
                      style={{ background: 'rgba(255,255,255,0.7)' }}
                    >
                      {/* Aura Ring Glow */}
                      <motion.div
                        className="absolute -inset-2 rounded-full border border-brand-primary/20 -z-10 bg-brand-primary/5"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {newStage.emoji}
                    </div>
                    <span className="text-xs font-extrabold text-brand-dark mt-1">{newStage.label}</span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="mb-5 relative"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.45, type: 'spring' }}
                >
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-2 border-brand-primary/30 mx-auto relative bg-white/70"
                    style={{ boxShadow: `0 0 20px ${newStage.glowColor}` }}
                  >
                    {/* Breathing Glow Aura */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-brand-primary/10 -z-10"
                      animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    {newStage.emoji}
                  </div>
                  <p className="text-sm font-extrabold text-brand-dark mt-2">{newStage.label}</p>
                </motion.div>
              )}

              {/* STATS PROGRESSION PANEL (Explicit boxes) */}
              <motion.div
                className="grid grid-cols-3 gap-2 w-full mb-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                {/* Current Level */}
                <div className="bg-white/60 border border-slate-200/50 rounded-xl p-2.5 shadow-xs">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    Current Lvl
                  </span>
                  <span className="block text-sm font-extrabold text-slate-600">
                    Lvl {newLevel - 1}
                  </span>
                </div>

                {/* New Level */}
                <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-2.5 shadow-xs">
                  <span className="block text-[9px] font-bold text-brand-dark uppercase tracking-wide">
                    New Level
                  </span>
                  <span className="block text-sm font-black text-brand-dark">
                    Lvl {newLevel}
                  </span>
                </div>

                {/* XP Earned */}
                <div className="bg-white/60 border border-slate-200/50 rounded-xl p-2.5 shadow-xs">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    XP Earned
                  </span>
                  <span className="block text-sm font-extrabold text-brand-primary">
                    +{xpEarned} XP
                  </span>
                </div>
              </motion.div>

              {/* Continue Button */}
              <motion.button
                onClick={onClose}
                className="w-full py-3.5 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-extrabold text-base transition-all shadow-lg shadow-brand-primary/20 active:scale-95 cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Growing 🌱
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
