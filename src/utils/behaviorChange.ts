/**
 * Behavior Change Engine
 * 
 * This module provides utilities for tracking and projecting user behavior changes
 * to actively drive carbon reduction rather than just displaying information.
 */

import type { Category, CompleteCarbonReport } from './carbonEngine';
import type { DashboardState } from './dashboardStore';

/**
 * Represents a milestone in the user's carbon reduction journey
 */
export interface CarbonMilestone {
  level: number;
  targetScore: number;
  estimatedCO2ReductionKg: number;
  estimatedAnnualSavingsUSD: number;
  keyActions: string[];
  timeframe: string;
}

/**
 * Represents a weekly eco-goal with tracking
 */
export interface WeeklyEcoGoal {
  id: string;
  title: string;
  category: Category;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  completed: boolean;
  impactKgCO2: number;
}

/**
 * Represents projected annual impact based on current habits
 */
export interface AnnualImpactProjection {
  currentAnnualCO2Kg: number;
  potentialAnnualCO2Kg: number;
  annualReductionKg: number;
  annualSavingsUSD: number;
  treesEquivalent: number;
  carKmEquivalent: number;
  homesPoweredDays: number;
  confidenceLevel: 'high' | 'medium' | 'low';
}

/**
 * Constants for behavior change calculations
 */
const AVG_US_HOUSEHOLD_CO2_KG_YEAR = 16000;
const CO2_PRICE_PER_KG_USD = 0.05; // Social cost of carbon approximation
const CAR_CO2_PER_KM = 0.21;
const HOME_AVG_KWH_PER_YEAR = 11000;
const GRID_CO2_PER_KWH = 0.42;

/**
 * Generates a carbon reduction roadmap based on current and potential scores
 * @param currentScore - Current sustainability score (0-100)
 * @param potentialScore - Potential sustainability score (0-100)
 * @param currentLevel - User's current level
 * @returns Array of milestones showing the path to improvement
 */
export function generateCarbonRoadmap(
  currentScore: number,
  potentialScore: number,
  currentLevel: number
): CarbonMilestone[] {
  const validatedCurrent = Math.max(0, Math.min(100, Number(currentScore) || 0));
  const validatedPotential = Math.max(0, Math.min(100, Number(potentialScore) || 0));
  const validatedLevel = Math.max(1, Math.floor(Number(currentLevel) || 1));

  if (validatedPotential <= validatedCurrent) {
    return [{
      level: validatedLevel,
      targetScore: validatedCurrent,
      estimatedCO2ReductionKg: 0,
      estimatedAnnualSavingsUSD: 0,
      keyActions: ['Maintain current sustainable habits'],
      timeframe: 'Already achieved',
    }];
  }

  const scoreGap = validatedPotential - validatedCurrent;
  const milestones: CarbonMilestone[] = [];
  const milestoneCount = 5;
  const scoreIncrement = scoreGap / milestoneCount;

  for (let i = 1; i <= milestoneCount; i++) {
    const targetScore = Math.round(validatedCurrent + (scoreIncrement * i));
    const scoreImprovement = targetScore - validatedCurrent;
    const co2Reduction = Math.round((scoreImprovement / 100) * AVG_US_HOUSEHOLD_CO2_KG_YEAR * 0.3);
    const annualSavings = Math.round(co2Reduction * CO2_PRICE_PER_KG_USD);
    const level = validatedLevel + i;

    milestones.push({
      level,
      targetScore,
      estimatedCO2ReductionKg: co2Reduction,
      estimatedAnnualSavingsUSD: annualSavings,
      keyActions: getKeyActionsForMilestone(i),
      timeframe: getTimeframeForMilestone(i),
    });
  }

  return milestones;
}

/**
 * Gets key actions for a specific milestone
 */
function getKeyActionsForMilestone(milestoneIndex: number): string[] {
  const actionSets = [
    ['Start with one high-impact change', 'Track daily habits', 'Set weekly goals'],
    ['Add a second sustainability habit', 'Join a community challenge', 'Share progress'],
    ['Optimize existing habits', 'Influence family/friends', 'Try new eco-actions'],
    ['Systematize sustainable routines', 'Mentor others', 'Explore advanced strategies'],
    ['Become a sustainability leader', 'Advocate for change', 'Inspire community action'],
  ];
  return actionSets[milestoneIndex - 1] || actionSets[0];
}

