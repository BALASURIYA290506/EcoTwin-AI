/**
 * Represents an answer option for a sustainability question
 */
export interface Option {
  id: string;
  text: string;
  co2e: number; // Annual kg CO2e
  costEstimate: number; // Relative annual cost in USD
  twinAlternativeId: string; // ID of the option the Future EcoTwin will adopt
  twinBenefit: string; // Benefit text if upgraded
}

/**
 * Sustainability assessment categories
 */
export type Category = 'transport' | 'energy' | 'food' | 'shopping' | 'waste' | 'lifestyle';

/**
 * Represents a question in the sustainability assessment
 */
export interface Question {
  id: string;
  category: Category;
  questionText: string;
  options: Option[];
}

export const QUESTIONS: Question[] = [
  {
    id: 'commute',
    category: 'transport',
    questionText: 'How do you travel most days?',
    options: [
      { id: 'car-gas', text: 'Drive alone in a gas car', co2e: 4500, costEstimate: 2200, twinAlternativeId: 'car-electric', twinBenefit: 'Switching to an EV or hybrid cuts direct fuel emissions and reduces maintenance costs.' },
      { id: 'car-electric', text: 'Drive electric or hybrid vehicle', co2e: 1800, costEstimate: 1000, twinAlternativeId: 'transit', twinBenefit: 'Choosing public transit or cycling occasionally keeps energy usage low.' },
      { id: 'carpool', text: 'Carpool or ride share', co2e: 2200, costEstimate: 1200, twinAlternativeId: 'transit', twinBenefit: 'Transitioning to transit lowers traffic congestion and reduces individual carbon footprint.' },
      { id: 'transit', text: 'Public transportation (bus/train)', co2e: 800, costEstimate: 700, twinAlternativeId: 'walkbike', twinBenefit: 'Walking or cycling for short commutes removes transit costs and is zero-carbon.' },
      { id: 'walkbike', text: 'Walk, bicycle, or use micro-mobility', co2e: 0, costEstimate: 0, twinAlternativeId: 'walkbike', twinBenefit: 'You are already at peak eco-efficiency for your commute!' }
    ]
  },
  {
    id: 'electricity',
    category: 'energy',
    questionText: 'How conscious are you about electricity consumption?',
    options: [
      { id: 'elec-not', text: 'Not conscious (leave appliances on, standard grid)', co2e: 3200, costEstimate: 1600, twinAlternativeId: 'elec-mod', twinBenefit: 'Turning off unused devices and adjusting thermostat saves power.' },
      { id: 'elec-mod', text: 'Moderately conscious (turn off lights, moderate AC usage)', co2e: 1800, costEstimate: 900, twinAlternativeId: 'elec-high', twinBenefit: 'Upgrading to Energy Star appliances and heat pumps maximizes savings.' },
      { id: 'elec-high', text: 'Highly conscious (use energy star appliances, solar power)', co2e: 400, costEstimate: 300, twinAlternativeId: 'elec-high', twinBenefit: 'Heat pumps and solar panels maintain highly efficient, clean energy usage.' }
    ]
  },
  {
    id: 'diet',
    category: 'food',
    questionText: 'How often do you eat meat?',
    options: [
      { id: 'diet-heavy', text: 'Meat with almost every meal (beef/pork daily)', co2e: 2200, costEstimate: 2000, twinAlternativeId: 'diet-mod', twinBenefit: 'Reducing red meat intake in favor of chicken/fish cuts food emissions by half.' },
      { id: 'diet-mod', text: 'Moderate meat consumption (some vegetarian days)', co2e: 1200, costEstimate: 1400, twinAlternativeId: 'diet-veg', twinBenefit: 'Exploring vegetarian meals a few times a week saves food costs.' },
      { id: 'diet-veg', text: 'Vegetarian (no meat, eat dairy/eggs)', co2e: 700, costEstimate: 1100, twinAlternativeId: 'diet-vegan', twinBenefit: 'Cutting out dairy items occasionally helps lower agricultural emissions.' },
      { id: 'diet-vegan', text: 'Fully plant-based / Vegan', co2e: 300, costEstimate: 900, twinAlternativeId: 'diet-vegan', twinBenefit: 'A plant-based diet has the lowest overall soil and greenhouse impact.' }
    ]
  },
  {
    id: 'recycling',
    category: 'waste',
    questionText: 'How often do you recycle or reuse materials?',
    options: [
      { id: 'recycle-rarely', text: 'Rarely / Put everything in standard trash', co2e: 480, costEstimate: 100, twinAlternativeId: 'recycle-basic', twinBenefit: 'Sorting plastic and paper prevents recyclable paper from rotting in dumps.' },
      { id: 'recycle-basic', text: 'Basic recycling (paper, cardboard, bottles)', co2e: 220, costEstimate: 50, twinAlternativeId: 'recycle-full', twinBenefit: 'Recycling aluminum and specialty items cuts recycling energy by 95%.' },
      { id: 'recycle-full', text: 'Meticulous recycling, composting, and avoiding single-use plastics', co2e: 50, costEstimate: 10, twinAlternativeId: 'recycle-full', twinBenefit: 'Excellent! Your household landfill contributions are close to zero.' }
    ]
  },
  {
    id: 'shopping',
    category: 'shopping',
    questionText: 'How frequently do you purchase new products or clothing?',
    options: [
      { id: 'shop-freq', text: 'Very frequently (weekly fashion, yearly tech upgrades)', co2e: 1100, costEstimate: 2200, twinAlternativeId: 'shop-mod', twinBenefit: 'Transitioning off fast fashion reduces chemical runoff in manufacturing.' },
      { id: 'shop-mod', text: 'Occasional / Moderate shopping (monthly purchases)', co2e: 500, costEstimate: 1000, twinAlternativeId: 'shop-mindful', twinBenefit: 'Buying seasonally and holding gadgets longer saves major cash.' },
      { id: 'shop-mindful', text: 'Mindful / Rarely buy new (mainly secondhand, extend device life)', co2e: 100, costEstimate: 200, twinAlternativeId: 'shop-mindful', twinBenefit: 'Maximizing electronic lifespan is excellent for reducing toxic e-waste.' }
    ]
  }
];

