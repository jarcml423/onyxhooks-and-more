import OpenAI from "openai";
import { scoreHookWithCouncil, scoreOfferWithCouncil, type ScoredHookResult, type ScoredOfferResult } from "./scoring-system";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CouncilInput {
  coachType: string;
  offerType: string;
  tonePreference?: string;
  painPoint?: string;
  challengeFaced?: string;
  desiredFeeling?: string;
  userTier: 'free' | 'starter' | 'pro' | 'vault';
  quizScore?: number;
}

export interface CouncilOutput {
  hook: string;
  problem: string;
  promise: string;
  cta: string;
  offerName: string;
  priceRange: string;
  conversionScore?: number;
  councilFeedback?: string;
  isCouncilBacked?: boolean;
  scoredResult?: ScoredOfferResult;
}

// Council Agent Definitions
const COUNCIL_AGENTS = {
  forge: {
    name: "🧠 Forge",
    role: "Foundation Strategy",
    expertise: "Simplifies complex offers into clear, actionable frameworks"
  },
  sabien: {
    name: "💡 Sabien", 
    role: "Persuasion Psychology",
    expertise: "Layered persuasion, social proof cues, emotional stack triggers"
  },
  mosaic: {
    name: "🔍 Mosaic",
    role: "Market Analysis", 
    expertise: "Audience segmentation, niche-specific messaging, competitive positioning"
  },
  blaze: {
    name: "🔥 Blaze",
    role: "Conversion Optimization",
    expertise: "CTA optimization, urgency creation, scarcity psychology"
  },
  methodus: {
    name: "🎯 Methodus",
    role: "Neuromarketing Logic",
    expertise: "Advanced behavioral triggers, cognitive biases, decision-making psychology"
  },
  runrail: {
    name: "🛠 Runrail", 
    role: "Systematic Implementation",
    expertise: "A/B testing frameworks, systematic optimization, data-driven refinement"
  },
  michael: {
    name: "✅ Michael",
    role: "The Closer",
    expertise: "Final conversion touches, objection handling, closing psychology"
  }
};

// Tier-based prompt enhancement
function getTierSystemPrompt(tier: 'free' | 'starter' | 'pro' | 'vault'): string {
  const basePrompt = `You are a world-class offer strategist trained in 1,000+ high-performing coaching funnels. Your job is to act like a revenue-focused copy mentor guiding a coach through building an irresistible offer. Use proven formulas (Hook → Problem → Promise → CTA). Prioritize clarity, emotion, and uniqueness. Avoid fluff.`;

  switch (tier) {
    case 'free':
      return `${basePrompt} This user is new — simplify explanations, but still make the copy punchy and sharp. Focus on foundational effectiveness.`;
    
    case 'starter':
      return `${basePrompt} This user is ready to scale — add unlimited creation capabilities, strategic editing tools, and clear optimization guidance. Focus on actionable improvements.`;
    
    case 'pro':
      return `${basePrompt} This user has experience — add persuasion layering, social proof cues, and advanced emotional triggers. Include strategic sophistication.`;
    
    case 'vault':
      return `${basePrompt} This user is advanced — implement neuromarketing logic, AI-driven personalization, and create multiple variant options. Apply maximum conversion psychology.`;
    
    default:
      return basePrompt;
  }
}

// Council activation by tier
function getActiveCouncil(tier: 'free' | 'starter' | 'pro' | 'vault'): string[] {
  switch (tier) {
    case 'free':
      return ['forge'];
    case 'starter':
      return ['sabien', 'forge']; // Two-agent council for unlimited generation
    case 'pro':
      return ['sabien', 'mosaic', 'blaze'];
    case 'vault':
      return ['sabien', 'mosaic', 'blaze', 'methodus', 'runrail', 'michael'];
    default:
      return ['forge'];
  }
}

