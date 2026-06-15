import type { Category, CompleteCarbonReport } from './carbonEngine';
import type { DashboardState, MissionCategory } from './dashboardStore';
import { calculateImpact } from './dashboardStore';

/**
 * Action tiers representing the impact level of sustainability actions
 */
export type ActionTier = 'High Impact' | 'Medium Impact' | 'Quick Win';

/**
 * Represents a sustainability action with its metadata
 */
export interface EcoAction {
  tier: ActionTier;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Focused';
  estimatedImpact: string;
  scoreGain: number;
  reward: string;
  category: Category | MissionCategory;
}

/**
 * Represents a day in a weekly sustainability plan
 */
export interface WeeklyPlanDay {
  day: string;
  mission: string;
  reason: string;
  category: Category | MissionCategory;
}

/**
 * Represents a sustainability challenge with progress tracking
 */
export interface EcoChallenge {
  title: string;
  duration: string;
  progress: number;
  target: number;
  reward: string;
  xp: number;
  growth: string;
}

/**
 * Represents an insight into improvement opportunities
 */
export interface OpportunityInsight {
  category: Category;
  title: string;
  gain: number;
  co2Reduction: number;
  savings: number;
  explanation: string;
}

/**
 * Category-specific copy for sustainability recommendations
 */
const CATEGORY_COPY: Record<Category, { title: string; monthlySavings: number; action: string }> = {
  transport: {
    title: 'Transportation',
    monthlySavings: 420,
    action: 'Replace two short vehicle trips each week with walking, biking, or public transit.',
  },
  energy: {
    title: 'Energy Usage',
    monthlySavings: 500,
    action: 'Reduce AC usage by 1 hour daily and unplug idle chargers before sleep.',
  },
  food: {
    title: 'Food Habits',
    monthlySavings: 320,
    action: 'Make two meals each week plant-forward and plan leftovers before shopping.',
  },
  shopping: {
    title: 'Shopping Habits',
    monthlySavings: 650,
    action: 'Pause impulse purchases and choose repair, rental, or secondhand first.',
  },
  waste: {
    title: 'Waste & Plastic',
    monthlySavings: 180,
    action: 'Carry a bottle and bag daily, then separate recyclables at home.',
  },
  lifestyle: {
    title: 'Lifestyle Systems',
    monthlySavings: 260,
    action: 'Choose efficient appliances and join one local cleanup or offset habit monthly.',
  },
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Returns health status based on health score
 * @param health - Health score (0-100)
 * @returns Health status object with label, emoji, and tone
 */
export function getHealthStatus(health: number) {
  if (health >= 90) return { label: 'Thriving', emoji: '🌲', tone: 'text-brand-dark' };
  if (health >= 70) return { label: 'Healthy', emoji: '🌳', tone: 'text-emerald-700' };
  if (health >= 50) return { label: 'Growing', emoji: '🍀', tone: 'text-lime-700' };
  if (health >= 30) return { label: 'Weak', emoji: '🌿', tone: 'text-amber-700' };
  return { label: 'Needs Care', emoji: '🌱', tone: 'text-orange-700' };
}

/**
 * Calculates overall EcoTwin health score based on dashboard state
 * @param state - Current dashboard state
 * @returns Health score (0-100)
 */
export function calculateEcoTwinHealth(state: DashboardState): number {
  const completedToday = state.dailyMissions.filter((mission) => mission.completed).length;
  const missionRate = state.dailyMissions.length > 0 ? completedToday / state.dailyMissions.length : 0;
  const weeklyMisses = state.stats.weeklyProgress.filter((value) => value === 0).length;
  const scoreBase = state.profile.carbonScore * 0.45 + state.stats.carbonImprovement * 0.35;
  const careBonus = missionRate * 24 + Math.min(12, state.stats.currentStreak * 2);
  const missedPenalty = weeklyMisses * 3;

  return Math.max(0, Math.min(100, Math.round(scoreBase + careBonus - missedPenalty)));
}

export function calculatePotentialRecovered(currentScore: number, potentialScore: number): number {
  if (potentialScore <= currentScore) return 100;
  return Math.max(0, Math.min(100, Math.round((currentScore / potentialScore) * 100)));
}

export function getOpportunityInsight(report: CompleteCarbonReport | null, state: DashboardState): OpportunityInsight {
  const breakdown = report?.currentYou.categoryBreakdown;
  const weakestCategory = breakdown
    ? (Object.entries(breakdown).sort((a, b) => a[1] - b[1])[0][0] as Category)
    : 'energy';
  const score = breakdown?.[weakestCategory] ?? state.profile.carbonScore;
  const gain = Math.max(6, Math.round((100 - score) / 3));
  const co2Reduction = Math.max(18, Math.round(gain * 3.1));
  const copy = CATEGORY_COPY[weakestCategory];

  return {
    category: weakestCategory,
    title: copy.title,
    gain,
    co2Reduction,
    savings: copy.monthlySavings,
    explanation: copy.action,
  };
}

export function generateActionPlan(report: CompleteCarbonReport | null, state: DashboardState): EcoAction[] {
  const opportunity = getOpportunityInsight(report, state);
  const improvements = report?.futureEcoTwin.improvedHabits ?? [];
  const primary = improvements[0];
  const secondary = improvements[1];

  return [
    {
      tier: 'High Impact',
      title: primary ? primary.futureHabit : CATEGORY_COPY[opportunity.category].action,
      description: primary
        ? primary.benefit
        : `Your biggest opportunity is ${opportunity.title.toLowerCase()}. Start with the action that changes the most carbon fastest.`,
      difficulty: 'Focused',
      estimatedImpact: `${opportunity.co2Reduction}kg CO2/month`,
      scoreGain: opportunity.gain,
      reward: `+${Math.round(opportunity.gain * 12)} XP and stronger EcoTwin health`,
      category: opportunity.category,
    },
    {
      tier: 'Medium Impact',
      title: secondary ? secondary.futureHabit : 'Complete three guided missions this week',
      description: secondary
        ? secondary.benefit
        : 'Build consistency by completing missions that target your weakest area and protect your growth rate.',
      difficulty: 'Medium',
      estimatedImpact: `${Math.max(12, Math.round(opportunity.co2Reduction * 0.55))}kg CO2/month`,
      scoreGain: Math.max(4, Math.round(opportunity.gain * 0.6)),
      reward: `+${Math.max(45, Math.round(opportunity.gain * 8))} XP toward the next stage`,
      category: secondary?.category ?? opportunity.category,
    },
    {
      tier: 'Quick Win',
      title: 'Protect one daily habit before bedtime',
      description: 'Pick one repeatable action tonight: unplug idle chargers, prep a reusable bottle, or plan tomorrow without single-use plastic.',
      difficulty: 'Easy',
      estimatedImpact: `${Math.max(6, Math.round(opportunity.co2Reduction * 0.25))}kg CO2/month`,
      scoreGain: Math.max(2, Math.round(opportunity.gain * 0.35)),
      reward: '+25 XP and visible EcoTwin glow',
      category: opportunity.category,
    },
  ];
}

export function generateWeeklyPlan(report: CompleteCarbonReport | null, state: DashboardState): WeeklyPlanDay[] {
  const actions = generateActionPlan(report, state);
  const missions = state.dailyMissions;
  const opportunity = getOpportunityInsight(report, state);

  return DAYS.map((day, index) => {
    const mission = missions[index % Math.max(1, missions.length)];
    const action = actions[index % actions.length];
    return {
      day,
      mission: mission?.title ?? action.title,
      reason:
        index < 3
          ? `Targets ${CATEGORY_COPY[opportunity.category].title.toLowerCase()}, your highest-value improvement area.`
          : `Keeps momentum alive so your EcoTwin health does not slow down.`,
      category: mission?.category ?? action.category,
    };
  });
}

export function generateChallenges(state: DashboardState, opportunity: OpportunityInsight): EcoChallenge[] {
  const completed = state.stats.missionsCompleted;
  return [
    {
      title: `7-Day ${CATEGORY_COPY[opportunity.category].title} Reset`,
      duration: '7 days',
      progress: Math.min(7, Math.max(1, state.stats.currentStreak)),
      target: 7,
      reward: `${opportunity.gain} Eco Score potential`,
      xp: 180,
      growth: 'Sprout glow boost',
    },
    {
      title: '14-Day Plastic-Free Challenge',
      duration: '14 days',
      progress: Math.min(14, Math.round(completed / 2)),
      target: 14,
      reward: 'Waste badge unlock',
      xp: 320,
      growth: 'Leaf burst effect',
    },
    {
      title: '30-Day Eco Explorer Challenge',
      duration: '30 days',
      progress: Math.min(30, completed),
      target: 30,
      reward: 'Explorer badge unlock',
      xp: 750,
      growth: 'Next-stage acceleration',
    },
  ];
}

export function generateFutureLetter(report: CompleteCarbonReport | null, state: DashboardState): string {
  const opportunity = getOpportunityInsight(report, state);
  const impact = calculateImpact(state.stats.totalCO2Saved);
  const recovery = calculatePotentialRecovered(state.profile.carbonScore, state.profile.potentialScore);

  return [
    `Hi ${state.profile.name},`,
    `Six months ago, your biggest opportunity was ${CATEGORY_COPY[opportunity.category].title.toLowerCase()}. You did not need a perfect life to change it. You needed a first action, then another.`,
    `Today you have recovered ${recovery}% of your sustainability potential, completed ${state.stats.missionsCompleted} sustainability missions, and saved the equivalent of planting ${impact.treesEquivalent || 1} trees.`,
    `Here is how you got here: you focused on ${opportunity.explanation.toLowerCase()} You chose repeatable habits over guilt, and those habits started to feel like care.`,
    `Keep going. I am not a different person. I am what happens when you keep promises to the future in small, visible ways.`,
  ].join('\n\n');
}

export function getImpactStories(totalCO2Saved: number) {
  const impact = calculateImpact(totalCO2Saved);

  return [
    { label: 'Trees', value: `${impact.treesEquivalent || 1}`, story: 'mature trees absorbing carbon for a year' },
    { label: 'Laptop Power', value: `${Math.max(1, Math.round(impact.energySavedKwh * 15))}h`, story: 'of laptop use powered by saved energy' },
    { label: 'Driving Avoided', value: `${Math.round(impact.drivingKmAvoided)}km`, story: 'of average car travel avoided' },
    { label: 'Apartment Energy', value: `${Math.max(1, Math.round(impact.energySavedKwh / 9))} days`, story: 'of energy for a small apartment' },
  ];
}
