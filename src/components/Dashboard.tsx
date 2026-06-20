import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Leaf, RotateCcw, Target } from 'lucide-react';
import type { CompleteCarbonReport } from '../utils/carbonEngine';
import {
  loadDashboardState,
  saveDashboardState,
  awardXP,
  getAvatarStageForLevel,
} from '../utils/dashboardStore';
import {
  generateCarbonRoadmap,
  generateWeeklyEcoGoals,
  projectAnnualImpact,
  getBehaviorChangeRecommendations,
} from '../utils/behaviorChange';
import type { DashboardState, AvatarStageConfig } from '../utils/dashboardStore';
import HeroProfile from './dashboard/ui/HeroProfile';
import DailyMissions from './dashboard/DailyMissions';
import EcoInsightCard from './dashboard/EcoInsightCard';
import LevelUpModal from './dashboard/LevelUpModal';
import ProgressTracker from './dashboard/ProgressTracker';
import FutureEarthSimulator from './dashboard/FutureEarthSimulator';
import AchievementPreview from './dashboard/AchievementPreview';
import EcoTwinJourneyTimeline from './dashboard/EcoTwinJourneyTimeline';
import FutureSelfModal from './dashboard/FutureSelfModal';
import EcoCoachWidget from './chat/EcoCoachWidget';
import BehaviorChangeInsights from './dashboard/BehaviorChangeInsights';