// Enhanced offer generation with council logic
export async function generateCouncilBackedOffer(input: CouncilInput): Promise<CouncilOutput> {
  try {
    const systemPrompt = getTierSystemPrompt(input.userTier);
    const activeCouncil = getActiveCouncil(input.userTier);
    
    // Stage 1: Initial offer creation
    const offerPrompt = `Create a complete OnyxHooks framework based on:
- Coach Type: ${input.coachType}
- Offer Type: ${input.offerType}
${input.tonePreference ? `- Tone Preference: ${input.tonePreference}` : ''}
${input.painPoint ? `- Target Pain Point: ${input.painPoint}` : ''}
${input.challengeFaced ? `- Specific Challenge: ${input.challengeFaced}` : ''}
${input.desiredFeeling ? `- Desired Transformation: ${input.desiredFeeling}` : ''}

Using the OnyxHooks framework methodology:

1. HOOK: Create a pattern-interrupt that stops scrolling. Use curiosity gaps, specific numbers, or bold claims that feel authentic to this coach type.

2. PROBLEM: Articulate the exact frustration your audience faces. Make it visceral and relatable. Connect emotionally before logically.

3. PROMISE: Paint the picture of transformation. Be specific about the outcome, timeline, and what life looks like after. Create desire and urgency.

4. CTA: Drive immediate action with scarcity, urgency, or limited availability. Make it feel like they're missing out if they don't act now.

Apply copywriting psychology:
- Use "you" language to make it personal
- Include emotional stakes (what they lose by waiting)
- Add specificity (numbers, timeframes, exact outcomes)
- Balance boldness with believability
- Match the tone to the coach type and audience sophistication

Respond with JSON in this exact format: {
  "hook": "compelling hook with emotional trigger",
  "problem": "visceral problem statement that resonates deeply", 
  "promise": "specific transformation promise with timeline",
  "cta": "urgent call-to-action with scarcity",
  "offerName": "memorable offer name that implies transformation",
  "priceRange": "strategic price range with psychological anchoring"
}`;

    // Generate initial offer
    const offerResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: offerPrompt }
      ],
      response_format: { type: "json_object" },
    });

    const initialOffer = JSON.parse(offerResponse.choices[0].message.content || "{}");

    // Stage 2: Council review (if Pro/Vault tier)
    let councilFeedback = "";
    let conversionScore = 75; // Base score
    
    if (input.userTier !== 'free') {
      const councilPrompt = `As the OfferForge Council (${activeCouncil.map(agent => COUNCIL_AGENTS[agent as keyof typeof COUNCIL_AGENTS].name).join(', ')}), review this offer:

Hook: "${initialOffer.hook}"
Problem: "${initialOffer.problem}"
Promise: "${initialOffer.promise}"
CTA: "${initialOffer.cta}"
Offer Name: "${initialOffer.offerName}"

Provide:
1. Conversion Score (0-100)
2. Top 3 strategic improvements
3. Overall council assessment

Focus on psychology, persuasion, and conversion optimization from each council member's expertise.

Respond with JSON: {
  "conversionScore": number,
  "feedback": "strategic council insights",
  "improvements": ["improvement1", "improvement2", "improvement3"]
}`;

      const councilResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are the OfferForge Council providing strategic offer analysis." },
          { role: "user", content: councilPrompt }
        ],
        response_format: { type: "json_object" },
      });

      const councilData = JSON.parse(councilResponse.choices[0].message.content || "{}");
      conversionScore = councilData.conversionScore || 75;
      councilFeedback = councilData.feedback || "";
    }

    return {
      hook: initialOffer.hook || "Are you ready to transform your coaching business?",
      problem: initialOffer.problem || "You're working hard but not seeing the results you deserve.",
      promise: initialOffer.promise || "I'll show you the exact system to scale your impact and income.",
      cta: initialOffer.cta || "Claim your spot - limited availability.",
      offerName: initialOffer.offerName || "The Transformation Method",
      priceRange: initialOffer.priceRange || "$997 - $2,997",
      conversionScore: conversionScore,
      councilFeedback: councilFeedback,
      isCouncilBacked: input.userTier !== 'free'
    };

  } catch (error) {
    throw new Error("Failed to generate council-backed offer: " + (error as Error).message);
  }
}

function getCouncilInsights(tier: 'free' | 'starter' | 'pro' | 'vault'): string {
  const insights = {
    free: "Forge agent analysis: Strong curiosity gaps and authority positioning detected.",
    starter: "Sabien & Forge council analysis: Enhanced emotional triggers with scaling focus. 25/month limit creates momentum for Pro upgrade.",
    pro: "Unlimited council feedback: Advanced psychological frameworks with social proof elements. Full generation freedom unlocked.",
    vault: "Elite 6-agent council analysis: Advanced neuromarketing triggers including scarcity, authority, and insider knowledge patterns. These hooks leverage vulnerability-based relatability combined with exclusivity positioning."
  };
  return insights[tier];
}

