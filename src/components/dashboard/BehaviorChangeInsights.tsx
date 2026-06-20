import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Lightbulb, Check } from 'lucide-react';
import {
  generateCarbonRoadmap,
  generateWeeklyEcoGoals,
  projectAnnualImpact,
  getBehaviorChangeRecommendations,
} from '../../utils/behaviorChange';
import type { CompleteCarbonReport } from '../../utils/carbonEngine';
import type { DashboardState } from '../../utils/dashboardStore';

interface BehaviorChangeInsightsProps {
  report: CompleteCarbonReport | null;
  state: DashboardState;
  onWeeklyGoalComplete?: (goalId: string, xpReward: number) => void;
}

export default function BehaviorChangeInsights({ report, state, onWeeklyGoalComplete }: BehaviorChangeInsightsProps) {
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

  const completedGoals = state.stats.weeklyGoalsCompleted;
  const progressPercentage = Math.round((completedGoals / weeklyGoals.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-5"
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-brand-primary to-brand-dark flex items-center justify-center glow-soft">
          <Target className="text-white w-4 h-4" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Your Sustainability Roadmap</h3>
      </div>

      {/* Carbon Reduction Roadmap */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-primary" />
          <h4 className="font-bold text-slate-700">Carbon Reduction Milestones</h4>
        </div>
        <div className="space-y-3">
          {roadmap.slice(0, 3).map((milestone, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100"
            >
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-primary font-bold text-sm">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-700 text-sm">Level {milestone.level}</span>
                  <span className="text-xs text-slate-500">• {milestone.timeframe}</span>
                </div>
                <p className="text-xs text-slate-600 mb-1">Target Score: {milestone.targetScore}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-brand-primary font-medium">
                    -{milestone.estimatedCO2ReductionKg} kg CO₂
                  </span>
                  <span className="text-slate-500">
                    ${milestone.estimatedAnnualSavingsUSD} savings
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Eco Goals */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-primary" />
            <h4 className="font-bold text-slate-700">This Week's Eco Goals</h4>
          </div>
          <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            {completedGoals}/{weeklyGoals.length} completed
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <div
            className="bg-brand-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="space-y-2">
          {weeklyGoals.map((goal, index) => (
            <div
              key={goal.id}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                index < completedGoals
                  ? 'bg-brand-primary/5 border-brand-primary/30'
                  : 'bg-slate-50/80 border-slate-100 hover:bg-slate-100 cursor-pointer'
              }`}
              onClick={() => {
                if (index >= completedGoals && onWeeklyGoalComplete) {
                  onWeeklyGoalComplete(goal.id, goal.impactKgCO2);
                }
              }}
              role={index >= completedGoals ? 'button' : 'presentation'}
              aria-label={index >= completedGoals ? `Complete goal: ${goal.title}` : undefined}
              tabIndex={index >= completedGoals ? 0 : -1}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                index < completedGoals
                  ? 'bg-brand-primary'
                  : 'bg-brand-accent/20'
              }`}>
                {index < completedGoals ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-brand-accent" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${index < completedGoals ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                  {goal.title}
                </p>
                <p className="text-xs text-slate-500">
                  Target: {goal.targetValue} {goal.unit} • -{goal.impactKgCO2} kg CO₂
                </p>
              </div>
              {index >= completedGoals && (
                <span className="text-xs font-medium text-brand-primary">
                  +{goal.impactKgCO2} XP
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Annual Impact Projection */}
      <div className="bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 backdrop-blur-md rounded-2xl p-5 border border-brand-primary/20 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-primary" />
          <h4 className="font-bold text-slate-700">Annual Impact Projection</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/60 rounded-xl">
            <p className="text-2xl font-bold text-brand-primary">
              {annualProjection.annualReductionKg.toLocaleString()}
            </p>
            <p className="text-xs text-slate-600 mt-1">kg CO₂/year</p>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-xl">
            <p className="text-2xl font-bold text-brand-primary">
              ${annualProjection.annualSavingsUSD}
            </p>
            <p className="text-xs text-slate-600 mt-1">savings/year</p>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-xl">
            <p className="text-2xl font-bold text-brand-primary">
              {annualProjection.treesEquivalent}
            </p>
            <p className="text-xs text-slate-600 mt-1">trees equiv.</p>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-xl">
            <p className="text-2xl font-bold text-brand-primary">
              {annualProjection.carKmEquivalent.toLocaleString()}
            </p>
            <p className="text-xs text-slate-600 mt-1">km avoided</p>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-medium">
            Confidence: {annualProjection.confidenceLevel}
          </span>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-brand-primary" />
          <h4 className="font-bold text-slate-700">Personalized Recommendations</h4>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100"
            >
              <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb className="w-3 h-3 text-brand-primary" />
              </div>
              <p className="text-sm text-slate-700">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
