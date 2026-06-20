import { describe, it, expect } from 'vitest'
import {
  awardXP,
  getAvatarStageForLevel,
  calculateImpact,
  xpRequiredForLevel,
  loadDashboardState,
  saveDashboardState,
} from '../utils/dashboardStore'
import {
  calculateEcoTwinHealth,
  getHealthStatus,
  calculatePotentialRecovered,
  getOpportunityInsight,
} from '../utils/actionEngine'
import { calculateCarbonReport } from '../utils/carbonEngine'

describe('Edge Cases and Error Handling', () => {
  describe('awardXP', () => {
    it('handles negative XP amounts', () => {
      const result = awardXP(100, 2, -50)
      expect(result.newXP).toBe(100)
      expect(result.newLevel).toBe(2)
    })

    it('handles zero XP amount', () => {
      const result = awardXP(100, 2, 0)
      expect(result.newXP).toBe(100)
      expect(result.newLevel).toBe(2)
    })

    it('handles invalid current XP', () => {
      const result = awardXP(-100, 2, 50)
      expect(result.newXP).toBe(50)
      expect(result.newLevel).toBe(2)
    })

    it('handles invalid current level', () => {
      const result = awardXP(100, -5, 50)
      // Invalid level is validated to 1, but with 150 XP, level stays at 2
      expect(result.newLevel).toBeGreaterThanOrEqual(1)
    })

    it('handles string inputs', () => {
      const result = awardXP('100' as any, '2' as any, '50' as any)
      expect(result.newXP).toBe(150)
      expect(result.newLevel).toBe(2)
    })
  })

  describe('getAvatarStageForLevel', () => {
    it('handles negative levels', () => {
      const stage = getAvatarStageForLevel(-5)
      expect(stage.stage).toBe('seed')
    })

    it('handles zero level', () => {
      const stage = getAvatarStageForLevel(0)
      expect(stage.stage).toBe('seed')
    })

    it('handles very high levels', () => {
      const stage = getAvatarStageForLevel(1000)
      expect(stage.stage).toBe('guardian')
    })

    it('handles string input', () => {
      const stage = getAvatarStageForLevel('5' as any)
      // String '5' is converted to number 5, which qualifies for sprout stage (minLevel 3)
      expect(stage.stage).toBe('sprout')
    })
  })

  describe('calculateImpact', () => {
    it('handles negative CO2 values', () => {
      const impact = calculateImpact(-100)
      expect(impact.co2SavedKg).toBe(0)
      expect(impact.treesEquivalent).toBe(0)
    })

    it('handles zero CO2', () => {
      const impact = calculateImpact(0)
      expect(impact.co2SavedKg).toBe(0)
      expect(impact.treesEquivalent).toBe(0)
    })

    it('handles string input', () => {
      const impact = calculateImpact('100' as any)
      expect(impact.co2SavedKg).toBe(100)
    })
  })

  describe('xpRequiredForLevel', () => {
    it('handles negative levels', () => {
      const xp = xpRequiredForLevel(-5)
      expect(xp).toBe(100)
    })

    it('handles zero level', () => {
      const xp = xpRequiredForLevel(0)
      expect(xp).toBe(100)
    })

    it('handles string input', () => {
      const xp = xpRequiredForLevel('5' as any)
      expect(xp).toBeGreaterThan(0)
    })
  })

  describe('calculateEcoTwinHealth', () => {
    it('handles null state', () => {
      const health = calculateEcoTwinHealth(null as any)
      expect(health).toBe(0)
    })

    it('handles undefined state', () => {
      const health = calculateEcoTwinHealth(undefined as any)
      expect(health).toBe(0)
    })

    it('handles state without profile', () => {
      const health = calculateEcoTwinHealth({ profile: null } as any)
      expect(health).toBe(0)
    })

    it('handles state without stats', () => {
      const health = calculateEcoTwinHealth({ profile: {}, stats: null } as any)
      expect(health).toBe(0)
    })

    it('handles state without daily missions', () => {
      const health = calculateEcoTwinHealth({
        profile: { carbonScore: 50 },
        stats: { carbonImprovement: 10, currentStreak: 3, weeklyProgress: [1, 2, 3] },
        dailyMissions: null,
      } as any)
      expect(health).toBeGreaterThanOrEqual(0)
      expect(health).toBeLessThanOrEqual(100)
    })
  })

  describe('getHealthStatus', () => {
    it('handles negative health', () => {
      const status = getHealthStatus(-50)
      expect(status.label).toBe('Needs Care')
    })

    it('handles health above 100', () => {
      const status = getHealthStatus(150)
      expect(status.label).toBe('Thriving')
    })

    it('handles string input', () => {
      const status = getHealthStatus('75' as any)
      expect(status.label).toBe('Healthy')
    })
  })

  describe('calculatePotentialRecovered', () => {
    it('handles negative scores', () => {
      const recovered = calculatePotentialRecovered(-50, 80)
      expect(recovered).toBe(0)
    })

    it('handles potential lower than current', () => {
      const recovered = calculatePotentialRecovered(80, 50)
      expect(recovered).toBe(100)
    })

    it('handles equal scores', () => {
      const recovered = calculatePotentialRecovered(50, 50)
      expect(recovered).toBe(100)
    })

    it('handles string inputs', () => {
      const recovered = calculatePotentialRecovered('50' as any, '80' as any)
      expect(recovered).toBeGreaterThan(0)
      expect(recovered).toBeLessThanOrEqual(100)
    })
  })

  describe('getOpportunityInsight', () => {
    it('handles null state', () => {
      const insight = getOpportunityInsight(null, null as any)
      expect(insight.category).toBe('energy')
      expect(insight.gain).toBeGreaterThan(0)
    })

    it('handles state without profile', () => {
      const insight = getOpportunityInsight(null, {} as any)
      expect(insight.category).toBe('energy')
    })

    it('handles null report with valid state', () => {
      const insight = getOpportunityInsight(null, {
        profile: { carbonScore: 50 },
        stats: {},
        dailyMissions: [],
        achievements: [],
      } as any)
      expect(insight.category).toBe('energy')
      expect(insight.gain).toBeGreaterThan(0)
    })
  })

  describe('calculateCarbonReport', () => {
    it('handles null answers', () => {
      const report = calculateCarbonReport(null as any)
      expect(report).toBeDefined()
      expect(report.currentYou.overallScore).toBeGreaterThanOrEqual(0)
    })

    it('handles undefined answers', () => {
      const report = calculateCarbonReport(undefined as any)
      expect(report).toBeDefined()
    })

    it('handles empty answers object', () => {
      const report = calculateCarbonReport({})
      expect(report).toBeDefined()
      expect(report.currentYou.overallScore).toBeGreaterThanOrEqual(0)
    })

    it('handles invalid option IDs', () => {
      const report = calculateCarbonReport({
        commute: 'invalid-option-id',
      })
      expect(report).toBeDefined()
    })
  })

  describe('localStorage operations', () => {
    it('handles corrupted localStorage data', () => {
      localStorage.setItem('ecotwin_dashboard_v1', 'invalid-json')
      const state = loadDashboardState()
      expect(state).toBeDefined()
      expect(state.profile).toBeDefined()
    })

    it('handles localStorage unavailability', () => {
      const originalGetItem = localStorage.getItem
      localStorage.getItem = () => { throw new Error('Storage unavailable') }
      
      const state = loadDashboardState()
      expect(state).toBeDefined()
      
      localStorage.getItem = originalGetItem
    })

    it('handles save with invalid state', () => {
      expect(() => saveDashboardState(null as any)).not.toThrow()
    })

    it('handles save with state missing profile', () => {
      expect(() => saveDashboardState({ stats: {} } as any)).not.toThrow()
    })
  })
})
