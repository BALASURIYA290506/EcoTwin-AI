import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Copy,
  Flame,
  HeartPulse,
  Leaf,
  Sparkles,
  Target,
  Trees,
} from 'lucide-react';
import type { CompleteCarbonReport } from '../../utils/carbonEngine';
import type { DashboardState } from '../../utils/dashboardStore';
import {
  calculateEcoTwinHealth,
  calculatePotentialRecovered,
  generateActionPlan,
  generateChallenges,
  generateFutureLetter,
  generateWeeklyPlan,
  getHealthStatus,
  getImpactStories,
  getOpportunityInsight,
} from '../../utils/actionEngine';

interface ActionEnginePanelProps {
  report: CompleteCarbonReport | null;
  state: DashboardState;
}

const TIER_STYLES = {
  'High Impact': 'border-brand-primary/30 bg-brand-light/45 text-brand-dark',
  'Medium Impact': 'border-sky-200 bg-sky-50 text-sky-800',
  'Quick Win': 'border-amber-200 bg-amber-50 text-amber-800',
};

export default function ActionEnginePanel({ report, state }: ActionEnginePanelProps) {
  const [copied, setCopied] = useState(false);
  const health = calculateEcoTwinHealth(state);
  const healthStatus = getHealthStatus(health);
  const recovery = calculatePotentialRecovered(state.profile.carbonScore, state.profile.potentialScore);
  const opportunity = getOpportunityInsight(report, state);
  const actions = generateActionPlan(report, state);
  const weekPlan = generateWeeklyPlan(report, state);
  const challenges = generateChallenges(state, opportunity);
  const letter = generateFutureLetter(report, state);
  const impactStories = getImpactStories(state.stats.totalCO2Saved);

  const handleCopyLetter = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.18 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2">
        <span className="section-kicker">Action Engine</span>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="panel-title">Your next best actions</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              EcoTwin turns your footprint into a guided plan: what to do next, why it matters, and how it helps your future self grow.
            </p>
          </div>
          <div className="rounded-full border border-brand-primary/20 bg-white/70 px-4 py-2 text-xs font-bold text-brand-dark backdrop-blur-xl">
            {healthStatus.emoji} {healthStatus.label} companion
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-elevated rounded-3xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <HeartPulse className="h-4 w-4 text-brand-primary" />
                EcoTwin health
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold ${healthStatus.tone}`}>{health}</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Mission completion nourishes your EcoTwin. Missed mission days slow growth, so consistency matters more than perfection.
              </p>
            </div>
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-full border border-brand-primary/20 bg-brand-light/60 text-4xl shadow-lg shadow-brand-primary/10"
              animate={{ scale: [1, 1.04, 1], boxShadow: ['0 0 0 rgba(34,197,94,0)', '0 0 28px rgba(34,197,94,0.22)', '0 0 0 rgba(34,197,94,0)'] }}
              transition={{ duration: 3.2, repeat: Infinity }}
            >
              {healthStatus.emoji}
            </motion.div>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-dark"
              initial={{ width: 0 }}
              animate={{ width: `${health}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="glass-elevated rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                Sustainability potential recovered
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {state.profile.carbonScore} current to {state.profile.potentialScore} potential
              </h3>
            </div>
            <span className="text-3xl font-bold text-brand-dark">{recovery}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-dark"
              initial={{ width: 0 }}
              animate={{ width: `${recovery}%` }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white/70 p-4">
            <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Biggest opportunity</div>
            <div className="text-xl font-bold text-slate-950">{opportunity.title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{opportunity.explanation}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-brand-dark">+{opportunity.gain}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-brand-dark">{opportunity.co2Reduction}kg</div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">CO2/month</div>
              </div>
              <div>
                <div className="text-lg font-bold text-brand-dark">₹{opportunity.savings}</div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Monthly</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action, index) => (
          <motion.article
            key={action.tier}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + index * 0.06 }}
            className="glass-elevated rounded-3xl p-5"
          >
            <div className={`mb-4 inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${TIER_STYLES[action.tier]}`}>
              {action.tier}
            </div>
            <h3 className="text-lg font-bold leading-snug text-slate-950">{action.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{action.description}</p>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Difficulty</span>
                <span className="font-bold text-slate-800">{action.difficulty}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Impact</span>
                <span className="font-bold text-brand-dark">{action.estimatedImpact}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Eco score</span>
                <span className="font-bold text-brand-dark">+{action.scoreGain}</span>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-brand-light/45 p-3 text-xs font-bold text-brand-dark">
              {action.reward}
            </div>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="glass-elevated rounded-3xl p-5">
          <div className="mb-5 flex items-center gap-2">
            <Target className="h-5 w-5 text-brand-primary" />
            <h3 className="text-xl font-bold text-slate-950">Week 1 guided plan</h3>
          </div>
          <div className="grid gap-2">
            {weekPlan.map((day) => (
              <div key={day.day} className="grid gap-2 rounded-2xl border border-slate-200 bg-white/70 p-4 sm:grid-cols-[6rem_1fr]">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{day.day}</div>
                <div>
                  <div className="font-bold text-slate-900">{day.mission}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-500">{day.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-elevated rounded-3xl p-5">
          <div className="mb-5 flex items-center gap-2">
            <Flame className="h-5 w-5 text-brand-primary" />
            <h3 className="text-xl font-bold text-slate-950">Active challenges</h3>
          </div>
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const progress = Math.round((challenge.progress / challenge.target) * 100);
              return (
                <div key={challenge.title} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-950">{challenge.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{challenge.duration} · {challenge.growth}</div>
                    </div>
                    <div className="text-right text-xs font-bold text-brand-dark">+{challenge.xp} XP</div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{challenge.progress}/{challenge.target} complete</span>
                    <span>{challenge.progress >= challenge.target ? 'Badge unlocked' : challenge.reward}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-elevated rounded-3xl p-5">
          <div className="mb-5 flex items-center gap-2">
            <Trees className="h-5 w-5 text-brand-primary" />
            <h3 className="text-xl font-bold text-slate-950">Equivalent to</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {impactStories.map((impact) => (
              <div key={impact.label} className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                <div className="text-2xl font-bold text-brand-dark">{impact.value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{impact.label}</div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{impact.story}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-elevated rounded-3xl p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                <Leaf className="h-4 w-4 text-brand-primary" />
                Letter from your future EcoTwin
              </div>
              <h3 className="text-xl font-bold text-slate-950">A shareable note from the version of you that kept going.</h3>
            </div>
            <button
              onClick={handleCopyLetter}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-primary/20 bg-white/70 px-3 py-2 text-xs font-bold text-brand-dark transition hover:bg-brand-light/70"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>
          <div className="whitespace-pre-line rounded-2xl border border-slate-200 bg-white/75 p-5 text-sm leading-7 text-slate-600">
            {letter}
          </div>
        </div>
      </div>

      <div className="glass-elevated rounded-3xl p-5">
        <div className="mb-5 flex items-center gap-2">
          <Award className="h-5 w-5 text-brand-primary" />
          <h3 className="text-xl font-bold text-slate-950">Evolution path</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {[
            ['Eco Seed', '🌱', 'Start with awareness'],
            ['Growing Sprout', '🌿', 'Complete guided actions'],
            ['Green Explorer', '🍀', 'Build weekly consistency'],
            ['Young Tree', '🌳', 'Unlock deeper impact'],
            ['Planet Guardian', '🌲', 'Lead with lasting habits'],
          ].map(([stage, emoji, copy], index) => {
            const active = state.profile.level >= [1, 3, 6, 10, 15][index];
            return (
              <div key={stage} className={`rounded-2xl border p-4 ${active ? 'border-brand-primary/25 bg-brand-light/45' : 'border-slate-200/70 bg-white/60'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{emoji}</span>
                  {index < 4 && <ArrowRight className="h-4 w-4 text-slate-300" />}
                </div>
                <div className="mt-4 text-sm font-bold text-slate-950">{stage}</div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{copy}</p>
              </div>
            );
          })}
        </div>
      </div>

    </motion.section>
  );
}
