// ─────────────────────────────────────────────────────────
// EcoTwin Phase 2 — Dashboard Data Store
// Supabase-ready architecture with localStorage persistence
// ─────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────

export type AvatarStage = 'seed' | 'sprout' | 'explorer' | 'tree' | 'guardian';
export type MissionCategory = 'water' | 'energy' | 'transport' | 'waste' | 'food' | 'lifestyle';

export interface UserProfile {
  name: string;
  avatarStage: AvatarStage;
  level: number;
  xp: number;
  joinDate: string;
  carbonScore: number;       // Current score from assessment
  potentialScore: number;    // Future EcoTwin score
}

export interface UserStats {
  missionsCompleted: number;
  currentStreak: number;
  totalCO2Saved: number;     // kg
  totalXP: number;
  weeklyProgress: number[];  // missions completed per day (last 7 days)
  carbonImprovement: number; // percentage
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: MissionCategory;
  completed: boolean;
  icon: string; // emoji
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;  // emoji
  unlocked: boolean;
  progress: number;
  target: number;
}

export interface DashboardState {
  profile: UserProfile;
  stats: UserStats;
  dailyMissions: Mission[];
  achievements: Achievement[];
}

// ── Avatar Stage Config ──────────────────────────────────

export interface AvatarStageConfig {
  stage: AvatarStage;
  label: string;
  emoji: string;
  description: string;
  minLevel: number;
  gradient: string;        // CSS gradient for background
  glowColor: string;       // Glow ring color
  particleColor: string;
}

export const AVATAR_STAGES: AvatarStageConfig[] = [
  {
    stage: 'seed',
    label: 'Eco Seed',
    emoji: '🌱',
    description: 'Your journey begins here. Every small action counts.',
    minLevel: 1,
    gradient: 'linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)',
    glowColor: 'rgba(34, 197, 94, 0.25)',
    particleColor: '#86EFAC',
  },
  {
    stage: 'sprout',
    label: 'Growing Sprout',
    emoji: '🌿',
    description: 'You\'re developing sustainable habits. Keep growing!',
    minLevel: 3,
    gradient: 'linear-gradient(135deg, #BBF7D0 0%, #DCFCE7 100%)',
    glowColor: 'rgba(34, 197, 94, 0.35)',
    particleColor: '#4ADE80',
  },
  {
    stage: 'explorer',
    label: 'Green Explorer',
    emoji: '🍀',
    description: 'You\'re actively exploring greener ways to live.',
    minLevel: 6,
    gradient: 'linear-gradient(135deg, #86EFAC 0%, #BBF7D0 100%)',
    glowColor: 'rgba(16, 185, 129, 0.40)',
    particleColor: '#34D399',
  },
  {
    stage: 'tree',
    label: 'Young Tree',
    emoji: '🌳',
    description: 'Your roots are deep. You inspire others around you.',
    minLevel: 10,
    gradient: 'linear-gradient(135deg, #4ADE80 0%, #86EFAC 100%)',
    glowColor: 'rgba(21, 128, 61, 0.45)',
    particleColor: '#22C55E',
  },
  {
    stage: 'guardian',
    label: 'Planet Guardian',
    emoji: '🌲',
    description: 'You are a champion of the planet. Lead the way!',
    minLevel: 15,
    gradient: 'linear-gradient(135deg, #15803D 0%, #22C55E 50%, #F59E0B 100%)',
    glowColor: 'rgba(21, 128, 61, 0.55)',
    particleColor: '#15803D',
  },
];

// ── XP System ────────────────────────────────────────────

export function xpRequiredForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.5));
}

export function getAvatarStageForLevel(level: number): AvatarStageConfig {
  // Return the highest stage the user qualifies for
  let result = AVATAR_STAGES[0];
  for (const stage of AVATAR_STAGES) {
    if (level >= stage.minLevel) {
      result = stage;
    }
  }
  return result;
}

// ── Mission Pool ─────────────────────────────────────────