/**
 * Gets timeframe for a specific milestone
 */
function getTimeframeForMilestone(milestoneIndex: number): string {
  const timeframes = ['1-2 weeks', '1 month', '2-3 months', '6 months', '1 year'];
  return timeframes[milestoneIndex - 1] || '1 year';
}

/**
 * Generates weekly eco-goals based on user's weakest category
 * @param report - Complete carbon report
 * @param state - Current dashboard state
 * @returns Array of weekly eco-goals
 */
export function generateWeeklyEcoGoals(
  report: CompleteCarbonReport | null,
  state: DashboardState
): WeeklyEcoGoal[] {
  if (!report || !state.profile) {
    return getDefaultWeeklyGoals();
  }

  const breakdown = report.currentYou.categoryBreakdown;
  const weakestCategory = Object.entries(breakdown)
    .sort((a, b) => a[1] - b[1])[0][0] as Category;

  const goals = getCategorySpecificGoals(weakestCategory);
  return goals.slice(0, 3); // Return top 3 goals for the week
}

/**
 * Gets default weekly goals when data is unavailable
 */
function getDefaultWeeklyGoals(): WeeklyEcoGoal[] {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  return [
    {
      id: 'wg-1',
      title: 'Complete 3 daily eco-missions',
      category: 'lifestyle',
      targetValue: 3,
      currentValue: 0,
      unit: 'missions',
      deadline: nextWeek.toISOString().split('T')[0],
      completed: false,
      impactKgCO2: 15,
    },
    {
      id: 'wg-2',
      title: 'Reduce energy use by 10%',
      category: 'energy',
      targetValue: 10,
      currentValue: 0,
      unit: '%',
      deadline: nextWeek.toISOString().split('T')[0],
      completed: false,
      impactKgCO2: 25,
    },
    {
      id: 'wg-3',
      title: 'Avoid single-use plastic',
      category: 'waste',
      targetValue: 7,
      currentValue: 0,
      unit: 'days',
      deadline: nextWeek.toISOString().split('T')[0],
      completed: false,
      impactKgCO2: 10,
    },
  ];
}

/**
 * Gets category-specific weekly goals
 */
