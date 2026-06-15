import { motion } from 'framer-motion';
import { getAvatarStageForLevel, xpRequiredForLevel, AVATAR_STAGES } from '../../../utils/dashboardStore';
// import type { AvatarStage } from '../../../utils/dashboardStore';
import seedImg from '../../../assets/avatar/seed.png';
import sproutImg from '../../../assets/avatar/sprout.png';
import explorerImg from '../../../assets/avatar/explorer.png';
import treeImg from '../../../assets/avatar/tree.png';
import guardianImg from '../../../assets/avatar/guardian.png';

const avatarMap = {
  seed: seedImg,
  sprout: sproutImg,
  explorer: explorerImg,
  tree: treeImg,
  guardian: guardianImg,
};

interface HeroProfileProps {
  level: number;
  xp: number;
  carbonScore: number;
  potentialScore: number;
}

export default function HeroProfile({ level, xp, carbonScore, potentialScore }: HeroProfileProps) {
  const currentStage = getAvatarStageForLevel(level);
  const nextStage = AVATAR_STAGES.find(s => s.minLevel > level);
  const xpRequired = xpRequiredForLevel(level);

  const stageProgress = nextStage
    ? Math.round(((level - currentStage.minLevel) / (nextStage.minLevel - currentStage.minLevel)) * 100)
    : 100;

  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl glass-elevated transition-all duration-500 mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-light/20 to-brand-primary/10 backdrop-blur-md rounded-3xl"
      />
      <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        {/* Avatar */}
        <motion.div
          className="flex-shrink-0"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        >
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-white flex items-center justify-center border-2 border-slate-200 shadow-sm">
            <img src={avatarMap[currentStage.stage]} alt={currentStage.label} className="w-28 h-28 object-cover rounded-full" />
          </div>
          <div className="mt-2 text-center text-sm font-medium text-brand-dark">
            {currentStage.label}
          </div>
        </motion.div>
        {/* Stats */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Your EcoTwin Profile</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md">
            Level {level} • {xp}/{xpRequired} XP • {currentStage.description}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white border border-amber-200/40 rounded-xl shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-400">Current Score</div>
              <div className="text-xl font-extrabold text-amber-700">{carbonScore}</div>
            </div>
            <div className="p-4 bg-white border border-brand-primary/30 rounded-xl shadow-sm">
              <div className="text-xs font-bold uppercase text-brand-primary">Potential</div>
              <div className="text-xl font-extrabold text-brand-dark">{potentialScore}</div>
            </div>
          </div>
          {nextStage && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                <span>Progress to {nextStage.label}</span>
                <span>{stageProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${stageProgress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