const MISSION_POOL: Omit<Mission, 'completed'>[] = [
  { id: 'm1', title: 'Carry Reusable Bottle', description: 'Skip the single-use plastic — hydrate sustainably all day.', xpReward: 25, category: 'waste', icon: '🧴' },
  { id: 'm2', title: 'Reduce AC by 1 Hour', description: 'Open windows or use a fan instead of air conditioning today.', xpReward: 30, category: 'energy', icon: '❄️' },
  { id: 'm3', title: 'Walk a Short Trip', description: 'Choose walking or cycling instead of driving for one errand.', xpReward: 35, category: 'transport', icon: '🚶' },
  { id: 'm4', title: 'Turn Off Unused Lights', description: 'Do a sweep of your home and turn off lights in empty rooms.', xpReward: 20, category: 'energy', icon: '💡' },
  { id: 'm5', title: 'Avoid Single-Use Plastic', description: 'Say no to plastic bags, straws, and disposable containers.', xpReward: 30, category: 'waste', icon: '♻️' },
  { id: 'm6', title: 'Save Water While Brushing', description: 'Turn off the tap while brushing your teeth — save up to 8 gallons!', xpReward: 20, category: 'water', icon: '🚿' },
  { id: 'm7', title: 'Eat a Plant-Based Meal', description: 'Swap one meal today for a fully plant-based option.', xpReward: 30, category: 'food', icon: '🥗' },
  { id: 'm8', title: 'Unplug Idle Chargers', description: 'Disconnect chargers and appliances not in use to save phantom energy.', xpReward: 25, category: 'energy', icon: '🔌' },
  { id: 'm9', title: 'Take Public Transit', description: 'Use bus, train, or metro instead of driving for your commute today.', xpReward: 35, category: 'transport', icon: '🚌' },
  { id: 'm10', title: 'Compost Food Scraps', description: 'Separate food waste and start composting organic scraps.', xpReward: 30, category: 'food', icon: '🌿' },
  { id: 'm11', title: 'Use a Reusable Bag', description: 'Bring your own bag for all shopping trips today.', xpReward: 20, category: 'waste', icon: '🛍️' },
  { id: 'm12', title: 'Take a Shorter Shower', description: 'Reduce your shower time by 2 minutes and save water.', xpReward: 25, category: 'water', icon: '🚿' },
];

export function getDailyMissions(seed?: number): Mission[] {
  // Pick 3 missions deterministically based on date (or seed)
  const today = seed ?? new Date().getDate();
  const shuffled = [...MISSION_POOL].sort((a, b) => {
    const hashA = (a.id.charCodeAt(1) * 31 + today) % 100;
    const hashB = (b.id.charCodeAt(1) * 31 + today) % 100;
    return hashA - hashB;
  });
  return shuffled.slice(0, 3).map(m => ({ ...m, completed: false }));
}

// ── Achievements ─────────────────────────────────────────

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'First Steps', description: 'Complete your first mission', icon: '👣', unlocked: true, progress: 1, target: 1 },
  { id: 'a2', title: 'Green Week', description: 'Complete missions for 7 consecutive days', icon: '📅', unlocked: false, progress: 3, target: 7 },
  { id: 'a3', title: 'Energy Saver', description: 'Complete 5 energy-related missions', icon: '⚡', unlocked: true, progress: 5, target: 5 },
  { id: 'a4', title: 'Plastic-Free Hero', description: 'Complete 10 waste reduction missions', icon: '🦸', unlocked: false, progress: 4, target: 10 },
  { id: 'a5', title: 'Planet Guardian', description: 'Reach the Planet Guardian avatar stage', icon: '🌲', unlocked: false, progress: 2, target: 15 },
  { id: 'a6', title: 'Carbon Cutter', description: 'Save 100kg of CO₂ through missions', icon: '✂️', unlocked: false, progress: 42, target: 100 },
  { id: 'a7', title: 'Hydro Champion', description: 'Complete 5 water-saving missions', icon: '💧', unlocked: false, progress: 2, target: 5 },
];

// ── Default State ────────────────────────────────────────

export function createDefaultState(carbonScore?: number, potentialScore?: number): DashboardState {
  return {
    profile: {
      name: 'Alex',
      avatarStage: 'seed',
      level: 2,
      xp: 120,
      joinDate: '2026-06-07',
      carbonScore: carbonScore ?? 54,
      potentialScore: potentialScore ?? 91,
    },
    stats: {
      missionsCompleted: 8,
      currentStreak: 3,
      totalCO2Saved: 42,
      totalXP: 220,
      weeklyProgress: [2, 3, 1, 0, 3, 2, 0],
      carbonImprovement: 12,
    },
    dailyMissions: getDailyMissions(),
    achievements: [...DEFAULT_ACHIEVEMENTS],
  };
}

// ── LocalStorage Persistence ─────────────────────────────

