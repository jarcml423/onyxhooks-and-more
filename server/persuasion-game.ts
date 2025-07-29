import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface GameChallenge {
  id: string;
  level: 'urgency' | 'curiosity' | 'clarity';
  difficulty: 'starter' | 'pro' | 'vault';
  hookA: string;
  hookB: string;
  correctAnswer: 'A' | 'B';
  explanation: string;
  winnerReason: string;
  category: string;
}

export interface GameSession {
  sessionId: string;
  userId?: string;
  userTier: 'starter' | 'pro' | 'vault';
  challenges: GameChallenge[];
  currentChallengeIndex: number;
  score: number;
  maxScore: number;
  completed: boolean;
  startTime: Date;
  endTime?: Date;
  badge?: string;
}

export interface GameStats {
  totalPlayers: number;
  averageScore: number;
  topScore: number;
  monthlyWinners: string[];
  currentMonth: string;
}

// Track used combinations to prevent duplicates
const usedCombinations = new Set<string>();

// Helper function to create unique combination key
function createCombinationKey(hookA: string, hookB: string, level: string): string {
  return `${level}:${hookA.substring(0, 20)}:${hookB.substring(0, 20)}`;
}

// Helper function to get unused challenge
function getUnusedChallenge(challengePool: any[], level: string): any {
  const availableChallenges = challengePool.filter(challenge => {
    const key = createCombinationKey(challenge.hookA, challenge.hookB, level);
    return !usedCombinations.has(key);
  });
  
  // If all challenges have been used, reset the tracker for this level
  if (availableChallenges.length === 0) {
    challengePool.forEach(challenge => {
      const key = createCombinationKey(challenge.hookA, challenge.hookB, level);
      usedCombinations.delete(key);
    });
    return challengePool[Math.floor(Math.random() * challengePool.length)];
  }
  
  return availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
}

