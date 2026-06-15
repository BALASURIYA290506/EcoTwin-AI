import { motion } from 'framer-motion';
import { getAvatarStageForLevel, xpRequiredForLevel, AVATAR_STAGES } from '../../utils/dashboardStore';
import type { AvatarStage, AvatarStageConfig } from '../../utils/dashboardStore';
// Update find callback typing later in file
import seedImg from '../../assets/avatar/seed.png';
import sproutImg from '../../assets/avatar/sprout.png';
import explorerImg from '../../assets/avatar/explorer.png';
import treeImg from '../../assets/avatar/tree.png';
import guardianImg from '../../assets/avatar/guardian.png';
const avatarMap = { seed: seedImg, sprout: sproutImg, explorer: explorerImg, tree: treeImg, guardian: guardianImg };
interface AvatarCardProps {
  level: number;
  xp: number;
  carbonScore: number;
  potentialScore: number;
}

interface ParticleConfig {
  size: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

// Stage-specific glowing vector light particles (No Emojis!)
const STAGE_PARTICLES: Record<AvatarStage, ParticleConfig[]> = {
  seed: [
    { size: 6, left: 15, delay: 0, duration: 5.5, color: '#86EFAC' },
    { size: 4, left: 30, delay: 1.2, duration: 6.2, color: '#4ADE80' },
    { size: 8, left: 45, delay: 0.5, duration: 5.8, color: '#22C55E' },
    { size: 5, left: 60, delay: 2.1, duration: 5.2, color: '#86EFAC' },
    { size: 7, left: 75, delay: 0.8, duration: 6.0, color: '#F59E0B' },
    { size: 6, left: 85, delay: 1.5, duration: 5.6, color: '#34D399' },
  ],
  sprout: [
    { size: 8, left: 12, delay: 0.2, duration: 4.8, color: '#22C55E' },
    { size: 6, left: 28, delay: 1.5, duration: 5.4, color: '#4ADE80' },
    { size: 4, left: 42, delay: 0.7, duration: 5.6, color: '#86EFAC' },
    { size: 9, left: 58, delay: 2.3, duration: 4.5, color: '#10B981' },
    { size: 7, left: 72, delay: 0.9, duration: 5.2, color: '#4ADE80' },
    { size: 5, left: 88, delay: 1.8, duration: 5.0, color: '#22C55E' },
  ],
  explorer: [
    { size: 8, left: 10, delay: 0.5, duration: 4.5, color: '#10B981' },
    { size: 9, left: 25, delay: 1.8, duration: 5.0, color: '#34D399' },
    { size: 6, left: 40, delay: 0.2, duration: 5.3, color: '#F59E0B' },
    { size: 10, left: 55, delay: 2.5, duration: 4.2, color: '#10B981' },
    { size: 7, left: 70, delay: 1.1, duration: 4.8, color: '#22C55E' },
    { size: 8, left: 85, delay: 1.6, duration: 4.9, color: '#34D399' },
  ],
  tree: [
    { size: 9, left: 8, delay: 0.1, duration: 4.2, color: '#22C55E' },
    { size: 7, left: 22, delay: 1.2, duration: 4.6, color: '#15803D' },
    { size: 8, left: 38, delay: 2.0, duration: 5.0, color: '#86EFAC' },
    { size: 5, left: 52, delay: 0.5, duration: 3.6, color: '#F59E0B' },
    { size: 10, left: 68, delay: 1.7, duration: 4.4, color: '#22C55E' },
    { size: 6, left: 82, delay: 2.8, duration: 4.8, color: '#10B981' },
    { size: 4, left: 92, delay: 0.9, duration: 3.9, color: '#F59E0B' },
  ],
  guardian: [
    { size: 8, left: 6, delay: 0.2, duration: 3.8, color: '#F59E0B' },
    { size: 9, left: 20, delay: 1.5, duration: 4.2, color: '#22C55E' },
    { size: 7, left: 34, delay: 0.8, duration: 3.2, color: '#60A5FA' },
    { size: 8, left: 48, delay: 2.1, duration: 3.6, color: '#F59E0B' },
    { size: 10, left: 62, delay: 0.4, duration: 4.0, color: '#10B981' },
    { size: 7, left: 76, delay: 1.7, duration: 4.4, color: '#22C55E' },
    { size: 5, left: 88, delay: 2.5, duration: 3.4, color: '#F59E0B' },
    { size: 6, left: 95, delay: 1.1, duration: 3.3, color: '#60A5FA' },
  ],
};

export default function AvatarCard({ level, xp, carbonScore, potentialScore }: AvatarCardProps) {
  const currentStage = getAvatarStageForLevel(level);
  const nextStage = AVATAR_STAGES.find((s: AvatarStageConfig) => s.minLevel > level);
  const xpRequired = xpRequiredForLevel(level);

  // Evolution progress toward next stage
  const stageProgress = nextStage
    ? Math.round(((level - currentStage.minLevel) / (nextStage.minLevel - currentStage.minLevel)) * 100)
    : 100;

  // Float Configuration
  const getFloatParams = (stage: AvatarStage) => {
    switch (stage) {
      case 'seed': return { y: [-2, 3, -2], x: [-1, 1, -1], rotate: [-0.5, 0.5, -0.5], duration: 7.0 };
      case 'sprout': return { y: [-4, 4, -4], x: [-2, 2, -2], rotate: [-1, 1, -1], duration: 6.0 };
      case 'explorer': return { y: [-5, 5, -5], x: [-3, 3, -3], rotate: [-1.5, 1.5, -1.5], duration: 5.2 };
      case 'tree': return { y: [-4, 6, -4], x: [-2, 3, -2], rotate: [-1, 1.5, -1], duration: 5.8 };
      case 'guardian': return { y: [-6, 6, -6], x: [-4, 4, -4], rotate: [-2, 2, -2], duration: 4.8 };
    }
  };

  const getGlowParams = (stage: AvatarStage) => {
    switch (stage) {
      case 'seed':
        return {
          scale: [1, 1.01, 1],
          boxShadow: [
            `0 0 15px rgba(34, 197, 94, 0.15), 0 0 30px rgba(34, 197, 94, 0.05)`,
            `0 0 25px rgba(34, 197, 94, 0.25), 0 0 50px rgba(34, 197, 94, 0.1)`,
            `0 0 15px rgba(34, 197, 94, 0.15), 0 0 30px rgba(34, 197, 94, 0.05)`,
          ],
          duration: 4.0
        };
      case 'sprout':
        return {
          scale: [1, 1.018, 1],
          boxShadow: [
            `0 0 20px rgba(34, 197, 94, 0.25), 0 0 40px rgba(34, 197, 94, 0.15)`,
            `0 0 32px rgba(34, 197, 94, 0.40), 0 0 64px rgba(34, 197, 94, 0.25)`,
            `0 0 20px rgba(34, 197, 94, 0.25), 0 0 40px rgba(34, 197, 94, 0.15)`,
          ],
          duration: 3.5
        };
      case 'explorer':
        return {
          scale: [1, 1.02, 1],
          boxShadow: [
            `0 0 24px rgba(16, 185, 129, 0.3), 0 0 48px rgba(16, 185, 129, 0.2)`,
            `0 0 38px rgba(16, 185, 129, 0.48), 0 0 76px rgba(16, 185, 129, 0.32)`,
            `0 0 24px rgba(16, 185, 129, 0.3), 0 0 48px rgba(16, 185, 129, 0.2)`,
          ],
          duration: 3.2
        };
      case 'tree':
        return {
          scale: [1, 1.022, 1],
          boxShadow: [
            `0 0 28px rgba(21, 128, 61, 0.35), 0 0 56px rgba(21, 128, 61, 0.25)`,
            `0 0 44px rgba(21, 128, 61, 0.55), 0 0 88px rgba(21, 128, 61, 0.40)`,
            `0 0 28px rgba(21, 128, 61, 0.35), 0 0 56px rgba(21, 128, 61, 0.25)`,
          ],
          duration: 3.0
        };
      case 'guardian':
        return {
          scale: [1, 1.025, 1],
          boxShadow: [
            `0 0 35px rgba(21, 128, 61, 0.5), 0 0 70px rgba(21, 128, 61, 0.35), 0 0 20px rgba(245, 158, 11, 0.2)`,
            `0 0 55px rgba(21, 128, 61, 0.75), 0 0 110px rgba(21, 128, 61, 0.55), 0 0 40px rgba(245, 158, 11, 0.4)`,
            `0 0 35px rgba(21, 128, 61, 0.5), 0 0 70px rgba(21, 128, 61, 0.35), 0 0 20px rgba(245, 158, 11, 0.2)`,
          ],
          duration: 2.6
        };
    }
  };

  const floatParams = getFloatParams(currentStage.stage);
  const glowParams = getGlowParams(currentStage.stage);
  const particles = STAGE_PARTICLES[currentStage.stage] || STAGE_PARTICLES.seed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-3xl glass-elevated transition-all duration-500"
      style={{
        background: currentStage.gradient,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--glass-elevated-border)'
      }}
    >
      {/* Floating Glowing Particle Lights (No Emojis!) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={`${currentStage.stage}-particle-${i}`}
            className="absolute select-none opacity-0 rounded-full"
            style={{
              left: `${particle.left}%`,
              width: particle.size,
              height: particle.size,
              bottom: '-20px',
              backgroundColor: particle.color,
              boxShadow: `0 0 8px ${particle.color}`,
            }}
            animate={{
              y: [-10, -280],
              x: [0, i % 2 === 0 ? 20 : -20, i % 2 === 0 ? -10 : 10],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">

          {/* Avatar Circle */}
          <motion.div
            className="relative flex-shrink-0"
            animate={{
              y: floatParams.y,
              x: floatParams.x,
              rotate: floatParams.rotate,
            }}
            transition={{ duration: floatParams.duration, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.div
              className="w-36 h-36 md:w-40 md:h-40 rounded-full flex items-center justify-center relative bg-gradient-to-br from-white to-brand-light/60 border-2 border-slate-200"
              style={{
                boxShadow: glowParams.boxShadow[0]
              }}
              animate={{
                scale: glowParams.scale,
                boxShadow: glowParams.boxShadow,
              }}
              transition={{ duration: glowParams.duration, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Premium Gradient Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-accent/5 pointer-events-none" />

              {/* Render High-Fidelity Custom Vector SVG */}
              <img src={avatarMap[currentStage.stage]} alt={currentStage.label} className="w-28 h-28 rounded-full object-cover" />

              {/* Stage Badge */}
              <motion.div
                className="absolute -bottom-3 px-5 py-2 bg-white backdrop-blur-md border border-brand-primary/20 rounded-full shadow-lg layer-shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
              >
                <span className="text-xs font-extrabold text-brand-dark tracking-wide">
                  {currentStage.label}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Info Side */}
          <div className="flex-1 text-center md:text-left">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-slate-800 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Your EcoTwin Profile
            </motion.h2>
            <motion.p
              className="text-sm text-slate-600 mb-6 max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {currentStage.description}
            </motion.p>

            {/* Carbon Score Comparison */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
              <motion.div
                className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-md rounded-xl border border-amber-200/40 hover-lift"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-amber-700">{carbonScore}</span>
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current</span>
                  <span className="block text-xs font-bold text-slate-600">Score</span>
                </div>
              </motion.div>

              <motion.svg
                className="w-4 h-4 text-brand-primary opacity-60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>

              <motion.div
                className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-md rounded-xl border border-brand-primary/30 hover-lift"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-light to-brand-primary/10 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-brand-dark">{potentialScore}</span>
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-bold text-brand-primary uppercase tracking-wide">Potential</span>
                  <span className="block text-xs font-bold text-brand-dark">Score</span>
                </div>
              </motion.div>
            </div>

            {/* Evolution Progress */}
            {nextStage && (
              <motion.div
                className="max-w-sm animate-fade-in"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Evolution Progress
                  </span>
                  <span className="text-xs font-extrabold text-brand-dark bg-white/80 px-2 py-1 rounded-md">
                    {nextStage.label}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 backdrop-blur-sm">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${stageProgress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                  >
                    <div className="absolute inset-0 shimmer rounded-full opacity-60" />
                  </motion.div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium leading-relaxed">
                  Level <span className="text-brand-dark font-bold">{level}</span> • <span className="text-brand-dark font-bold">{xp} / {xpRequired}</span> XP • Reach Level <span className="text-brand-dark font-bold">{nextStage.minLevel}</span> to evolve
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