/**
 * Report containing current carbon footprint analysis
 */
export interface ScoreReport {
  overallScore: number;
  categoryBreakdown: Record<Category, number>;
  annualCO2Kg: number;
  strengths: string[];
  weaknesses: string[];
}

/**
 * Report containing future EcoTwin potential analysis
 */
export interface EcoTwinReport {
  potentialScore: number;
  annualCO2Kg: number;
  improvedHabits: {
    category: Category;
    currentHabit: string;
    futureHabit: string;
    benefit: string;
    co2Saved: number;
  }[];
  co2Saved: number;
  treeEquivalents: number;
  gasolineSavedGallons: number;
  costSavingsUSD: number;
}

/**
 * Complete carbon footprint report with current and future analysis
 */
export interface CompleteCarbonReport {
  currentYou: ScoreReport;
  futureEcoTwin: EcoTwinReport;
}

// Maximum baseline limits for each category to scale from 0 - 100
const MAX_CATEGORY_EMISSIONS: Record<Category, number> = {
  transport: 4500,
  energy: 3200,
  food: 2200,
  shopping: 1100,
  waste: 480,
  lifestyle: 1 // default placeholder
};

/**
 * Category weights for overall score calculation
 */
const CATEGORY_WEIGHTS: Record<Category, number> = {
  transport: 0.30,
  energy: 0.25,
  food: 0.20,
  shopping: 0.15,
  waste: 0.10,
  lifestyle: 0.00
};

/**
 * Calculates complete carbon footprint report from assessment answers
 * @param answers - Record of question IDs to selected option IDs
 * @returns Complete carbon report with current and future analysis
 */
