import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import FutureSelfAvatarSVG from './FutureSelfAvatarSVG';

interface StageConfig {
  stage: 'seed' | 'sprout' | 'explorer' | 'tree' | 'guardian';
  label: string;
  minLevel: number;
  xpRequired: number;
  description: string;
}

const JOURNEY_STAGES: StageConfig[] = [
  { stage: 'seed', label: 'Eco Seed', minLevel: 1, xpRequired: 0, description: 'Awareness begins.' },
  { stage: 'sprout', label: 'Growing Sprout', minLevel: 3, xpRequired: 250, description: 'Habits develop.' },
  { stage: 'explorer', label: 'Green Explorer', minLevel: 6, xpRequired: 500, description: 'Active lifestyle.' },
  { stage: 'tree', label: 'Young Tree', minLevel: 10, xpRequired: 1000, description: 'Deep rooted impact.' },
  { stage: 'guardian', label: 'Planet Guardian', minLevel: 15, xpRequired: 2000, description: 'Sustainable leadership.' }
];

interface EcoTwinJourneyTimelineProps {
  currentLevel: number;
}

export default function EcoTwinJourneyTimeline({ currentLevel }: EcoTwinJourneyTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-1">
        <span className="section-kicker text-xs uppercase tracking-widest text-brand-dark">Progression</span>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">EcoTwin Journey</h2>
        <p className="text-sm text-slate-500">
          Horizontal Evolution Roadmap: Evolve your avatar from a seed to a planet guardian.
        </p>
      </div>

      <div className="flex items-stretch gap-6 overflow-x-auto pb-6 pt-2 -mx-4 px-4 scrollbar-hide">
        {JOURNEY_STAGES.map((item, idx) => {
          const isUnlocked = currentLevel >= item.minLevel;
          const isCurrent = idx === 0 ? currentLevel < 3 : (currentLevel >= item.minLevel && (idx === JOURNEY_STAGES.length - 1 || currentLevel < JOURNEY_STAGES[idx + 1].minLevel));

          return (
            <div key={item.stage} className="flex-shrink-0 w-64 flex flex-col relative">
              {idx < JOURNEY_STAGES.length - 1 && (
                <div
                  className={`absolute top-20 left-48 right-0 h-1 z-0 hidden md:block ${currentLevel >= JOURNEY_STAGES[idx + 1].minLevel
                      ? 'bg-brand-primary'
                      : 'bg-slate-200'
                    }`}
                />
              )}

              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className={`relative z-10 flex-1 rounded-3xl p-5 border flex flex-col items-center text-center shadow-sm select-none overflow-hidden ${isCurrent
                    ? 'border-brand-primary bg-brand-light/30 shadow-md ring-2 ring-brand-primary/20'
                    : 'border-slate-200 bg-white'
                  }`}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2.5px] z-20 pointer-events-none" />
                )}

                <div className="relative w-28 h-28 rounded-full flex items-center justify-center bg-white shadow-inner mb-4 border border-slate-200">
                  <FutureSelfAvatarSVG stage={item.stage} size={88} className={isUnlocked ? '' : 'grayscale'} />

                  {isUnlocked ? (
                    <motion.div
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center shadow-md border border-white z-20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1 * idx }}
                    >
                      <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                    </motion.div>
                  ) : (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center shadow-md border border-white z-20">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <h3 className={`text-base font-extrabold ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                  {item.label}
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full ${isCurrent
                    ? 'bg-brand-primary text-white'
                    : isUnlocked
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-slate-200/50 text-slate-400'
                  }`}>
                  Level {item.minLevel}+
                </span>

                <p className={`text-xs mt-3 leading-relaxed ${isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                  {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 w-full text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {item.xpRequired} XP Required
                  </span>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
