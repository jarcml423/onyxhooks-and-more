import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Hook Scoring Interfaces
export interface HookScorecard {
  clarity: number;          // /20 - Can a 5th grader understand it instantly?
  curiosity: number;        // /20 - Does it open a loop or spark desire?
  relevance: number;        // /20 - Does it speak to reader's pain/goal?
  urgency: number;          // /20 - Sense of "this matters NOW"?
  specificity: number;      // /20 - Facts, numbers, contrast, visual clarity?
  total: number;           // /100
  councilNotes?: string;
  improvementSuggestions?: string[];
}

// Offer Scoring Interfaces (Hormozi Value Equation + Stack Logic)
export interface OfferScorecard {
  dreamOutcome: number;         // /20 - Big, believable, emotionally powerful?
  likelihoodOfSuccess: number;  // /15 - Believable outcome? Testimonials/guarantees?
  timeToResults: number;        // /15 - Fast results? Quick value?
  effortAndSacrifice: number;   // /10 - Frictionless? Easy to complete?
  riskReversal: number;         // /10 - Risk-free? Refunds/guarantees?
  valueStack: number;           // /10 - Bonuses, templates, toolkits?
  priceFraming: number;         // /10 - Clear ROI? Smart comparisons?
  messagingClarity: number;     // /10 - Crisp copy, no jargon?
  total: number;               // /100
  councilNotes?: string;
  improvementSuggestions?: string[];
}

export interface CouncilAgentScore {
  agentName: string;
  agentRole: string;
  scores: Partial<HookScorecard | OfferScorecard>;
  justification: string;
  rewriteSuggestion?: string;
}

export interface ScoredHookResult {
  originalHook: string;
  scorecard: HookScorecard;
  councilFeedback: CouncilAgentScore[];
  alexUpgrade?: {
    text: string;
    score: number;
    reasoning: string;
  };
  michaelNotes?: string;
}

export interface ScoredOfferResult {
  originalOffer: any;
  scorecard: OfferScorecard;
  councilFeedback: CouncilAgentScore[];
  alexUpgrade?: {
    offer: any;
    score: number;
    reasoning: string;
  };
  michaelNotes?: string;
}

// Council Agent Scoring Functions
export async function scoreHookWithCouncil(
  hook: string, 
  userTier: 'free' | 'pro' | 'vault',
  context?: { coachType?: string; industry?: string; targetAudience?: string }
): Promise<ScoredHookResult> {
  try {
    // Determine active council based on tier
    const activeCouncil = getActiveCouncilForTier(userTier);
    
    // Get council scores for each agent
    const councilFeedback: CouncilAgentScore[] = [];
    
    for (const agent of activeCouncil) {
      const agentScore = await getAgentHookScore(hook, agent, context);
      councilFeedback.push(agentScore);
    }
    
    // Calculate composite scorecard
    const scorecard = calculateCompositeHookScore(councilFeedback);
    
    // Michael's closing analysis (Pro/Vault only)
    let michaelNotes: string | undefined;
    if (userTier !== 'free') {
      michaelNotes = await getMichaelAnalysis(hook, scorecard, 'hook');
    }
    
    // Alex's upgrade (Vault only)
    let alexUpgrade;
    if (userTier === 'vault' && scorecard.total < 90) {
      alexUpgrade = await getAlexHookUpgrade(hook, scorecard, councilFeedback, michaelNotes);
    }
    
    return {
      originalHook: hook,
      scorecard,
      councilFeedback,
      alexUpgrade,
      michaelNotes
    };
    
  } catch (error) {
    throw new Error("Failed to score hook with council: " + (error as Error).message);
  }
}

export async function scoreOfferWithCouncil(
  offer: any,
  userTier: 'free' | 'pro' | 'vault',
  context?: { coachType?: string; industry?: string; targetAudience?: string }
): Promise<ScoredOfferResult> {
  try {
    const activeCouncil = getActiveCouncilForTier(userTier);
    const councilFeedback: CouncilAgentScore[] = [];
    
    for (const agent of activeCouncil) {
      const agentScore = await getAgentOfferScore(offer, agent, context);
      councilFeedback.push(agentScore);
    }
    
    const scorecard = calculateCompositeOfferScore(councilFeedback);
    
    let michaelNotes: string | undefined;
    if (userTier !== 'free') {
      michaelNotes = await getMichaelAnalysis(offer, scorecard, 'offer');
    }
    
    let alexUpgrade;
    if (userTier === 'vault' && scorecard.total < 90) {
      alexUpgrade = await getAlexOfferUpgrade(offer, scorecard, councilFeedback, michaelNotes);
    }
    
    return {
      originalOffer: offer,
      scorecard,
      councilFeedback,
      alexUpgrade,
      michaelNotes
    };
    
  } catch (error) {
    throw new Error("Failed to score offer with council: " + (error as Error).message);
  }
}

