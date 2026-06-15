import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  createDefaultState, 
  loadDashboardState, 
  saveDashboardState,
  awardXP,
  xpRequiredForLevel,
  getAvatarStageForLevel,
  getDailyMissions,
  calculateImpact
} from '../utils/dashboardStore'

describe('dashboardStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('createDefaultState', () => {
    it('creates default state with all required fields', () => {
      const state = createDefaultState()
      
      expect(state).toHaveProperty('profile')
      expect(state).toHaveProperty('stats')
      expect(state).toHaveProperty('dailyMissions')
      expect(state).toHaveProperty('achievements')
      expect(state.profile.name).toBe('Alex')
      expect(state.profile.level).toBe(2)
    })

    it('accepts custom carbon scores', () => {
      const state = createDefaultState(75, 95)
      
      expect(state.profile.carbonScore).toBe(75)
      expect(state.profile.potentialScore).toBe(95)
    })
  })

  describe('loadDashboardState', () => {
    it('loads state from localStorage', () => {
      const testState = createDefaultState(80, 90)
      saveDashboardState(testState)
      
      const loaded = loadDashboardState()
      expect(loaded.profile.name).toBe(testState.profile.name)
    })

    it('returns default state when localStorage is empty', () => {
      const state = loadDashboardState()
      expect(state.profile.name).toBe('Alex')
    })

    it('overrides scores when provided', () => {
      const testState = createDefaultState(50, 80)
      saveDashboardState(testState)
      
      const loaded = loadDashboardState(90, 95)
      expect(loaded.profile.carbonScore).toBe(90)
      expect(loaded.profile.potentialScore).toBe(95)
    })

    it('syncs avatar stage with level', () => {
      const testState = createDefaultState()
      testState.profile.level = 10
      saveDashboardState(testState)
      
      const loaded = loadDashboardState()
      expect(loaded.profile.avatarStage).toBe('tree')
    })
  })

  describe('saveDashboardState', () => {
    it('saves state to localStorage', () => {
      const state = createDefaultState()
      saveDashboardState(state)
      
      const saved = localStorage.getItem('ecotwin_dashboard_v1')
      expect(saved).toBeTruthy()
    })

    it('handles localStorage errors gracefully', () => {
      const state = createDefaultState()
      const mockSetItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full')
      })
      
      expect(() => saveDashboardState(state)).not.toThrow()
      mockSetItem.mockRestore()
    })
  })

  describe('awardXP', () => {
    it('awards XP correctly', () => {
      const result = awardXP(100, 2, 50)
      
      expect(result.newXP).toBe(150)
      expect(result.newLevel).toBe(2)
      expect(result.leveledUp).toBe(false)
    })

    it('triggers level up when XP threshold reached', () => {
      const result = awardXP(280, 2, 50)
      
      expect(result.leveledUp).toBe(true)
      expect(result.newLevel).toBe(3)
    })

    it('handles multiple level ups', () => {
      const result = awardXP(100, 2, 500)
      
      expect(result.newLevel).toBeGreaterThan(2)
      expect(result.leveledUp).toBe(true)
    })

    it('updates avatar stage on level up', () => {
      const result = awardXP(100, 2, 500)
      
      expect(result.stageChanged).toBe(true)
      expect(result.newStage.stage).not.toBe(result.previousStage.stage)
    })
  })

  describe('xpRequiredForLevel', () => {
    it('calculates XP requirements correctly', () => {
      expect(xpRequiredForLevel(1)).toBe(100)
      expect(xpRequiredForLevel(2)).toBe(283)
      expect(xpRequiredForLevel(3)).toBe(520)
    })

    it('increases with level', () => {
      expect(xpRequiredForLevel(5)).toBeGreaterThan(xpRequiredForLevel(4))
      expect(xpRequiredForLevel(10)).toBeGreaterThan(xpRequiredForLevel(5))
    })
  })

  describe('getAvatarStageForLevel', () => {
    it('returns seed for low levels', () => {
      expect(getAvatarStageForLevel(1).stage).toBe('seed')
      expect(getAvatarStageForLevel(2).stage).toBe('seed')
    })

    it('returns sprout for level 3+', () => {
      expect(getAvatarStageForLevel(3).stage).toBe('sprout')
      expect(getAvatarStageForLevel(5).stage).toBe('sprout')
    })

    it('returns explorer for level 6+', () => {
      expect(getAvatarStageForLevel(6).stage).toBe('explorer')
      expect(getAvatarStageForLevel(9).stage).toBe('explorer')
    })

    it('returns tree for level 10+', () => {
      expect(getAvatarStageForLevel(10).stage).toBe('tree')
      expect(getAvatarStageForLevel(14).stage).toBe('tree')
    })

    it('returns guardian for level 15+', () => {
      expect(getAvatarStageForLevel(15).stage).toBe('guardian')
      expect(getAvatarStageForLevel(20).stage).toBe('guardian')
    })
  })

  describe('getDailyMissions', () => {
    it('returns 3 missions', () => {
      const missions = getDailyMissions()
      expect(missions).toHaveLength(3)
    })

    it('marks missions as not completed', () => {
      const missions = getDailyMissions()
      missions.forEach(mission => {
        expect(mission.completed).toBe(false)
      })
    })

    it('uses seed for deterministic selection', () => {
      const missions1 = getDailyMissions(1)
      const missions2 = getDailyMissions(1)
      
      expect(missions1[0].id).toBe(missions2[0].id)
    })
  })

  describe('calculateImpact', () => {
    it('calculates environmental impact metrics', () => {
      const impact = calculateImpact(100)
      
      expect(impact).toHaveProperty('co2SavedKg')
      expect(impact).toHaveProperty('treesEquivalent')
      expect(impact).toHaveProperty('drivingKmAvoided')
      expect(impact).toHaveProperty('energySavedKwh')
    })

    it('calculates tree equivalents correctly', () => {
      const impact = calculateImpact(44)
      expect(impact.treesEquivalent).toBe(2)
    })

    it('handles zero CO2 saved', () => {
      const impact = calculateImpact(0)
      expect(impact.co2SavedKg).toBe(0)
    })
  })
})
