import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Mail, Award, RotateCcw } from 'lucide-react';
import type { CompleteCarbonReport } from '../../utils/carbonEngine';
import FutureSelfAvatarSVG from './FutureSelfAvatarSVG';

interface FutureSelfModalProps {
  isOpen: boolean;
  report: CompleteCarbonReport;
  onClose: () => void;
  onRetake: () => void;
}

export default function FutureSelfModal({ isOpen, report, onClose, onRetake }: FutureSelfModalProps) {
  const { currentYou, futureEcoTwin } = report;
  const [tickerScore, setTickerScore] = useState(0);
  const [co2SavedTicker, setCo2SavedTicker] = useState(0);
  const [treesTicker, setTreesTicker] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const scoreStart = currentYou.overallScore;
    const scoreEnd = futureEcoTwin.potentialScore;
    const co2Target = futureEcoTwin.co2Saved;
    const treesTarget = futureEcoTwin.treeEquivalents;

    let scoreVal = scoreStart;
    let co2Val = 0;
    let treesVal = 0;

    const interval = setInterval(() => {
      let done = true;
      if (scoreVal < scoreEnd) {
        scoreVal = Math.min(scoreEnd, scoreVal + 1);
        setTickerScore(scoreVal);
        done = false;
      }
      if (co2Val < co2Target) {
        co2Val = Math.min(co2Target, co2Val + Math.ceil(co2Target / 15));
        setCo2SavedTicker(co2Val);
        done = false;
      }
      if (treesVal < treesTarget) {
        treesVal = Math.min(treesTarget, treesVal + Math.ceil(treesTarget / 15));
        setTreesTicker(treesVal);
        done = false;
      }
      if (done) clearInterval(interval);
    }, 45);

    return () => clearInterval(interval);
  }, [isOpen, currentYou.overallScore, futureEcoTwin.potentialScore, futureEcoTwin.co2Saved, futureEcoTwin.treeEquivalents]);

  const futureLetter = [
    'You are not behind. You are becoming.',
    `Your current score is ${currentYou.overallScore}, but the better signal is that your future self already sees the path.`,
    `Every habit you shift is changing the weather inside your life: ${futureEcoTwin.treeEquivalents} trees saved, ${futureEcoTwin.co2Saved} kg of carbon avoided, and ${futureEcoTwin.gasolineSavedGallons} gallons of gasoline left in the ground.`,
    'Keep going. I am the version of you that did not stop at intention.',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-4xl glass rounded-3xl overflow-hidden shadow-2xl z-10 my-8"
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-brand-primary/20 filter blur-[90px] -z-10 pointer-events-none" />

            <div className="p-6 md:p-10 max-h-[85vh] overflow-y-auto scrollbar-hide">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-dark">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                  Twin Evolution Stage Unlocked
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight mt-4">
                  Meet Your Future EcoTwin
                </h1>
                <p className="text-slate-500 text-sm md:text-base mt-2">
                  What you do today shapes who you become. The calculation model maps your sustainable transformation into a living twin.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
                <div className="flex flex-col items-center justify-center bg-white border border-slate-200 p-8 rounded-3xl text-center shadow-sm relative overflow-hidden">
                  <div className="absolute -top-12 -left-12 w-36 h-36 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="relative w-44 h-44 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-brand-light/35 border-2 border-slate-200 shadow-lg glow-soft">
                    <FutureSelfAvatarSVG stage="sprout" size={120} className="relative z-10" />

                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-brand-primary/20 -z-10 bg-brand-primary/5"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mt-5">
                    Stage Evolved: Sprout
                  </h3>
                  <span className="text-xs font-bold text-brand-dark bg-brand-light border border-brand-primary/20 px-3.5 py-1.5 rounded-full mt-2 inline-block">
                    🌿 Growing Sprout (Level 3 Required)
                  </span>

                  <p className="text-xs text-slate-500 mt-4 leading-relaxed max-w-xs">
                    "You are developing sustainable habits. Keep growing and avoiding plastic daily to maintain high scores."
                  </p>

                  <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-slate-200">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Carbon Avoided</span>
                      <span className="text-lg font-black text-brand-dark mt-0.5 block">{co2SavedTicker} kg/yr</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trees Saved</span>
                      <span className="text-lg font-black text-brand-dark mt-0.5 block">{treesTicker} trees</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="glass rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score Projection</span>
                      <span className="text-xs font-bold text-brand-dark bg-brand-light px-2 py-0.5 rounded-md">+{futureEcoTwin.potentialScore - currentYou.overallScore} Potential</span>
                    </div>
                    <div className="flex items-center justify-around gap-4 mb-4">
                      <div className="text-center">
                        <span className="text-4xl font-extrabold text-slate-400">{currentYou.overallScore}</span>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase mt-0.5">Current Score</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 animate-pulse" />
                      <div className="text-center">
                        <span className="text-4xl font-black text-brand-dark">{tickerScore}</span>
                        <span className="block text-[10px] font-bold text-brand-dark uppercase mt-0.5">Potential Score</span>
                      </div>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-dark relative"
                        initial={{ width: `${currentYou.overallScore}%` }}
                        animate={{ width: `${tickerScore}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <div className="glass rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-brand-primary" />
                      Top Recommended Actions
                    </h3>
                    <div className="space-y-3">
                      {futureEcoTwin.improvedHabits.map((habit, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-xs">
                          <div className="text-sm font-black text-brand-dark bg-brand-light px-2 py-0.5 rounded-lg shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {habit.futureHabit}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                              {habit.benefit}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-3xl p-6 shadow-sm mb-8">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  <Mail className="h-4 w-4 text-brand-primary" />
                  Letter from your future EcoTwin
                </div>
                <div className="space-y-3.5 text-sm leading-7 text-slate-600">
                  {futureLetter.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={onRetake}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-2xl text-sm font-bold text-slate-600 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake Assessment
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl text-sm font-bold transition-all shadow-md shadow-brand-primary/20 active:scale-98 cursor-pointer"
                >
                  Go To Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