export function calculateCarbonReport(answers: Record<string, string>): CompleteCarbonReport {
  // Validate input
  if (!answers || typeof answers !== 'object') {
    console.error('Invalid answers input');
    answers = {};
  }

  // 1. Calculate Current Emissions and Scores
  const categoryEmissions: Record<Category, number> = {
    transport: 0,
    energy: 0,
    food: 0,
    shopping: 0,
    waste: 0,
    lifestyle: 0
  };

  const currentSelectionTexts: Record<string, string> = {};

  // Map answers with validation
  QUESTIONS.forEach(q => {
    const selectedOptionId = answers[q.id];
    
    // Validate option ID
    if (!selectedOptionId || typeof selectedOptionId !== 'string') {
      console.warn(`Invalid option ID for question ${q.id}, using default`);
    }

    const option = q.options.find(o => o.id === selectedOptionId) || q.options[0];
    
    // Validate CO2e value
    const co2e = typeof option.co2e === 'number' && option.co2e >= 0 ? option.co2e : 0;
    categoryEmissions[q.category] += co2e;
    currentSelectionTexts[q.id] = String(option.text || '').slice(0, 100);
  });

  // Calculate category scores (0 - 100)
  const categoryBreakdown: Record<Category, number> = {
    transport: 100,
    energy: 100,
    food: 100,
    shopping: 100,
    waste: 100,
    lifestyle: 100
  };

  let totalEmissions = 0;

  (Object.keys(MAX_CATEGORY_EMISSIONS) as Category[]).forEach(cat => {
    const emission = categoryEmissions[cat];
    totalEmissions += Math.max(0, emission); // Skip negative offsets in basic accumulation
    
    // Score math: 100 minus proportion of max emissions
    const maxVal = MAX_CATEGORY_EMISSIONS[cat];
    const score = Math.max(0, Math.min(100, Math.round(100 * (1 - emission / maxVal))));
    categoryBreakdown[cat] = score;
  });

  // Calculate Overall Weighted Score
  let overallScoreSum = 0;
  (Object.keys(CATEGORY_WEIGHTS) as Category[]).forEach(cat => {
    overallScoreSum += categoryBreakdown[cat] * CATEGORY_WEIGHTS[cat];
  });
  const overallScore = Math.max(0, Math.min(100, Math.round(overallScoreSum)));

  // Generate Strengths & Weaknesses lists
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Rules based strengths/weaknesses
  if (categoryBreakdown.transport >= 75) {
    strengths.push('Low-carbon transportation: You rely heavily on walking, biking, or public transit.');
  } else {
    weaknesses.push('High transit footprint: Frequent driving or flying is contributing significantly to your impact.');
  }

  if (categoryBreakdown.energy >= 80) {
    strengths.push('Energy conscious heating: Your home leverages efficient clean thermal tech.');
  } else {
    weaknesses.push('Grid energy heavy: High air conditioning or standard electric/oil heating drains resources.');
  }

  if (categoryBreakdown.food >= 75) {
    strengths.push('Sustainable diet: You eat a highly plant-focused, low-waste diet.');
  } else {
    weaknesses.push('High-impact food habits: Meat-heavy consumption and food waste are boosting your emissions.');
  }

  if (categoryBreakdown.shopping >= 80) {
    strengths.push('Mindful consumerism: You shop rarely and keep electronics in use for longer.');
  } else {
    weaknesses.push('Frequent consumer purchasing: Electronics upgrades and brand new fast fashion purchases accumulate carbon.');
  }

  if (categoryBreakdown.waste >= 80) {
    strengths.push('Excellent waste circularity: You avoid plastics and sort recycling meticulously.');
  } else {
    weaknesses.push('Plastic & unsorted landfill: Single-use plastics and lack of comprehensive recycling.');
  }

  if (categoryBreakdown.lifestyle >= 80) {
    strengths.push('Eco leadership: You offset your footprint or prioritize high-efficiency products.');
  }

  // 2. Generate Future EcoTwin Report
  // Simulate replacement with improved habits
  const twinCategoryEmissions = { ...categoryEmissions };
  const improvedHabits: EcoTwinReport['improvedHabits'] = [];
  let simulatedCostSavings = 0;

  QUESTIONS.forEach(q => {
    const selectedOptionId = answers[q.id];
    const currentOption = q.options.find(o => o.id === selectedOptionId) || q.options[0];
    
    // EcoTwin is simulated by finding the alternate option defined
    const twinOptionId = currentOption.twinAlternativeId;
    const twinOption = q.options.find(o => o.id === twinOptionId) || currentOption;

    if (currentOption.id !== twinOption.id) {
      const co2Diff = currentOption.co2e - twinOption.co2e;
      const costDiff = currentOption.costEstimate - twinOption.costEstimate;

      twinCategoryEmissions[q.category] -= co2Diff;
      simulatedCostSavings += Math.max(0, costDiff);

      improvedHabits.push({
        category: q.category,
        currentHabit: currentOption.text,
        futureHabit: twinOption.text,
        benefit: currentOption.twinBenefit,
        co2Saved: co2Diff
      });
    }
  });

  // Calculate Future Category Scores & Overall
  const twinCategoryBreakdown: Record<Category, number> = { ...categoryBreakdown };
  (Object.keys(MAX_CATEGORY_EMISSIONS) as Category[]).forEach(cat => {
    const emission = twinCategoryEmissions[cat];
    const maxVal = MAX_CATEGORY_EMISSIONS[cat];
    const score = Math.max(0, Math.min(100, Math.round(100 * (1 - emission / maxVal))));
    twinCategoryBreakdown[cat] = score;
  });

  let twinOverallScoreSum = 0;
  (Object.keys(CATEGORY_WEIGHTS) as Category[]).forEach(cat => {
    twinOverallScoreSum += twinCategoryBreakdown[cat] * CATEGORY_WEIGHTS[cat];
  });
  
  // Future potential score is targeted to be high (capped between 85 - 98 based on user's dedication simulation)
  const potentialScore = Math.max(85, Math.min(98, Math.round(twinOverallScoreSum)));
  const totalTwinEmissions = Object.values(twinCategoryEmissions).reduce((a, b) => a + b, 0);

  const co2Saved = Math.max(0, totalEmissions - totalTwinEmissions);
  const treeEquivalents = Math.round(co2Saved / 22.0); // 1 mature tree absorbs ~22kg CO2/year
  const gasolineSavedGallons = Math.round(co2Saved / 8.887 * 10) / 10; // 1 gallon gasoline = 8.887kg CO2

  return {
    currentYou: {
      overallScore,
      categoryBreakdown,
      annualCO2Kg: totalEmissions,
      strengths: strengths.length > 0 ? strengths.slice(0, 3) : ['Baseline established: Ready for improvements.'],
      weaknesses: weaknesses.length > 0 ? weaknesses.slice(0, 3) : ['No severe impact areas. Let\'s optimize details!']
    },
    futureEcoTwin: {
      potentialScore,
      annualCO2Kg: totalTwinEmissions,
      improvedHabits: improvedHabits.slice(0, 3), // Top 3 recommendation swaps
      co2Saved,
      treeEquivalents,
      gasolineSavedGallons,
      costSavingsUSD: simulatedCostSavings
    }
  };
}