// Helper Functions
function getActiveCouncilForTier(tier: 'free' | 'pro' | 'vault'): string[] {
  switch (tier) {
    case 'free':
      return ['forge'];
    case 'pro':
      return ['sabien', 'blaze', 'mosaic'];
    case 'vault':
      return ['sabien', 'blaze', 'mosaic', 'methodus', 'runrail', 'michael'];
    default:
      return ['forge'];
  }
}

async function getAgentHookScore(
  hook: string, 
  agentName: string, 
  context?: any
): Promise<CouncilAgentScore> {
  const agentPrompts = {
    forge: "You are Forge, foundation strategy expert. Evaluate this hook for clarity and effectiveness.",
    sabien: "You are Sabien, persuasion psychology expert. Evaluate emotional triggers and curiosity gaps.",
    blaze: "You are Blaze, conversion optimization expert. Focus on urgency and action-driving elements.",
    mosaic: "You are Mosaic, market analysis expert. Evaluate relevance and audience alignment.",
    methodus: "You are Methodus, neuromarketing expert. Analyze psychological triggers and cognitive biases.",
    runrail: "You are Runrail, systematic optimization expert. Focus on testing potential and specificity.",
    michael: "You are Michael, the closer. Evaluate overall conversion potential and deal-closing power."
  };

  const prompt = `${agentPrompts[agentName as keyof typeof agentPrompts]}

Score this hook across these dimensions (0-20 each):
- Clarity: Can a 5th grader understand it instantly?
- Curiosity: Does it open a loop or spark desire?
- Relevance: Does it speak to the reader's pain/goal?
- Urgency: Is there a sense "this matters NOW"?
- Specificity: Facts, numbers, contrast, visual clarity?

Hook: "${hook}"
${context ? `Context: ${JSON.stringify(context)}` : ''}

Provide your scoring with justification and improvement suggestion.

Respond with JSON: {
  "clarity": number,
  "curiosity": number,
  "relevance": number,
  "urgency": number,
  "specificity": number,
  "justification": "why you scored this way",
  "rewriteSuggestion": "specific improvement"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  return {
    agentName,
    agentRole: agentPrompts[agentName as keyof typeof agentPrompts].split(',')[1] || agentName,
    scores: result,
    justification: result.justification || "",
    rewriteSuggestion: result.rewriteSuggestion
  };
}

async function getAgentOfferScore(
  offer: any,
  agentName: string,
  context?: any
): Promise<CouncilAgentScore> {
  const prompt = `As ${agentName}, score this offer using the Hormozi Value Equation:

Offer: ${JSON.stringify(offer)}

Score these dimensions:
- Dream Outcome (/20): Big, believable, emotionally powerful?
- Likelihood of Success (/15): Believable? Testimonials/guarantees?
- Time to Results (/15): Fast results? Quick value?
- Effort & Sacrifice (/10): Frictionless? Easy to complete?
- Risk Reversal (/10): Risk-free? Refunds/guarantees?
- Value Stack (/10): Bonuses, templates, toolkits?
- Price Framing (/10): Clear ROI? Smart comparisons?
- Messaging Clarity (/10): Crisp copy, no jargon?

Respond with JSON: {
  "dreamOutcome": number,
  "likelihoodOfSuccess": number,
  "timeToResults": number,
  "effortAndSacrifice": number,
  "riskReversal": number,
  "valueStack": number,
  "priceFraming": number,
  "messagingClarity": number,
  "justification": "your analysis",
  "rewriteSuggestion": "specific improvement"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  return {
    agentName,
    agentRole: agentName,
    scores: result,
    justification: result.justification || "",
    rewriteSuggestion: result.rewriteSuggestion
  };
}

function calculateCompositeHookScore(councilFeedback: CouncilAgentScore[]): HookScorecard {
  const dimensions = ['clarity', 'curiosity', 'relevance', 'urgency', 'specificity'];
  const scores: any = {};
  
  dimensions.forEach(dim => {
    const agentScores = councilFeedback
      .map(agent => (agent.scores as any)[dim])
      .filter(score => typeof score === 'number');
    scores[dim] = Math.round(agentScores.reduce((sum, score) => sum + score, 0) / agentScores.length);
  });
  
  const total = Object.values(scores).reduce((sum: number, score: any) => sum + score, 0);
  
  return {
    ...scores,
    total,
    councilNotes: councilFeedback.map(agent => `${agent.agentName}: ${agent.justification}`).join(' | '),
    improvementSuggestions: councilFeedback.map(agent => agent.rewriteSuggestion).filter(Boolean)
  };
}

function calculateCompositeOfferScore(councilFeedback: CouncilAgentScore[]): OfferScorecard {
  const dimensions = [
    'dreamOutcome', 'likelihoodOfSuccess', 'timeToResults', 'effortAndSacrifice',
    'riskReversal', 'valueStack', 'priceFraming', 'messagingClarity'
  ];
  const scores: any = {};
  
  dimensions.forEach(dim => {
    const agentScores = councilFeedback
      .map(agent => (agent.scores as any)[dim])
      .filter(score => typeof score === 'number');
    scores[dim] = Math.round(agentScores.reduce((sum, score) => sum + score, 0) / agentScores.length);
  });
  
  const total = Object.values(scores).reduce((sum: number, score: any) => sum + score, 0);
  
  return {
    ...scores,
    total,
    councilNotes: councilFeedback.map(agent => `${agent.agentName}: ${agent.justification}`).join(' | '),
    improvementSuggestions: councilFeedback.map(agent => agent.rewriteSuggestion).filter(Boolean)
  };
}

async function getMichaelAnalysis(content: any, scorecard: any, type: 'hook' | 'offer'): Promise<string> {
  const prompt = `You are Michael, the closer. Analyze this ${type} scoring and provide deal-closing insights:

${type === 'hook' ? `Hook: "${content}"` : `Offer: ${JSON.stringify(content)}`}
Scorecard: ${JSON.stringify(scorecard)}

Focus on:
- What's holding back conversion?
- Deal-breaking gaps in trust, urgency, or ROI?
- Is this asset "launchable" or needs rewrites?

Provide tactical, closer-focused feedback in 2-3 sentences.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content || "";
}

async function getAlexHookUpgrade(
  hook: string,
  scorecard: HookScorecard,
  councilFeedback: CouncilAgentScore[],
  michaelNotes?: string
): Promise<{ text: string; score: number; reasoning: string }> {
  const prompt = `You are Alex, the master strategist. Rewrite this hook to score 95-100 based on council feedback:

Original Hook: "${hook}"
Current Score: ${scorecard.total}/100
Council Feedback: ${JSON.stringify(councilFeedback)}
Michael's Notes: ${michaelNotes}

Rewrite the hook to:
1. Fix the lowest-scoring dimensions
2. Add contrast, urgency, and specificity
3. Make it sharper and more conversion-focused

Provide 2 versions: one for social media, one for landing pages.

Respond with JSON: {
  "socialMediaVersion": "optimized hook for social",
  "landingPageVersion": "optimized hook for landing page",
  "estimatedScore": number,
  "reasoning": "why this version wins"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  return {
    text: result.socialMediaVersion || result.landingPageVersion || hook,
    score: result.estimatedScore || 95,
    reasoning: result.reasoning || "Optimized based on council feedback"
  };
}

async function getAlexOfferUpgrade(
  offer: any,
  scorecard: OfferScorecard,
  councilFeedback: CouncilAgentScore[],
  michaelNotes?: string
): Promise<{ offer: any; score: number; reasoning: string }> {
  const prompt = `You are Alex, the master strategist. Upgrade this offer to score 95-100:

Original Offer: ${JSON.stringify(offer)}
Current Score: ${scorecard.total}/100
Council Feedback: ${JSON.stringify(councilFeedback)}
Michael's Notes: ${michaelNotes}

Improve the offer structure, value stack, and messaging to maximize conversion.

Respond with JSON: {
  "upgradedOffer": { complete improved offer structure },
  "estimatedScore": number,
  "reasoning": "strategic improvements made"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  return {
    offer: result.upgradedOffer || offer,
    score: result.estimatedScore || 95,
    reasoning: result.reasoning || "Optimized based on council feedback"
  };
}