function getCategorySpecificGoals(category: Category): WeeklyEcoGoal[] {
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const deadline = nextWeek.toISOString().split('T')[0];

  const goalSets: Record<Category, WeeklyEcoGoal[]> = {
    transport: [
      {
        id: 'wg-t1',
        title: 'Replace 2 car trips with walking/biking',
        category: 'transport',
        targetValue: 2,
        currentValue: 0,
        unit: 'trips',
        deadline,
        completed: false,
        impactKgCO2: 8,
      },
      {
        id: 'wg-t2',
        title: 'Use public transit 3 times',
        category: 'transport',
        targetValue: 3,
        currentValue: 0,
        unit: 'trips',
        deadline,
        completed: false,
        impactKgCO2: 12,
      },
      {
        id: 'wg-t3',
        title: 'Carpool 2 times',
        category: 'transport',
        targetValue: 2,
        currentValue: 0,
        unit: 'trips',
        deadline,
        completed: false,
        impactKgCO2: 6,
      },
    ],
    energy: [
      {
        id: 'wg-e1',
        title: 'Reduce AC usage by 1 hour daily',
        category: 'energy',
        targetValue: 7,
        currentValue: 0,
        unit: 'hours',
        deadline,
        completed: false,
        impactKgCO2: 15,
      },
      {
        id: 'wg-e2',
        title: 'Unplug idle devices daily',
        category: 'energy',
        targetValue: 7,
        currentValue: 0,
        unit: 'days',
        deadline,
        completed: false,
        impactKgCO2: 8,
      },
      {
        id: 'wg-e3',
        title: 'Switch to LED bulbs',
        category: 'energy',
        targetValue: 3,
        currentValue: 0,
        unit: 'bulbs',
        deadline,
        completed: false,
        impactKgCO2: 20,
      },
    ],
    food: [
      {
        id: 'wg-f1',
        title: 'Eat 3 plant-based meals',
        category: 'food',
        targetValue: 3,
        currentValue: 0,
        unit: 'meals',
        deadline,
        completed: false,
        impactKgCO2: 12,
      },
      {
        id: 'wg-f2',
        title: 'Reduce food waste',
        category: 'food',
        targetValue: 7,
        currentValue: 0,
        unit: 'days',
        deadline,
        completed: false,
        impactKgCO2: 10,
      },
      {
        id: 'wg-f3',
        title: 'Buy local produce once',
        category: 'food',
        targetValue: 1,
        currentValue: 0,
        unit: 'time',
        deadline,
        completed: false,
        impactKgCO2: 5,
      },
    ],
    shopping: [
      {
        id: 'wg-s1',
        title: 'Skip one shopping trip',
        category: 'shopping',
        targetValue: 1,
        currentValue: 0,
        unit: 'trip',
        deadline,
        completed: false,
        impactKgCO2: 15,
      },
      {
        id: 'wg-s2',
        title: 'Buy secondhand item',
        category: 'shopping',
        targetValue: 1,
        currentValue: 0,
        unit: 'item',
        deadline,
        completed: false,
        impactKgCO2: 20,
      },
      {
        id: 'wg-s3',
        title: 'Repair instead of replace',
        category: 'shopping',
        targetValue: 1,
        currentValue: 0,
        unit: 'item',
        deadline,
        completed: false,
        impactKgCO2: 10,
      },
    ],
    waste: [
      {
        id: 'wg-w1',
        title: 'Use reusable bottle daily',
        category: 'waste',
        targetValue: 7,
        currentValue: 0,
        unit: 'days',
        deadline,
        completed: false,
        impactKgCO2: 8,
      },
      {
        id: 'wg-w2',
        title: 'Bring reusable bags shopping',
        category: 'waste',
        targetValue: 3,
        currentValue: 0,
        unit: 'trips',
        deadline,
        completed: false,
        impactKgCO2: 6,
      },
      {
        id: 'wg-w3',
        title: 'Compost food scraps',
        category: 'waste',
        targetValue: 7,
        currentValue: 0,
        unit: 'days',
        deadline,
        completed: false,
        impactKgCO2: 12,
      },
    ],
    lifestyle: [
      {
        id: 'wg-l1',
        title: 'Complete daily missions',
        category: 'lifestyle',
        targetValue: 21,
        currentValue: 0,
        unit: 'missions',
        deadline,
        completed: false,
        impactKgCO2: 25,
      },
      {
        id: 'wg-l2',
        title: 'Share progress with friend',
        category: 'lifestyle',
        targetValue: 1,
        currentValue: 0,
        unit: 'share',
        deadline,
        completed: false,
        impactKgCO2: 5,
      },
      {
        id: 'wg-l3',
        title: 'Learn one new eco-tip',
        category: 'lifestyle',
        targetValue: 1,
        currentValue: 0,
        unit: 'tip',
        deadline,
        completed: false,
        impactKgCO2: 3,
      },
    ],
  };

  return goalSets[category] || getDefaultWeeklyGoals();
}

/**
 * Projects annual impact based on current habits and potential improvements
 * @param currentScore - Current sustainability score (0-100)
 * @param potentialScore - Potential sustainability score (0-100)
 * @param missionsCompleted - Number of missions completed
 * @returns Annual impact projection
 */