interface DashboardProps {
  report: CompleteCarbonReport | null;
  onReset: () => void;
  isNewAssessment?: boolean;
  onClearNewAssessment?: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Dashboard({
  report,
  onReset,
  isNewAssessment = false,
  onClearNewAssessment,
}: DashboardProps) {
  const [state, setState] = useState<DashboardState>(() =>
    loadDashboardState(report?.currentYou.overallScore, report?.futureEcoTwin.potentialScore)
  );

  // Level-up modal state
  const [levelUpModal, setLevelUpModal] = useState<{
    isOpen: boolean;
    previousStage: AvatarStageConfig;
    newStage: AvatarStageConfig;
    newLevel: number;
    xpEarned: number;
  } | null>(null);

  // Milestone celebration state
  const [milestoneModal, setMilestoneModal] = useState<{
    isOpen: boolean;
    milestoneLevel: number;
    co2Reduction: number;
  } | null>(null);

  const handleCompleteMission = useCallback((missionId: string) => {
    setState(prev => {
      const mission = prev.dailyMissions.find(m => m.id === missionId);
      if (!mission || mission.completed) return prev;

      // Award XP
      const result = awardXP(prev.profile.xp, prev.profile.level, mission.xpReward);

      const newState: DashboardState = {
        ...prev,
        profile: {
          ...prev.profile,
          xp: result.newXP,
          level: result.newLevel,
          avatarStage: result.newStage.stage,
        },
        stats: {
          ...prev.stats,
          missionsCompleted: prev.stats.missionsCompleted + 1,
          totalXP: prev.stats.totalXP + mission.xpReward,
          totalCO2Saved: prev.stats.totalCO2Saved + Math.round(mission.xpReward * 0.15), // Simulated CO2 correlation
          weeklyProgress: prev.stats.weeklyProgress.map((v, i) =>
            i === prev.stats.weeklyProgress.length - 1 ? v + 1 : v
          ),
          carbonImprovement: Math.min(100, prev.stats.carbonImprovement + 1),
        },
        dailyMissions: prev.dailyMissions.map(m =>
          m.id === missionId ? { ...m, completed: true } : m
        ),
        achievements: prev.achievements.map(a => {
          if (a.id === 'a2') return { ...a, progress: Math.min(a.target, prev.stats.currentStreak + 1) };
          if (a.id === 'a4' && mission.category === 'waste') return { ...a, progress: Math.min(a.target, a.progress + 1) };
          if (a.id === 'a6') return { ...a, progress: Math.min(a.target, a.progress + Math.round(mission.xpReward * 0.15)) };
          if (a.id === 'a7' && mission.category === 'water') return { ...a, progress: Math.min(a.target, a.progress + 1) };
          return a;
        }),
      };

      // Persist
      saveDashboardState(newState);

      // Trigger level-up modal if leveled up
      if (result.leveledUp) {
        setTimeout(() => {
          setLevelUpModal({
            isOpen: true,
            previousStage: result.previousStage,
            newStage: result.newStage,
            newLevel: result.newLevel,
            xpEarned: mission.xpReward,
          });
        }, 600);
      }

      return newState;
    });
  }, []);

  const handleWeeklyGoalComplete = useCallback((_goalId: string, xpReward: number) => {
    setState(prev => {
      const result = awardXP(prev.profile.xp, prev.profile.level, xpReward);
      const newWeeklyGoalsCompleted = prev.stats.weeklyGoalsCompleted + 1;

      const newState: DashboardState = {
        ...prev,
        profile: {
          ...prev.profile,
          xp: result.newXP,
          level: result.newLevel,
          avatarStage: result.newStage.stage,
        },
        stats: {
          ...prev.stats,
          weeklyGoalsCompleted: newWeeklyGoalsCompleted,
          totalXP: prev.stats.totalXP + xpReward,
          totalCO2Saved: prev.stats.totalCO2Saved + Math.round(xpReward),
        },
      };

      // Check for milestone (every 3 goals completed)
      if (newWeeklyGoalsCompleted % 3 === 0) {
        const roadmap = generateCarbonRoadmap(
          prev.profile.carbonScore,
          prev.profile.potentialScore,
          prev.profile.level
        );
        const milestone = roadmap.find(m => m.level === prev.profile.level);
        if (milestone) {
          setMilestoneModal({
            isOpen: true,
            milestoneLevel: milestone.level,
            co2Reduction: milestone.estimatedCO2ReductionKg,
          });
        }
      }

      saveDashboardState(newState);
      return newState;
    });
  }, []);

  const currentStage = getAvatarStageForLevel(state.profile.level);

  // Prepare behavior change context for AI
  const roadmap = generateCarbonRoadmap(
    state.profile.carbonScore,
    state.profile.potentialScore,
    state.profile.level
  );
  const weeklyGoals = generateWeeklyEcoGoals(report, state);
  const annualProjection = projectAnnualImpact(
    state.profile.carbonScore,
    state.profile.potentialScore,
    state.stats.missionsCompleted
  );
  const recommendations = getBehaviorChangeRecommendations(report, state);

  const behaviorChangeContext = {
    currentMilestone: roadmap[0] ? `Level ${roadmap[0].level} - ${roadmap[0].timeframe}` : 'Not started',
    weeklyGoals: weeklyGoals.map(g => g.title),
    annualProjection: `${annualProjection.annualReductionKg} kg CO₂/year`,
    recommendations: recommendations,
  };

  return (
    <div className="relative min-h-screen bg-brand-bg transition-colors duration-300">

      {/* Immersive Future Self Full Screen Modal */}
      {report && (
        <FutureSelfModal
          isOpen={isNewAssessment}
          report={report}
          onClose={() => onClearNewAssessment?.()}
          onRetake={onReset}
        />
      )}

      {/* Level Up Modal */}
      {levelUpModal && (
        <LevelUpModal
          isOpen={levelUpModal.isOpen}
          previousStage={levelUpModal.previousStage}
          newStage={levelUpModal.newStage}
          newLevel={levelUpModal.newLevel}
          xpEarned={levelUpModal.xpEarned}
          onClose={() => setLevelUpModal(null)}
        />
      )}

      {/* Milestone Celebration Modal */}
      {milestoneModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setMilestoneModal(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Milestone Reached!</h3>
              <p className="text-slate-600 mb-4">You've completed 3 weekly eco goals at Level {milestoneModal.milestoneLevel}</p>
              <div className="bg-brand-primary/5 rounded-xl p-4 mb-4">
                <p className="text-3xl font-bold text-brand-primary mb-1">-{milestoneModal.co2Reduction} kg</p>
                <p className="text-sm text-slate-600">Estimated CO₂ Reduction</p>
              </div>
              <button
                onClick={() => setMilestoneModal(null)}
                className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-dark transition-colors"
              >
                Continue Journey
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 -right-40 w-96 h-96 rounded-full bg-brand-primary/6 filter blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 rounded-full bg-brand-accent/4 filter blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-brand-primary/5 filter blur-3xl opacity-60" />
      </div>

      {/* EcoCoach Widget */}
      <EcoCoachWidget
        score={state.profile.carbonScore}
        level={state.profile.level}
        stage={state.profile.avatarStage}
        behaviorChangeContext={behaviorChangeContext}
      />

      {/* Dashboard Container */}
      <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-7 md:py-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-9">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-11 h-11 rounded-xl bg-linear-to-br from-brand-primary to-brand-dark flex items-center justify-center glow-soft"
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              aria-hidden="true"
            >
              <Leaf className="text-white w-6 h-6" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-dark">
              Eco<span className="text-brand-primary">Twin</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-3">

            <motion.button
              onClick={onReset}
              aria-label="Start over - retake assessment"
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white/80 backdrop-blur-md rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-all duration-300 cursor-pointer hover-lift shadow-sm"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Start Over
            </motion.button>
          </div>
        </header>

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-9"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3 tracking-tight">
            {getGreeting()}, <span className="text-brand-primary">{state.profile.name}</span> 🌱
          </h2>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-4 py-2 bg-linear-to-r from-brand-light to-brand-primary/10 text-brand-dark rounded-full text-xs font-bold border border-brand-primary/20 backdrop-blur-sm">
              Level {state.profile.level}
            </span>
            <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-xs font-bold backdrop-blur-sm">
              {state.profile.xp} XP
            </span>
            <span className="px-4 py-2 bg-white/60 backdrop-blur-md border border-brand-primary/25 text-brand-dark rounded-full text-xs font-bold">
              {currentStage.label}
            </span>
          </div>
        </motion.div>

        {/* Dashboard Sections in Specified Ordering */}
        <div className="flex flex-col gap-10">

          {/* Section 1: Carbon Awareness Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <EcoInsightCard />
          </motion.div>

          {/* Section 2: Profile Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="space-y-4"
          >
            <HeroProfile
              level={state.profile.level}
              xp={state.profile.xp}
              carbonScore={state.profile.carbonScore}
              potentialScore={state.profile.potentialScore}
            />
          </motion.div>

          {/* Section 3: Daily Missions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
          >
            <DailyMissions
              missions={state.dailyMissions}
              onCompleteMission={handleCompleteMission}
            />
          </motion.div>

          {/* Section 3.5: Behavior Change Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.27 }}
          >
            <BehaviorChangeInsights report={report} state={state} onWeeklyGoalComplete={handleWeeklyGoalComplete} />
          </motion.div>

          {/* Section 4: Carbon Analytics / Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.33 }}
          >
            <ProgressTracker stats={state.stats} />
          </motion.div>

          {/* Section 5: Impact Statistics / Future Earth Simulator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.39 }}
          >
            <FutureEarthSimulator totalCO2Saved={state.stats.totalCO2Saved} />
          </motion.div>

          {/* Section 6: Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <AchievementPreview achievements={state.achievements} />
          </motion.div>

          {/* Section 7: EcoTwin Journey */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.51 }}
          >
            <EcoTwinJourneyTimeline currentLevel={state.profile.level} />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="border-t border-slate-100/60 pt-8 mt-14 flex justify-center text-xs text-slate-400/80 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          <div>EcoTwin · Phase 3 · Carbon Footprint Intelligence</div>
        </motion.footer>
      </div>
    </div>
  );
}