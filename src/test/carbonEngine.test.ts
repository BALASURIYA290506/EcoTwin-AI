import { describe, it, expect } from 'vitest'
import { calculateCarbonReport, QUESTIONS } from '../utils/carbonEngine'

describe('carbonEngine', () => {
  it('calculates carbon report with valid answers', () => {
    const answers = {
      commute: 'car-gas',
      electricity: 'elec-not',
      diet: 'diet-heavy',
      recycling: 'recycle-rarely',
      shopping: 'shop-freq'
    }
    
    const report = calculateCarbonReport(answers)
    
    expect(report).toHaveProperty('currentYou')
    expect(report).toHaveProperty('futureEcoTwin')
    expect(report.currentYou).toHaveProperty('overallScore')
    expect(report.currentYou).toHaveProperty('categoryBreakdown')
    expect(report.currentYou).toHaveProperty('annualCO2Kg')
    expect(report.futureEcoTwin).toHaveProperty('potentialScore')
    expect(report.futureEcoTwin).toHaveProperty('co2Saved')
  })

  it('returns higher score for eco-friendly choices', () => {
    const ecoAnswers = {
      commute: 'walkbike',
      electricity: 'elec-high',
      diet: 'diet-vegan',
      recycling: 'recycle-full',
      shopping: 'shop-mindful'
    }
    
    const nonEcoAnswers = {
      commute: 'car-gas',
      electricity: 'elec-not',
      diet: 'diet-heavy',
      recycling: 'recycle-rarely',
      shopping: 'shop-freq'
    }
    
    const ecoReport = calculateCarbonReport(ecoAnswers)
    const nonEcoReport = calculateCarbonReport(nonEcoAnswers)
    
    expect(ecoReport.currentYou.overallScore).toBeGreaterThan(nonEcoReport.currentYou.overallScore)
  })

  it('calculates category breakdown correctly', () => {
    const answers = {
      commute: 'walkbike',
      electricity: 'elec-high',
      diet: 'diet-vegan',
      recycling: 'recycle-full',
      shopping: 'shop-mindful'
    }
    
    const report = calculateCarbonReport(answers)
    
    expect(report.currentYou.categoryBreakdown.transport).toBeGreaterThan(80)
    expect(report.currentYou.categoryBreakdown.energy).toBeGreaterThan(80)
    expect(report.currentYou.categoryBreakdown.food).toBeGreaterThan(80)
  })

  it('generates strengths for high-scoring categories', () => {
    const answers = {
      commute: 'walkbike',
      electricity: 'elec-high',
      diet: 'diet-vegan',
      recycling: 'recycle-full',
      shopping: 'shop-mindful'
    }
    
    const report = calculateCarbonReport(answers)
    
    expect(report.currentYou.strengths.length).toBeGreaterThan(0)
    expect(report.currentYou.strengths[0]).toContain('Low-carbon')
  })

  it('generates weaknesses for low-scoring categories', () => {
    const answers = {
      commute: 'car-gas',
      electricity: 'elec-not',
      diet: 'diet-heavy',
      recycling: 'recycle-rarely',
      shopping: 'shop-freq'
    }
    
    const report = calculateCarbonReport(answers)
    
    expect(report.currentYou.weaknesses.length).toBeGreaterThan(0)
  })

  it('calculates future EcoTwin potential score higher than current', () => {
    const answers = {
      commute: 'car-gas',
      electricity: 'elec-not',
      diet: 'diet-heavy',
      recycling: 'recycle-rarely',
      shopping: 'shop-freq'
    }
    
    const report = calculateCarbonReport(answers)
    
    expect(report.futureEcoTwin.potentialScore).toBeGreaterThan(report.currentYou.overallScore)
  })

  it('calculates CO2 savings correctly', () => {
    const answers = {
      commute: 'car-gas',
      electricity: 'elec-not',
      diet: 'diet-heavy',
      recycling: 'recycle-rarely',
      shopping: 'shop-freq'
    }
    
    const report = calculateCarbonReport(answers)
    
    expect(report.futureEcoTwin.co2Saved).toBeGreaterThan(0)
    expect(report.futureEcoTwin.treeEquivalents).toBeGreaterThan(0)
  })

  it('handles missing answers gracefully', () => {
    const answers = {}
    
    const report = calculateCarbonReport(answers)
    
    expect(report).toBeDefined()
    expect(report.currentYou.overallScore).toBeGreaterThanOrEqual(0)
    expect(report.currentYou.overallScore).toBeLessThanOrEqual(100)
  })

  it('includes improved habits in future report', () => {
    const answers = {
      commute: 'car-gas',
      electricity: 'elec-not',
      diet: 'diet-heavy',
      recycling: 'recycle-rarely',
      shopping: 'shop-freq'
    }
    
    const report = calculateCarbonReport(answers)
    
    expect(report.futureEcoTwin.improvedHabits).toBeDefined()
    expect(report.futureEcoTwin.improvedHabits.length).toBeGreaterThan(0)
  })

  it('QUESTIONS array has all required fields', () => {
    QUESTIONS.forEach(question => {
      expect(question).toHaveProperty('id')
      expect(question).toHaveProperty('category')
      expect(question).toHaveProperty('questionText')
      expect(question).toHaveProperty('options')
      expect(question.options).toBeInstanceOf(Array)
      expect(question.options.length).toBeGreaterThan(0)
    })
  })
})