// Expanded challenge pool for variation - each game session randomly selects from these
const GAME_CHALLENGES = {
  starter: {
    urgency: [
      {
        hookA: "Transform your body in 90 days with our proven system",
        hookB: "Only 3 spots left: Transform your body in 90 days (closes Friday)",
        correct: 'B',
        explanation: "Hook B creates immediate urgency with scarcity (3 spots) and deadline (Friday)",
        category: "Fitness"
      },
      {
        hookA: "Learn piano from home at your own pace",
        hookB: "48 hours left: Master piano basics before our enrollment closes",
        correct: 'B',
        explanation: "Hook B adds time pressure that compels immediate action",
        category: "Education"
      },
      {
        hookA: "Join our business coaching program",
        hookB: "Warning: Only 5 spots remain before we close enrollment Tuesday at midnight",
        correct: 'B',
        explanation: "Hook B uses warning language with specific scarcity and precise deadline",
        category: "Business"
      },
      {
        hookA: "Get access to our premium course content",
        hookB: "Door closes in 72 hours: Get lifetime access for $97 (was $297)",
        correct: 'B',
        explanation: "Hook B combines countdown urgency with price anchoring",
        category: "Education"
      },
      {
        hookA: "Start your online business today",
        hookB: "Last call: 12 people signed up this morning, 3 spots left",
        correct: 'B',
        explanation: "Hook B shows real-time activity and immediate scarcity",
        category: "Business"
      },
      {
        hookA: "Improve your productivity with time management",
        hookB: "Tomorrow at 9AM: We remove the early bird pricing forever",
        correct: 'B',
        explanation: "Hook B creates specific deadline with loss aversion",
        category: "Productivity"
      }
    ],
    curiosity: [
      {
        hookA: "I made $10K last month selling online courses",
        hookB: "The weird $37 trick that made me $10K (most people ignore this)",
        correct: 'B',
        explanation: "Hook B creates curiosity gap with 'weird trick' and specific price point",
        category: "Business"
      },
      {
        hookA: "Lose weight with this simple diet plan",
        hookB: "The Japanese breakfast secret that melts 15 lbs (without exercise)",
        correct: 'B',
        explanation: "Hook B uses cultural intrigue and specific promise to create curiosity",
        category: "Health"
      },
      {
        hookA: "Double your email open rates with better subject lines",
        hookB: "Why I put [MISTAKE] in my subject line and got 47% opens",
        correct: 'B',
        explanation: "Hook B uses negative words and specific metrics to trigger curiosity",
        category: "Marketing"
      },
      {
        hookA: "Learn the secrets of successful entrepreneurs",
        hookB: "What my billionaire mentor whispered to me at 2AM (changed everything)",
        correct: 'B',
        explanation: "Hook B combines authority, specific timing, and transformation promise",
        category: "Business"
      },
      {
        hookA: "Build a profitable YouTube channel",
        hookB: "The backwards method that got me 100K subs (everyone does this wrong)",
        correct: 'B',
        explanation: "Hook B presents contrarian approach with proof and common mistake reference",
        category: "Content"
      },
      {
        hookA: "Master social media marketing strategies",
        hookB: "Why I deleted all my posts and gained 50K followers in 30 days",
        correct: 'B',
        explanation: "Hook B uses paradox (deleting to gain) with specific timeframe and results",
        category: "Social Media"
      }
    ],
    clarity: [
      {
        hookA: "Get better at sales and make more money",
        hookB: "Turn 3 out of 10 cold calls into $5K deals using the BOND method",
        correct: 'B',
        explanation: "Hook B provides specific metrics and named methodology",
        category: "Sales"
      },
      {
        hookA: "Build a successful online business",
        hookB: "Generate $3K monthly recurring revenue in 60 days with 2-hour workdays",
        correct: 'B',
        explanation: "Hook B offers specific outcomes, timeframe, and time commitment",
        category: "Entrepreneurship"
      },
      {
        hookA: "Learn effective leadership skills for your team",
        hookB: "How to conduct 15-minute weekly check-ins that boost team performance by 40%",
        correct: 'B',
        explanation: "Hook B gives exact time commitment and measurable outcome",
        category: "Leadership"
      },
      {
        hookA: "Build a successful coaching business",
        hookB: "Fill your calendar with $2K clients using the 3-2-1 content system",
        correct: 'B',
        explanation: "Hook B specifies price point and provides clear methodology",
        category: "Coaching"
      },
      {
        hookA: "Grow your email list and increase engagement",
        hookB: "Add 500 qualified subscribers weekly with 2 Instagram posts and 1 lead magnet",
        correct: 'B',
        explanation: "Hook B quantifies growth rate and exact action steps required",
        category: "Email Marketing"
      },
      {
        hookA: "Master public speaking and presentation skills",
        hookB: "Deliver confident 20-minute presentations using the STAR framework (no notes needed)",
        correct: 'B',
        explanation: "Hook B provides specific duration, methodology, and confidence-building outcome",
        category: "Public Speaking"
      }
    ]
  },
  pro: {
    urgency: [
      {
        hookA: "Last chance: Elite coaching program closes at midnight",
        hookB: "Warning: Only 7 elite coaching spots remain (3 already interviewed today)",
        correct: 'B',
        explanation: "Hook B combines scarcity with social proof and real-time activity",
        category: "Coaching"
      },
      {
        hookA: "Final day to join our exclusive mastermind",
        hookB: "Update: 2 spots filled this morning. 1 interview scheduled for 3pm.",
        correct: 'B',
        explanation: "Hook B creates urgency through real-time updates and specific activity",
        category: "Mastermind"
      },
      {
        hookA: "Limited-time offer: Get access to our premium business course",
        hookB: "Breaking: 47 applications submitted today. We're closing at exactly 100 (53 spots left)",
        correct: 'B',
        explanation: "Hook B shows real-time progress toward a specific closure trigger",
        category: "Business Education"
      },
      {
        hookA: "Exclusive workshop opportunity ending soon",
        hookB: "Live update: $127,000 in revenue generated by yesterday's attendees (next session in 48 hours)",
        correct: 'B',
        explanation: "Hook B combines social proof with results and specific timeline",
        category: "Workshop"
      },
      {
        hookA: "Don't miss out on this investment opportunity",
        hookB: "Alert: Fund at 87% capacity. $2.3M committed since Monday (closing Friday at $10M)",
        correct: 'B',
        explanation: "Hook B shows momentum toward capacity with specific financial targets",
        category: "Investment"
      },
      {
        hookA: "Last call for our business accelerator program",
        hookB: "Waitlist activated: 23 qualified candidates, 4 acceptance calls scheduled for tomorrow",
        correct: 'B',
        explanation: "Hook B shows competitive selection process with immediate activity",
        category: "Accelerator"
      }
    ],
    curiosity: [
      {
        hookA: "The counter-intuitive method billionaires use to stay wealthy",
        hookB: "Why Mark Cuban sleeps with his phone in airplane mode (and you should too)",
        correct: 'B',
        explanation: "Hook B uses specific celebrity example and unexpected behavior",
        category: "Wealth"
      },
      {
        hookA: "The psychological trigger that doubles conversion rates",
        hookB: "Why removing the buy button increased our sales by 340%",
        correct: 'B',
        explanation: "Hook B presents paradox with specific metrics",
        category: "Marketing"
      },
      {
        hookA: "Learn the advanced sales techniques top performers use",
        hookB: "Why I hang up on 80% of my prospects (and close 90% of the rest)",
        correct: 'B',
        explanation: "Hook B creates curiosity through contrarian behavior and impressive results",
        category: "Sales"
      },
      {
        hookA: "Discover the productivity secrets of successful entrepreneurs",
        hookB: "How working 3 days per week made me $500K more than working 7",
        correct: 'B',
        explanation: "Hook B presents paradoxical work-life strategy with specific financial outcome",
        category: "Productivity"
      },
      {
        hookA: "Master the hidden psychology behind high-converting content",
        hookB: "The forbidden word that makes customers buy 67% faster (banned in 3 countries)",
        correct: 'B',
        explanation: "Hook B uses forbidden/banned intrigue with specific conversion metrics",
        category: "Psychology"
      },
      {
        hookA: "Unlock the networking strategies that build million-dollar relationships",
        hookB: "Why I give away $10,000 at every networking event (and get $100K back)",
        correct: 'B',
        explanation: "Hook B reveals counterintuitive investment strategy with ROI mystery",
        category: "Networking"
      }
    ],
    clarity: [
      {
        hookA: "Scale your agency to 7 figures using our proven blueprint",
        hookB: "How to hire 3 A-players, systemize client delivery, and hit $100K months in Q1",
        correct: 'B',
        explanation: "Hook B breaks down specific steps and timeline",
        category: "Agency"
      },
      {
        hookA: "Master advanced copywriting techniques for higher conversions",
        hookB: "Use the 4-3-2-1 formula to write headlines that convert 23% better",
        correct: 'B',
        explanation: "Hook B provides specific framework and measurable result",
        category: "Copywriting"
      },
      {
        hookA: "Increase your revenue with better pricing strategies",
        hookB: "Implement value-based pricing to charge $15K for $3K deliverables using the worth-gap method",
        correct: 'B',
        explanation: "Hook B provides specific pricing transformation and named methodology",
        category: "Pricing"
      },
      {
        hookA: "Build authority in your industry through content marketing",
        hookB: "Become the #1 LinkedIn voice in your niche with 3 posts per week using the EPIC framework",
        correct: 'B',
        explanation: "Hook B specifies platform dominance, frequency, and framework",
        category: "Authority Building"
      },
      {
        hookA: "Optimize your sales funnel for better conversions",
        hookB: "Convert 47% of website visitors using the AIDA-sequence with 3 specific touchpoints",
        correct: 'B',
        explanation: "Hook B provides conversion rate target, methodology, and specific structure",
        category: "Conversion Optimization"
      },
      {
        hookA: "Create better content for your audience engagement",
        hookB: "Generate 10,000 engaged followers using the Hook-Story-Close method in 90 days",
        correct: 'B',
        explanation: "Hook B specifies follower target, engagement quality, method, and timeframe",
        category: "Content Strategy"
      }
    ]
  },
  vault: {
    urgency: [
      {
        hookA: "This private equity opportunity closes when we reach $50M committed capital",
        hookB: "Confidential: $47.3M committed. Remaining $2.7M allocated by Friday 5PM EST",
        correct: 'B',
        explanation: "Hook B shows exact proximity to closure with specific deadline",
        category: "Investment"
      },
      {
        hookA: "Limited partnership opening for qualified investors only",
        hookB: "Alert: Position 23 of 25 filled. Qualification call with managing partner required by Thursday",
        correct: 'B',
        explanation: "Hook B demonstrates exclusivity with precise positioning and process",
        category: "Finance"
      },
      {
        hookA: "Exclusive family office investment allocation available",
        hookB: "Confidential: $340M deployment target. $23M allocated since Tuesday. Window closes when institutional investor commits (expected this week)",
        correct: 'B',
        explanation: "Hook B shows specific progress with external competitive pressure",
        category: "Family Office"
      },
      {
        hookA: "Strategic acquisition opportunity for qualified buyers",
        hookB: "Urgent: $2.8B enterprise value. 2 strategic buyers submitted LOIs. Final bids due Monday 9AM EST",
        correct: 'B',
        explanation: "Hook B creates competitive urgency with specific deadline and buyer activity",
        category: "M&A"
      },
      {
        hookA: "Limited allocation in our institutional-grade fund",
        hookB: "Breaking: $127M fund closure accelerated. CalPERS committed $45M yesterday. Final $15M reserved for 3 qualified allocators (decisions by Wednesday)",
        correct: 'B',
        explanation: "Hook B uses institutional validation with accelerated timeline",
        category: "Institutional Investment"
      },
      {
        hookA: "Exclusive partnership opportunity in emerging markets",
        hookB: "Classified: Sovereign wealth fund partnership pending. $500M commitment window closes if regulatory approval received (announcement expected this quarter)",
        correct: 'B',
        explanation: "Hook B creates government-level urgency with regulatory dependency",
        category: "Sovereign Investment"
      }
    ],
    curiosity: [
      {
        hookA: "The negotiation tactic that added $50M to our last acquisition",
        hookB: "Why we intentionally mispronounced their CEO's name in the final meeting (it worked)",
        correct: 'B',
        explanation: "Hook B reveals unexpected strategy with high-stakes context",
        category: "M&A"
      },
      {
        hookA: "The hedge fund strategy that survived 2008 and 2020 market crashes",
        hookB: "How losing $10M in 2008 led to the discovery that made us $340M",
        correct: 'B',
        explanation: "Hook B transforms loss into massive win with specific figures",
        category: "Finance"
      },
      {
        hookA: "The wealth preservation strategy used by family offices globally",
        hookB: "Why Warren Buffett's accountant called this tax move 'financial suicide' (then copied it)",
        correct: 'B',
        explanation: "Hook B uses authority contradiction and insider knowledge intrigue",
        category: "Tax Strategy"
      },
      {
        hookA: "Advanced portfolio construction for institutional investors",
        hookB: "The 'forbidden' asset class that outperformed the S&P by 847% (regulators hate it)",
        correct: 'B',
        explanation: "Hook B creates curiosity with regulatory controversy and extreme performance",
        category: "Alternative Investments"
      },
      {
        hookA: "Private equity strategies for maximizing portfolio company value",
        hookB: "How we destroyed a $2B company to make $5B (the board called us crazy)",
        correct: 'B',
        explanation: "Hook B reveals counterintuitive destruction-to-creation strategy",
        category: "Private Equity"
      },
      {
        hookA: "The capital allocation methods that generate alpha in any market",
        hookB: "Why Blackstone's founder sold everything in March 2020 (and bought it back in April)",
        correct: 'B',
        explanation: "Hook B uses specific timing mystery and institutional authority",
        category: "Market Timing"
      }
    ],
    clarity: [
      {
        hookA: "Build a billion-dollar company using these enterprise strategies",
        hookB: "How to structure Series B terms, negotiate board composition, and maintain founder control through IPO",
        correct: 'B',
        explanation: "Hook B outlines specific stages and control mechanisms",
        category: "Venture"
      },
      {
        hookA: "Advanced capital allocation strategies for high-net-worth individuals",
        hookB: "Deploy $10M+ across 4 asset classes with 12% target returns and <8% maximum drawdown",
        correct: 'B',
        explanation: "Hook B provides specific allocation parameters and risk metrics",
        category: "Wealth Management"
      },
      {
        hookA: "Scale your portfolio company operations for maximum returns",
        hookB: "Implement the 3-pillar operational framework to increase portfolio company EBITDA by 340% in 18 months",
        correct: 'B',
        explanation: "Hook B specifies methodology, metric improvement, and timeframe",
        category: "Private Equity"
      },
      {
        hookA: "Master institutional-grade investment strategies",
        hookB: "Execute the Yale Endowment model: 70% alternatives, 30% liquid with 15%+ net returns",
        correct: 'B',
        explanation: "Hook B provides specific allocation model, percentages, and target returns",
        category: "Institutional Investing"
      },
      {
        hookA: "Build strategic acquisition pipelines for growth",
        hookB: "Source, evaluate, and close 3 strategic acquisitions per quarter using the SCORE due diligence matrix",
        correct: 'B',
        explanation: "Hook B quantifies acquisition velocity, process, and methodology",
        category: "M&A Strategy"
      },
      {
        hookA: "Optimize tax strategies for ultra-high-net-worth families",
        hookB: "Reduce estate tax liability by $50M+ using family office structures and generation-skipping trusts",
        correct: 'B',
        explanation: "Hook B specifies savings amount and exact tax optimization vehicles",
        category: "Tax Strategy"
      }
    ]
  }
};