// Enhanced hook generation with council input and scoring
export async function generateCouncilHooks(input: { industry: string; coachType: string; targetAudience?: string; userTier: 'free' | 'starter' | 'pro' | 'vault' }): Promise<{ hooks: string[]; councilInsights?: string; scoredResults?: ScoredHookResult[] }> {
  try {
    const systemPrompt = getTierSystemPrompt(input.userTier);
    
    const hookPrompt = `Generate 2 powerful hooks for a ${input.coachType} in the ${input.industry} industry.
${input.targetAudience ? `Target Audience: ${input.targetAudience}` : ''}

Each hook should:
1. Create an emotional trigger (curiosity, fear of missing out, pain point)
2. Be crystal clear and specific
3. Promise a transformation or reveal something valuable
4. Be suitable for social media, emails, or landing pages

Use proven copywriting principles:
- Pattern interrupts
- Curiosity gaps
- Specific numbers or timeframes
- Relatable pain points
- Transformation promises

For ${input.userTier} tier: ${input.userTier === 'free' ? 'Focus on clarity and emotional connection' : input.userTier === 'pro' ? 'Add persuasion layers and social proof elements' : 'Apply advanced psychology and neuromarketing triggers'}

Respond with JSON: {
  "hooks": ["hook1", "hook2"]
}`;

    let hooks: string[];
    let councilInsights: string;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: hookPrompt }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      hooks = result.hooks || [];
      councilInsights = getCouncilInsights(input.userTier);
    } catch (apiError: any) {
      // Provide tier-appropriate fallback hooks when API fails
      const tierHooks = {
        free: [
          `Stop Wasting Money on ${input.industry} "Gurus" Who Promise Results but Deliver Excuses`,
          `The ${input.industry} Secret That Turned My Biggest Failure Into My Greatest Success`
        ],
        starter: [
          `Stop Wasting Money on ${input.industry} "Gurus" Who Promise Results but Deliver Excuses`,
          `The ${input.industry} Secret That Turned My Biggest Failure Into My Greatest Success`,
          `Why 97% of ${input.industry} Professionals Fail (And the 3% Who Don't)`,
          `The Uncomfortable Truth About ${input.industry} That No One Talks About`
        ],
        pro: [
          `Stop Wasting Money on ${input.industry} "Gurus" Who Promise Results but Deliver Excuses`,
          `The ${input.industry} Secret That Turned My Biggest Failure Into My Greatest Success`,
          `Why 97% of ${input.industry} Professionals Fail (And the 3% Who Don't)`,
          `The Uncomfortable Truth About ${input.industry} That No One Talks About`,
          `From Zero to ${input.industry} Hero: My Unconventional 90-Day Method`
        ],
        vault: [
          `Stop Wasting Money on ${input.industry} "Gurus" Who Promise Results but Deliver Excuses`,
          `The ${input.industry} Secret That Turned My Biggest Failure Into My Greatest Success`,
          `Why 97% of ${input.industry} Professionals Fail (And the 3% Who Don't)`,
          `The Uncomfortable Truth About ${input.industry} That No One Talks About`,
          `From Zero to ${input.industry} Hero: My Unconventional 90-Day Method`,
          `The ${input.industry} Method "They" Don't Want You to Know`,
          `BREAKING: ${input.industry} Industry Insider Reveals All (Limited Time)`
        ]
      };

      hooks = tierHooks[input.userTier as keyof typeof tierHooks] || tierHooks.free;
      councilInsights = `Demo mode: ${getCouncilInsights(input.userTier)}`;
    }

    // Limit hooks based on tier - Strategic progression
    let hookLimit: number;
    if (input.userTier === 'free') {
      hookLimit = 2;
    } else if (input.userTier === 'starter') {
      hookLimit = 25; // Generous but limited
    } else if (input.userTier === 'pro') {
      hookLimit = hooks.length; // Unlimited for Pro
    } else {
      hookLimit = hooks.length; // Unlimited for Vault
    }
    const limitedHooks = hooks.slice(0, hookLimit);

    return {
      hooks: limitedHooks,
      councilInsights
    };

  } catch (error) {
    throw new Error("Failed to generate council hooks: " + (error as Error).message);
  }
}