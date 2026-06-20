import { describe, it, expect } from 'vitest'
import {
  generateCarbonRoadmap,
  generateWeeklyEcoGoals,
  projectAnnualImpact,
  calculateBehaviorChangeProgress,
  getBehaviorChangeRecommendations,
} from '../utils/behaviorChange'
import type { CompleteCarbonReport } from '../utils/carbonEngine'
import type { DashboardState } from '../utils/dashboardStore'

describe('Behavior Change Engine', () => {
  describe('generateCarbonRoadmap', () => {
    it('generates roadmap with valid inputs', () => {
      const roadmap = generateCarbonRoadmap(50, 80, 2)
      expect(roadmap).toHaveLength(5)
      expect(roadmap[0].level).toBe(3)
      expect(roadmap[4].targetScore).toBe(80)
    })

    it('handles potential score lower than current', () => {
      const roadmap = generateCarbonRoadmap(80, 50, 5)
      expect(roadmap).toHaveLength(1)
      expect(roadmap[0].targetScore).toBe(80)
    })

    it('handles equal scores', () => {
      const roadmap = generateCarbonRoadmap(70, 70, 3)
      expect(roadmap).toHaveLength(1)
      expect(roadmap[0].timeframe).toBe('Already achieved')
    })

    it('handles invalid inputs', () => {
      const roadmap = generateCarbonRoadmap(-50, 150, -2)
      expect(roadmap).toHaveLength(5)
      expect(roadmap[0].targetScore).toBeGreaterThanOrEqual(0)
      expect(roadmap[4].targetScore).toBeLessThanOrEqual(100)
    })

    it('calculates realistic CO2 reductions', () => {
      const roadmap = generateCarbonRoadmap(50, 90, 2)
      roadmap.forEach(milestone => {
        expect(milestone.estimatedCO2ReductionKg).toBeGreaterThan(0)
        expect(milestone.estimatedAnnualSavingsUSD).toBeGreaterThan(0)
      })
    })
  })

  describe('generateWeeklyEcoGoals', () => {
    it('generates goals with valid report and state', () => {
      const report = {
        currentYou: {
          overallScore: 50,
          categoryBreakdown: {
            transport: 40,
            energy: 30,
            food: 60,
            shopping: 50,
            waste: 35,
            lifestyle: 55,
          },
          annualCO2Kg: 8000,
          strengths: [],
          weaknesses: [],
        },
        futureEcoTwin: {
          potentialScore: 80,
          annualCO2Kg: 4000,
          improvedHabits: [],
          co2Saved: 4000,
          treeEquivalents: 182,
          gasolineSavedGallons: 450,
          costSavingsUSD: 200,
        },
      } as CompleteCarbonReport

      const state = {
        profile: {
          name: 'Test',
          avatarStage: 'seed',
          level: 2,
          xp: 100,
          joinDate: '2024-01-01',
          carbonScore: 50,
          potentialScore: 80,
        },
        stats: {
          missionsCompleted: 5,
          currentStreak: 3,
          totalCO2Saved: 42,
          totalXP: 220,
          weeklyProgress: [1, 2, 1, 0, 3, 2, 0],
          carbonImprovement: 12,
          weeklyGoalsCompleted: 0,
        },
        dailyMissions: [],
        achievements: [],
      } as DashboardState

      const goals = generateWeeklyEcoGoals(report, state)
      expect(goals).toHaveLength(3)
      goals.forEach(goal => {
        expect(goal.id).toBeDefined()
        expect(goal.title).toBeDefined()
        expect(goal.category).toBeDefined()
        expect(goal.targetValue).toBeGreaterThan(0)
        expect(goal.currentValue).toBe(0)
        expect(goal.completed).toBe(false)
        expect(goal.impactKgCO2).toBeGreaterThan(0)
      })
    })

    it('returns default goals with null report', () => {
      const goals = generateWeeklyEcoGoals(null, {} as DashboardState)
      expect(goals).toHaveLength(3)
      expect(goals[0].title).toContain('missions')
    })

    it('returns default goals with null state', () => {
      const goals = generateWeeklyEcoGoals(null as any, null as any)
      expect(goals).toHaveLength(3)
    })

    it('targets weakest category', () => {
      const report = {
        currentYou: {
          overallScore: 50,
          categoryBreakdown: {
            transport: 80,
            energy: 85,
            food: 70,
            shopping: 75,
            waste: 25, // Weakest
            lifestyle: 60,
          },
          annualCO2Kg: 8000,
          strengths: [],
          weaknesses: [],
        },
        futureEcoTwin: {
          potentialScore: 80,
          annualCO2Kg: 4000,
          improvedHabits: [],
          co2Saved: 4000,
          treeEquivalents: 182,
          gasolineSavedGallons: 450,
          costSavingsUSD: 200,
        },
      } as CompleteCarbonReport

      const state = {
        profile: {
          name: 'Test',
          avatarStage: 'seed',
          level: 2,
          xp: 100,
          joinDate: '2024-01-01',
          carbonScore: 50,
          potentialScore: 80,
        },
        stats: {
          missionsCompleted: 5,
          currentStreak: 3,
          totalCO2Saved: 42,
          totalXP: 220,
          weeklyProgress: [1, 2, 1, 0, 3, 2, 0],
          carbonImprovement: 12,
          weeklyGoalsCompleted: 0,
        },
        dailyMissions: [],
        achievements: [],
      } as DashboardState

      const goals = generateWeeklyEcoGoals(report, state)
      expect(goals).toHaveLength(3)
      goals.forEach(goal => {
        expect(goal.category).toBe('waste')
      })
    })
  })

  describe('projectAnnualImpact', () => {
    it('calculates annual impact with valid inputs', () => {
      const projection = projectAnnualImpact(50, 80, 15)
      expect(projection.currentAnnualCO2Kg).toBeGreaterThan(0)
      expect(projection.potentialAnnualCO2Kg).toBeLessThan(projection.currentAnnualCO2Kg)
      expect(projection.annualReductionKg).toBeGreaterThan(0)
      expect(projection.annualSavingsUSD).toBeGreaterThan(0)
      expect(projection.treesEquivalent).toBeGreaterThan(0)
    })

    it('handles potential score higher than current', () => {
      const projection = projectAnnualImpact(30, 90, 15)
      expect(projection.annualReductionKg).toBeGreaterThan(0)
      expect(projection.confidenceLevel).toBe('medium')
    })

    it('handles potential score lower than current', () => {
      const projection = projectAnnualImpact(80, 50, 10)
      expect(projection.annualReductionKg).toBe(0)
    })

    it('determines confidence level based on missions', () => {
      const lowConfidence = projectAnnualImpact(50, 80, 5)
      expect(lowConfidence.confidenceLevel).toBe('low')

      const mediumConfidence = projectAnnualImpact(50, 80, 15)
      expect(mediumConfidence.confidenceLevel).toBe('medium')

      const highConfidence = projectAnnualImpact(50, 80, 25)
      expect(highConfidence.confidenceLevel).toBe('high')
    })

    it('handles invalid inputs', () => {
      const projection = projectAnnualImpact(-50, 150, -10)
      expect(projection.currentAnnualCO2Kg).toBeGreaterThan(0)
      // Potential score clamped to 100, so potentialAnnualCO2Kg is 0
      expect(projection.potentialAnnualCO2Kg).toBeGreaterThanOrEqual(0)
      expect(projection.confidenceLevel).toBe('low')
    })

    it('calculates realistic equivalents', () => {
      const projection = projectAnnualImpact(50, 80, 20)
      expect(projection.carKmEquivalent).toBeGreaterThan(0)
      expect(projection.homesPoweredDays).toBeGreaterThan(0)
    })
  })

  describe('calculateBehaviorChangeProgress', () => {
    it('calculates progress with valid state', () => {
      const state = {
        profile: {
          name: 'Test',
          avatarStage: 'seed',
          level: 5,
          xp: 500,
          joinDate: '2024-01-01',
          carbonScore: 60,
          potentialScore: 80,
        },
        stats: {
          missionsCompleted: 20,
          currentStreak: 10,
          totalCO2Saved: 100,
          totalXP: 500,
          weeklyProgress: [2, 3, 2, 1, 3, 2, 1],
          carbonImprovement: 20,
          weeklyGoalsCompleted: 0,
        },
        dailyMissions: [],
        achievements: [],
      } as DashboardState

      const progress = calculateBehaviorChangeProgress(state)
      expect(progress).toBeGreaterThan(0)
      expect(progress).toBeLessThanOrEqual(100)
    })

    it('handles null state', () => {
      const progress = calculateBehaviorChangeProgress(null as any)
      expect(progress).toBe(0)
    })

    it('handles state without profile', () => {
      const progress = calculateBehaviorChangeProgress({ stats: {} } as any)
      expect(progress).toBe(0)
    })

    it('handles state without stats', () => {
      const progress = calculateBehaviorChangeProgress({ profile: {} } as any)
      expect(progress).toBe(0)
    })

    it('calculates zero progress for new user', () => {
      const state = {
        profile: {
          name: 'Test',
          avatarStage: 'seed',
          level: 1,
          xp: 0,
          joinDate: '2024-01-01',
          carbonScore: 0,
          potentialScore: 80,
        },
        stats: {
          missionsCompleted: 0,
          currentStreak: 0,
          totalCO2Saved: 0,
          totalXP: 0,
          weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
          carbonImprovement: 0,
          weeklyGoalsCompleted: 0,
        },
        dailyMissions: [],
        achievements: [],
      } as DashboardState

      const progress = calculateBehaviorChangeProgress(state)
      expect(progress).toBe(0)
    })
  })

  describe('getBehaviorChangeRecommendations', () => {
    it('generates recommendations with valid inputs', () => {
      const report = {
        currentYou: {
          overallScore: 50,
          categoryBreakdown: {
            transport: 40,
            energy: 30,
            food: 60,
            shopping: 50,
            waste: 35,
            lifestyle: 55,
          },
          annualCO2Kg: 8000,
          strengths: [],
          weaknesses: [],
        },
        futureEcoTwin: {
          potentialScore: 80,
          annualCO2Kg: 4000,
          improvedHabits: [],
          co2Saved: 4000,
          treeEquivalents: 182,
          gasolineSavedGallons: 450,
          costSavingsUSD: 200,
        },
      } as CompleteCarbonReport

      const state = {
        profile: {
          name: 'Test',
          avatarStage: 'seed',
          level: 2,
          xp: 100,
          joinDate: '2024-01-01',
          carbonScore: 50,
          potentialScore: 80,
        },
        stats: {
          missionsCompleted: 5,
          currentStreak: 3,
          totalCO2Saved: 42,
          totalXP: 220,
          weeklyProgress: [1, 2, 1, 0, 3, 2, 0],
          carbonImprovement: 12,
          weeklyGoalsCompleted: 0,
        },
        dailyMissions: [],
        achievements: [],
      } as DashboardState

      const recommendations = getBehaviorChangeRecommendations(report, state)
      expect(recommendations).toHaveLength(4)
      recommendations.forEach(rec => {
        expect(rec).toBeDefined()
        expect(typeof rec).toBe('string')
        expect(rec.length).toBeGreaterThan(0)
      })
    })

    it('returns default recommendations with null report', () => {
      const recommendations = getBehaviorChangeRecommendations(null, {} as DashboardState)
      expect(recommendations).toHaveLength(3)
      expect(recommendations[0]).toContain('assessment')
    })

    it('returns default recommendations with null state', () => {
      const recommendations = getBehaviorChangeRecommendations(null as any, null as any)
      expect(recommendations).toHaveLength(3)
    })

    it('tailors recommendations to low score', () => {
      const report = {
        currentYou: {
          overallScore: 30,
          categoryBreakdown: {
            transport: 20,
            energy: 25,
            food: 35,
            shopping: 30,
            waste: 20,
            lifestyle: 30,
          },
          annualCO2Kg: 12000,
          strengths: [],
          weaknesses: [],
        },
        futureEcoTwin: {
          potentialScore: 80,
          annualCO2Kg: 4000,
          improvedHabits: [],
          co2Saved: 8000,
          treeEquivalents: 364,
          gasolineSavedGallons: 900,
          costSavingsUSD: 400,
        },
      } as CompleteCarbonReport

      const state = {
        profile: {
          name: 'Test',
          avatarStage: 'seed',
          level: 1,
          xp: 50,
          joinDate: '2024-01-01',
          carbonScore: 30,
          potentialScore: 80,
        },
        stats: {
          missionsCompleted: 2,
          currentStreak: 1,
          totalCO2Saved: 10,
          totalXP: 50,
          weeklyProgress: [0, 1, 0, 0, 1, 0, 0],
          carbonImprovement: 5,
          weeklyGoalsCompleted: 0,
        },
        dailyMissions: [],
        achievements: [],
      } as DashboardState

      const recommendations = getBehaviorChangeRecommendations(report, state)
      expect(recommendations).toHaveLength(4)
      expect(recommendations.some(r => r.includes('high-impact'))).toBe(true)
    })

    it('tailors recommendations to high score', () => {
      const report = {
        currentYou: {
          overallScore: 85,
          categoryBreakdown: {
            transport: 90,
            energy: 85,
            food: 80,
            shopping: 85,
            waste: 90,
            lifestyle: 80,
          },
          annualCO2Kg: 2400,
          strengths: [],
          weaknesses: [],
        },
        futureEcoTwin: {
          potentialScore: 95,
          annualCO2Kg: 800,
          improvedHabits: [],
          co2Saved: 1600,
          treeEquivalents: 73,
          gasolineSavedGallons: 180,
          costSavingsUSD: 80,
        },
      } as CompleteCarbonReport

      const state = {
        profile: {
          name: 'Test',
          avatarStage: 'tree',
          level: 10,
          xp: 2000,
          joinDate: '2024-01-01',
          carbonScore: 85,
          potentialScore: 95,
        },
        stats: {
          missionsCompleted: 40,
          currentStreak: 25,
          totalCO2Saved: 500,
          totalXP: 2000,
          weeklyProgress: [5, 6, 5, 4, 6, 5, 4],
          carbonImprovement: 35,
          weeklyGoalsCompleted: 0,
        },
        dailyMissions: [],
        achievements: [],
      } as DashboardState

      const recommendations = getBehaviorChangeRecommendations(report, state)
      expect(recommendations).toHaveLength(4)
      expect(recommendations.some(r => r.includes('inspire') || r.includes('help others'))).toBe(true)
    })
  })
})