export async function generateGameChallenge(
  level: 'urgency' | 'curiosity' | 'clarity',
  difficulty: 'starter' | 'pro' | 'vault'
): Promise<GameChallenge> {
  const challengePool = GAME_CHALLENGES[difficulty][level];
  const randomChallenge = getUnusedChallenge(challengePool, level);
  
  // Mark this combination as used
  const combinationKey = createCombinationKey(randomChallenge.hookA, randomChallenge.hookB, level);
  usedCombinations.add(combinationKey);
  
  const challengeId = `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: challengeId,
    level,
    difficulty,
    hookA: randomChallenge.hookA,
    hookB: randomChallenge.hookB,
    correctAnswer: randomChallenge.correct,
    explanation: randomChallenge.explanation,
    winnerReason: randomChallenge.explanation,
    category: randomChallenge.category
  };
}

export async function createGameSession(userTier: 'starter' | 'pro' | 'vault', userId?: string): Promise<GameSession> {
  const sessionId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Generate 3 challenges (one for each level) ensuring no duplicates
  const challenges: GameChallenge[] = [];
  const levels: ('urgency' | 'curiosity' | 'clarity')[] = ['urgency', 'curiosity', 'clarity'];
  
  // Shuffle levels to add variety to game order
  const shuffledLevels = levels.sort(() => Math.random() - 0.5);
  
  for (const level of shuffledLevels) {
    const challenge = await generateGameChallenge(level, userTier);
    challenges.push(challenge);
  }
  
  return {
    sessionId,
    userId,
    userTier,
    challenges,
    currentChallengeIndex: 0,
    score: 0,
    maxScore: challenges.length,
    completed: false,
    startTime: new Date()
  };
}

export function submitGameAnswer(
  session: GameSession,
  challengeId: string,
  answer: 'A' | 'B'
): { correct: boolean; explanation: string; newScore: number } {
  const challenge = session.challenges.find(c => c.id === challengeId);
  
  if (!challenge) {
    throw new Error('Challenge not found');
  }
  
  const correct = answer === challenge.correctAnswer;
  
  if (correct) {
    session.score += 1;
  }
  
  session.currentChallengeIndex += 1;
  
  if (session.currentChallengeIndex >= session.challenges.length) {
    session.completed = true;
    session.endTime = new Date();
    
    // Award badge for perfect score
    if (session.score === session.maxScore) {
      session.badge = getMonthlyBadge();
    }
  }
  
  return {
    correct,
    explanation: challenge.explanation,
    newScore: session.score
  };
}

export function getMonthlyBadge(): string {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const currentDate = new Date();
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  
  return `Persuasion Master - ${monthName} ${year}`;
}

export function getGameStats(): GameStats {
  // Mock stats for now - in production, this would query the database
  return {
    totalPlayers: 1247,
    averageScore: 2.3,
    topScore: 3,
    monthlyWinners: ['Elite_Strategist', 'Conversion_King', 'Hook_Master'],
    currentMonth: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  };
}

export function canPlayGame(userTier: 'free' | 'starter' | 'pro' | 'vault'): boolean {
  // Free tier cannot access the game
  return userTier !== 'free';
}

export function getGameLimits(userTier: 'starter' | 'pro' | 'vault'): { playsPerMonth: number; currentPlays: number } {
  // Monthly access token - one play per month for all tiers
  return {
    playsPerMonth: 1,
    currentPlays: 0 // This would be fetched from database in production
  };
}