export function projectAnnualImpact(
  currentScore: number,
  potentialScore: number,
  missionsCompleted: number
): AnnualImpactProjection {
  const validatedCurrent = Math.max(0, Math.min(100, Number(currentScore) || 0));
  const validatedPotential = Math.max(0, Math.min(100, Number(potentialScore) || 0));
  const validatedMissions = Math.max(0, Math.floor(Number(missionsCompleted) || 0));

  // Calculate current annual CO2 based on score (inverse relationship)
  const currentAnnualCO2 = Math.round(AVG_US_HOUSEHOLD_CO2_KG_YEAR * (1 - validatedCurrent / 100));
  
  // Calculate potential annual CO2 if user reaches potential score
  const potentialAnnualCO2 = Math.round(AVG_US_HOUSEHOLD_CO2_KG_YEAR * (1 - validatedPotential / 100));
  
  const annualReduction = currentAnnualCO2 - potentialAnnualCO2;
  const annualSavings = Math.round(annualReduction * CO2_PRICE_PER_KG_USD);
  
  // Calculate equivalents
  const treesEquivalent = Math.round(annualReduction / 22); // 1 tree ≈ 22kg CO2/year
  const carKmEquivalent = Math.round(annualReduction / CAR_CO2_PER_KM);
  const homesPoweredDays = Math.round(annualReduction / (GRID_CO2_PER_KWH * (HOME_AVG_KWH_PER_YEAR / 365)));
  
  // Determine confidence level based on data points
  const confidenceLevel = validatedMissions > 20 ? 'high' : validatedMissions > 10 ? 'medium' : 'low';

  return {
    currentAnnualCO2Kg: currentAnnualCO2,
    potentialAnnualCO2Kg: potentialAnnualCO2,
    annualReductionKg: Math.max(0, annualReduction),
    annualSavingsUSD: Math.max(0, annualSavings),
    treesEquivalent: Math.max(0, treesEquivalent),
    carKmEquivalent: Math.max(0, carKmEquivalent),
    homesPoweredDays: Math.max(0, homesPoweredDays),
    confidenceLevel,
  };
}

/**
 * Calculates behavior change progress percentage
 * @param state - Current dashboard state
 * @returns Progress percentage (0-100)
 */
export function calculateBehaviorChangeProgress(state: DashboardState): number {
  if (!state || !state.profile || !state.stats) {
    return 0;
  }

  const scoreProgress = state.profile.carbonScore;
  const missionProgress = Math.min(100, (state.stats.missionsCompleted / 50) * 100);
  const streakProgress = Math.min(100, (state.stats.currentStreak / 30) * 100);
  const improvementProgress = state.stats.carbonImprovement;

  // Weighted average of different progress indicators
  return Math.round(
    (scoreProgress * 0.4) +
    (missionProgress * 0.3) +
    (streakProgress * 0.15) +
    (improvementProgress * 0.15)
  );
}

/**
 * Gets personalized behavior change recommendations
 * @param report - Complete carbon report
 * @param state - Current dashboard state
 * @returns Array of personalized recommendations
 */
export function getBehaviorChangeRecommendations(
  report: CompleteCarbonReport | null,
  state: DashboardState
): string[] {
  if (!report || !state.profile) {
    return [
      'Complete your first assessment to get personalized recommendations',
      'Start with daily eco-missions to build sustainable habits',
      'Track your progress to see your impact grow',
    ];
  }

  const score = state.profile.carbonScore;
  const streak = state.stats.currentStreak;
  const missionsCompleted = state.stats.missionsCompleted;

  const recommendations: string[] = [];

  if (score < 50) {
    recommendations.push('Focus on high-impact changes in your weakest category first');
    recommendations.push('Start with 2-3 simple daily habits to build momentum');
  } else if (score < 75) {
    recommendations.push('Build consistency by maintaining your current habits');
    recommendations.push('Add one new sustainable action each week');
  } else {
    recommendations.push('Optimize your existing habits for maximum impact');
    recommendations.push('Share your progress to inspire others');
  }

  if (streak < 7) {
    recommendations.push('Aim for a 7-day streak to establish lasting habits');
  } else if (streak < 30) {
    recommendations.push('Extend your streak to 30 days for habit consolidation');
  } else {
    recommendations.push('Maintain your excellent consistency and help others start');
  }

  if (missionsCompleted < 10) {
    recommendations.push('Complete 10+ missions to unlock advanced recommendations');
  } else {
    recommendations.push('Focus on missions in your weakest category for maximum impact');
  }

  return recommendations.slice(0, 4); // Return top 4 recommendations
}