const STORAGE_KEY = 'ecotwin_dashboard_v1';

export function loadDashboardState(carbonScore?: number, potentialScore?: number): DashboardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DashboardState;
      
      // Validate parsed data structure
      if (!parsed || !parsed.profile || !parsed.stats) {
        throw new Error('Invalid dashboard state structure');
      }

      // Ensure avatar stage is synced with level
      const stageConfig = getAvatarStageForLevel(parsed.profile.level);
      parsed.profile.avatarStage = stageConfig.stage;
      
      // Validate and sanitize scores
      if (carbonScore !== undefined && typeof carbonScore === 'number' && carbonScore >= 0 && carbonScore <= 100) {
        parsed.profile.carbonScore = carbonScore;
      }
      if (potentialScore !== undefined && typeof potentialScore === 'number' && potentialScore >= 0 && potentialScore <= 100) {
        parsed.profile.potentialScore = potentialScore;
      }
      
      return parsed;
    }
  } catch (error) {
    console.error('Error loading dashboard state:', error);
    // Corrupt data — reset
  }
  return createDefaultState(carbonScore, potentialScore);
}

export function saveDashboardState(state: DashboardState): void {
  try {
    // Validate state before saving
    if (!state || !state.profile || !state.stats) {
      throw new Error('Invalid dashboard state');
    }

    // Sanitize data to prevent storage issues
    const sanitizedState: DashboardState = {
      ...state,
      profile: {
        ...state.profile,
        name: String(state.profile.name).slice(0, 50), // Limit name length
        carbonScore: Math.max(0, Math.min(100, Number(state.profile.carbonScore) || 0)),
        potentialScore: Math.max(0, Math.min(100, Number(state.profile.potentialScore) || 0)),
        level: Math.max(1, Math.floor(Number(state.profile.level) || 1)),
        xp: Math.max(0, Math.floor(Number(state.profile.xp) || 0)),
      },
      stats: {
        ...state.stats,
        missionsCompleted: Math.max(0, Math.floor(Number(state.stats.missionsCompleted) || 0)),
        currentStreak: Math.max(0, Math.floor(Number(state.stats.currentStreak) || 0)),
        totalCO2Saved: Math.max(0, Number(state.stats.totalCO2Saved) || 0),
        totalXP: Math.max(0, Math.floor(Number(state.stats.totalXP) || 0)),
        carbonImprovement: Math.max(0, Math.min(100, Number(state.stats.carbonImprovement) || 0)),
      }
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedState));
  } catch (error) {
    console.error('Error saving dashboard state:', error);
    // Storage full or unavailable — silently fail
  }
}

// ── XP Award Helper ──────────────────────────────────────

export interface XPAwardResult {
  newXP: number;
  newLevel: number;
  newStage: AvatarStageConfig;
  leveledUp: boolean;
  stageChanged: boolean;
  previousStage: AvatarStageConfig;
}

export function awardXP(currentXP: number, currentLevel: number, xpAmount: number): XPAwardResult {
  const previousStage = getAvatarStageForLevel(currentLevel);
  let xp = currentXP + xpAmount;
  let level = currentLevel;
  let leveledUp = false;

  // Check for level ups (can multi-level)
  while (xp >= xpRequiredForLevel(level)) {
    xp -= xpRequiredForLevel(level);
    level += 1;
    leveledUp = true;
  }

  const newStage = getAvatarStageForLevel(level);
  const stageChanged = previousStage.stage !== newStage.stage;

  return {
    newXP: xp,
    newLevel: level,
    newStage,
    leveledUp,
    stageChanged,
    previousStage,
  };
}

// ── Environmental Impact Calculations ────────────────────

export interface EnvironmentalImpact {
  co2SavedKg: number;
  treesEquivalent: number;
  drivingKmAvoided: number;
  energySavedKwh: number;
}

export function calculateImpact(totalCO2SavedKg: number): EnvironmentalImpact {
  return {
    co2SavedKg: totalCO2SavedKg,
    treesEquivalent: Math.round(totalCO2SavedKg / 22),          // 1 tree ≈ 22kg CO₂/year
    drivingKmAvoided: Math.round(totalCO2SavedKg / 0.21 * 10) / 10, // avg car ≈ 0.21 kg/km
    energySavedKwh: Math.round(totalCO2SavedKg / 0.42 * 10) / 10,   // avg grid ≈ 0.42 kg/kWh
  };
}
