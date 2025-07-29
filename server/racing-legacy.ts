/**
 * Racing Legacy Context - The DNA Behind the 9-Second Challenge
 *
 * The creator of this app is a former motorcycle drag racer, who piloted 200+ MPH machines down the 1/4 mile strip.
 * At that level, races are often won or lost in under 9 seconds — every millisecond counts.
 *
 * This background of elite racing precision, adrenaline-fueled launches, and ruthless focus on speed is now baked
 * into the *very DNA* of the OnyxHooks platform.
 *
 * The "9 Second Challenge" isn't just a marketing gimmick — it's a callout to that racing heritage:
 * - Launch faster than your competitors.
 * - Accelerate your brand at NOS-fueled velocity.
 * - Win the content race before others even shift into gear.
 *
 * Just like the founder used to sit at the line, NOS bottle purging, focused on perfect reaction time —
 * this app helps creators do the same with conversion hooks.
 *
 * The NOS bottle submit button. The purge sound. The quarter-mile leaderboard.
 * It all honors that racing pedigree and turns every content creator into a high-performance driver.
 *
 * This isn't just about automation. It's about execution, *under pressure*, at launch speed.
 */

export interface ChallengeConfig {
  challengeActive: boolean;
  currentChallengeCycle: string;
  challengeStartDate: Date | null;
  challengeEndDate: Date | null;
  maxAttemptsPerCycle: number;
}

export interface ChallengeStats {
  totalEntries: number;
  averageTime: number;
  fastestTime: number;
  userRank?: number;
  userBestTime?: number;
  attemptsRemaining: number;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  timeToGenerate: number;
  timeFormatted: string;
  tier: string;
  isCurrentUser?: boolean;
}

// Generate current challenge cycle based on quarter
export function getCurrentChallengeCycle(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns 0-11
  
  let quarter: number;
  if (month >= 1 && month <= 3) quarter = 1;
  else if (month >= 4 && month <= 6) quarter = 2;
  else if (month >= 7 && month <= 9) quarter = 3;
  else quarter = 4;
  
  return `Q${quarter}-${year}`;
}

// Calculate challenge dates for the current quarter
export function getChallengeDates(cycle: string): { startDate: Date; endDate: Date } {
  const [quarter, year] = cycle.split('-');
  const quarterNum = parseInt(quarter.replace('Q', ''));
  const yearNum = parseInt(year);
  
  // Challenge starts on first day of quarter
  let startMonth: number;
  switch (quarterNum) {
    case 1: startMonth = 0; break; // January
    case 2: startMonth = 3; break; // April
    case 3: startMonth = 6; break; // July
    case 4: startMonth = 9; break; // October
    default: startMonth = 0;
  }
  
  const startDate = new Date(yearNum, startMonth, 1);
  
  // Challenge runs for 30 days
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 30);
  
  return { startDate, endDate };
}

// Format milliseconds to racing time format (e.g., "7.832s")
export function formatRacingTime(milliseconds: number): string {
  const seconds = milliseconds / 1000;
  return `${seconds.toFixed(3)}s`;
}

// Check if user is eligible for challenge (All 4 tiers)
export function isEligibleForChallenge(userTier: string): boolean {
  return ['free', 'starter', 'pro', 'vault'].includes(userTier);
}

// Get tier-specific challenge attempt limits (separate from hook generation quotas)
export function getChallengeAttempts(userTier: string): number {
  const tierLimits = {
    free: 2,      // Free tier gets 2 challenge attempts per cycle
    starter: 25,  // Starter tier gets 25 challenge attempts per cycle
    pro: 50,      // Pro tier gets 50 challenge attempts per cycle
    vault: 100    // Vault tier gets 100 challenge attempts per cycle
  };
  
  return tierLimits[userTier as keyof typeof tierLimits] || 2;
}

// NOS purge sound effect configuration
export const NOS_PURGE_SOUND = {
  url: '/sounds/nos-purge.mp3', // We'll create this asset
  duration: 800, // milliseconds
  volume: 0.7
};

// Racing-themed messages for different time ranges
export function getRacingMessage(timeMs: number): string {
  const seconds = timeMs / 1000;
  
  if (seconds < 5) {
    return "🏆 LAUNCH SPEED! You hit the line like a pro racer!";
  } else if (seconds < 7) {
    return "🔥 NOS TERRITORY! That's championship-level reaction time!";
  } else if (seconds < 9) {
    return "⚡ SOLID RUN! You're in the quarter-mile elite zone!";
  } else if (seconds < 12) {
    return "🎯 GOOD LAUNCH! Keep practicing your staging technique!";
  } else {
    return "🏁 CROSSED THE LINE! Every racer starts somewhere - go again!";
  }
}

// Challenge cycle timing rules
export const CHALLENGE_TIMING = {
  ACTIVE_DURATION_DAYS: 30,
  REST_PERIOD_DAYS: 60,
  QUARTERS_PER_YEAR: 4,
  MAX_ATTEMPTS_PER_CYCLE: 2
};