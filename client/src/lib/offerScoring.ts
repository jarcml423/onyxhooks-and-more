// Offer Strength Quiz Scoring Logic

export interface QuizAnswer {
  questionId: number;
  value: number;
  text: string;
}

export interface QuizResult {
  score: number;
  tier: 'free' | 'starter' | 'pro' | 'vault';
  recommendation: {
    title: string;
    message: string;
    council: string;
  };
}

export const quizQuestions = [
  {
    id: 1,
    question: "What is the outcome your offer delivers?",
    answers: [
      { value: 0, text: "No clear outcome" },
      { value: 5, text: "General improvement" },
      { value: 10, text: "Tangible benefit" },
      { value: 20, text: "Specific, measurable transformation" }
    ]
  },
  {
    id: 2,
    question: "How urgent is the problem your offer solves?",
    answers: [
      { value: 0, text: "It's optional or 'nice to have'" },
      { value: 5, text: "Relevant, but not critical" },
      { value: 10, text: "Frustrating for my audience" },
      { value: 20, text: "Solves a pain that's costly or painful to delay" }
    ]
  },
  {
    id: 3,
    question: "What's your pricing strategy?",
    answers: [
      { value: 0, text: "Time-based or hourly" },
      { value: 5, text: "Flat fee" },
      { value: 15, text: "Value-based or outcome pricing" },
      { value: 20, text: "High-ticket transformation w/ payment plan" }
    ]
  },
  {
    id: 4,
    question: "How dialed in is your niche?",
    answers: [
      { value: 0, text: "Very broad market" },
      { value: 5, text: "Somewhat defined" },
      { value: 10, text: "Clear persona or profession" },
      { value: 20, text: "Hyper-specific niche w/ clear pain" }
    ]
  },
  {
    id: 5,
    question: "How premium is your positioning?",
    answers: [
      { value: 0, text: "I'm the cheap option" },
      { value: 5, text: "I price competitively" },
      { value: 10, text: "I frame myself as premium" },
      { value: 20, text: "I lead with authority and transformation" }
    ]
  },
  {
    id: 6,
    question: "What's your CTA or sales flow like today?",
    answers: [
      { value: 0, text: "I don't have one" },
      { value: 5, text: "I use a general contact form" },
      { value: 10, text: "I have a landing page or booking link" },
      { value: 20, text: "I use a compelling CTA with urgency/scarcity" }
    ]
  }
];

export function calculateQuizScore(answers: QuizAnswer[]): QuizResult {
  const rawScore = answers.reduce((sum, answer) => sum + answer.value, 0);
  // Cap score at 100 maximum
  const totalScore = Math.min(rawScore, 100);
  
  let tier: 'free' | 'starter' | 'pro' | 'vault';
  let recommendation: { title: string; message: string; council: string };

  // Updated scoring ranges: 0–25 Free, 26–50 Starter, 51–75 Pro, 76–100 Vault
  if (totalScore >= 0 && totalScore <= 25) {
    tier = 'free';
    recommendation = {
      title: "Free Tier Recommended",
      message: "You've got the spark — let's shape it into a scalable offer. Start with Free to refine your foundation.",
      council: "Foundation Council"
    };
  } else if (totalScore >= 26 && totalScore <= 50) {
    tier = 'starter';
    recommendation = {
      title: "Starter Tier Recommended",
      message: "Your offer shows promise with solid fundamentals. Starter tier gives you the tools to optimize and scale.",
      council: "Builder Council"
    };
  } else if (totalScore >= 51 && totalScore <= 75) {
    tier = 'pro';
    recommendation = {
      title: "Pro Tier Recommended", 
      message: "Your offer has strong potential — let's maximize it. Pro gives you advanced tools to accelerate growth.",
      council: "Elite Council"
    };
  } else if (totalScore >= 76 && totalScore <= 100) {
    tier = 'vault';
    recommendation = {
      title: "Vault Tier Recommended",
      message: "Your offer is sophisticated and market-ready. Vault tier unlocks elite-level frameworks and advanced positioning strategies.",
      council: "Vault Council"
    };
  } else {
    // Fallback for edge cases
    tier = 'free';
    recommendation = {
      title: "Free Tier Recommended",
      message: "Let's start building your foundation.",
      council: "Alex & Sabri"
    };
  }

  return {
    score: totalScore,
    tier,
    recommendation
  };
}

export function getTierColor(tier: 'free' | 'pro' | 'vault'): string {
  switch (tier) {
    case 'free':
      return 'text-green-600';
    case 'pro':
      return 'text-blue-600';
    case 'vault':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
}

export function getTierBadgeColor(tier: 'free' | 'pro' | 'vault'): string {
  switch (tier) {
    case 'free':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pro':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'vault':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}