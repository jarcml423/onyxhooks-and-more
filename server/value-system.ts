import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ValueValidationInput {
  offer: string;
  transformation?: string;
  painPoint?: string;
  targetAudience?: string;
}

export interface ValueValidationResult {
  isValueStrong: boolean;
  emotionalValue: {
    score: number;
    assessment: string;
    gaps?: string[];
  };
  functionalValue: {
    score: number;
    assessment: string;
    gaps?: string[];
  };
  identityValue: {
    score: number;
    assessment: string;
    gaps?: string[];
  };
  overallScore: number;
  recommendations: string[];
  clarifyingQuestions?: string[];
}

export interface PricingJustificationInput {
  offer: string;
  transformation: string;
  pricePoint?: string;
  targetAudience?: string;
}

export interface PricingJustificationResult {
  costOfInaction: string;
  emotionalROI: string;
  identityAlignment: string;
  priceFraming: string;
  riskReversal: string;
}

export interface UpsellBuilderInput {
  primaryOffer: string;
  transformation: string;
  industry?: string;
}

export interface UpsellBuilderResult {
  upsell: {
    name: string;
    description: string;
    transformationAlignment: string;
    priceRange: string;
  };
  crossSell: {
    name: string;
    description: string;
    valueProposition: string;
    priceRange: string;
  };
}

export interface ValueLadderInput {
  primaryOffer: string;
  transformation: string;
  industry: string;
  coachType: string;
}

export interface ValueLadderResult {
  lowTier: {
    name: string;
    format: string;
    transformation: string;
    priceRange: string;
    purpose: string;
  };
  midTier: {
    name: string;
    format: string;
    transformation: string;
    priceRange: string;
    purpose: string;
  };
  highTier: {
    name: string;
    format: string;
    transformation: string;
    priceRange: string;
    purpose: string;
  };
  strategy: string;
}

/**
 * Validate if an offer has strong transformation value before proceeding with pricing/monetization
 */
export async function validateOfferValue(input: ValueValidationInput): Promise<ValueValidationResult> {
  try {
    const prompt = `You are Alex Hormozi analyzing an offer for transformation strength and premium pricing potential.

OFFER TO ASSESS:
${input.offer}

${input.transformation ? `STATED TRANSFORMATION: ${input.transformation}` : ''}
${input.painPoint ? `PAIN POINT: ${input.painPoint}` : ''}
${input.targetAudience ? `TARGET AUDIENCE: ${input.targetAudience}` : ''}

Apply Hormozi's Value Equation analysis across three dimensions:

1. EMOTIONAL VALUE (0-10): Pain relief, status elevation, fear reduction
2. FUNCTIONAL VALUE (0-10): Time saved, money made/saved, effort reduced, clear outcomes
3. IDENTITY VALUE (0-10): Who they become, how others see them, self-concept shift

For each dimension, provide detailed analysis and specific gaps.

For RECOMMENDATIONS, provide Hormozi-level specificity with:
- EXACT language improvements with before/after examples
- SPECIFIC outcome quantification (e.g., "Save 10 hours per week" vs "Save time")
- EMOTIONAL specificity upgrades (e.g., "From frustrated and overwhelmed to confident and in control")
- IDENTITY clarity enhancements (e.g., "From struggling coach to 6-figure authority")
- TRANSFORMATION mechanism details (the HOW behind the outcome)
- PROOF ELEMENTS needed (testimonials, case studies, guarantees)
- RISK REVERSAL strategies specific to this offer
- VALUE STACKING opportunities to increase perceived worth

Each recommendation should be a complete, actionable directive that a coach can immediately implement, not generic advice.

Respond in JSON format with the structure: {
  "isValueStrong": boolean,
  "emotionalValue": {"score": number, "assessment": string, "gaps": string[]},
  "functionalValue": {"score": number, "assessment": string, "gaps": string[]},
  "identityValue": {"score": number, "assessment": string, "gaps": string[]},
  "overallScore": number,
  "recommendations": string[],
  "clarifyingQuestions": string[]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    throw new Error("Failed to validate offer value: " + error.message);
  }
}

/**
 * Generate pricing justification only after value validation passes
 */
export async function generatePricingJustification(input: PricingJustificationInput): Promise<PricingJustificationResult> {
  try {
    const prompt = `You are a pricing strategist who creates emotionally-anchored price justification.

OFFER: ${input.offer}
TRANSFORMATION: ${input.transformation}
${input.pricePoint ? `PRICE POINT: ${input.pricePoint}` : ''}
${input.targetAudience ? `TARGET AUDIENCE: ${input.targetAudience}` : ''}

Create a comprehensive pricing justification with:

1. COST OF INACTION: What does NOT buying cost them financially and emotionally?
2. EMOTIONAL ROI: How does this investment pay for itself in peace of mind, confidence, freedom?
3. IDENTITY ALIGNMENT: How does this purchase align with who they want to become?
4. PRICE FRAMING: Reframe the price as an investment in their transformation
5. RISK REVERSAL: Address pricing concerns with guarantees and value stacking

Write each section as compelling copy that coaches can use directly in their sales materials.

Respond in JSON format with keys: costOfInaction, emotionalROI, identityAlignment, priceFraming, riskReversal`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    throw new Error("Failed to generate pricing justification: " + error.message);
  }
}

/**
 * Build upsell and cross-sell offers based on transformation deepening
 */
export async function buildUpsellOffers(input: UpsellBuilderInput): Promise<UpsellBuilderResult> {
  try {
    const prompt = `You are an offer expansion strategist who creates logical upsells and cross-sells.

PRIMARY OFFER: ${input.primaryOffer}
TRANSFORMATION: ${input.transformation}
${input.industry ? `INDUSTRY: ${input.industry}` : ''}

Create two offer expansions:

1. UPSELL: Should deepen the transformation or accelerate results from the primary offer
   - Natural progression that enhances the core outcome
   - 2-3x price point of primary offer
   - Clear transformation alignment

2. CROSS-SELL: Should provide lateral value or solve adjacent problems
   - Complements but doesn't replace primary offer
   - Similar or slightly higher price point
   - Addresses related needs of the same customer

For each offer provide: name, description, transformation alignment/value proposition, and price range.

Respond in JSON format with structure: {
  "upsell": {"name": string, "description": string, "transformationAlignment": string, "priceRange": string},
  "crossSell": {"name": string, "description": string, "valueProposition": string, "priceRange": string}
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    throw new Error("Failed to build upsell offers: " + error.message);
  }
}

/**
 * Generate complete value ladder mapping for low → mid → high tier strategy
 */
export async function generateValueLadder(input: ValueLadderInput): Promise<ValueLadderResult> {
  try {
    const prompt = `You are a monetization strategist creating value ladder maps for coaches.

PRIMARY OFFER: ${input.primaryOffer}
TRANSFORMATION: ${input.transformation}
INDUSTRY: ${input.industry}
COACH TYPE: ${input.coachType}

Create a complete value ladder with three tiers that logically escalate outcomes, not just content volume:

LOW TIER (Lead Magnet/Mini-Offer): $0-$97
- Entry point that delivers quick wins
- Builds trust and demonstrates value
- Creates desire for deeper transformation

MID TIER (Core Offer): $97-$997
- Main transformation vehicle
- Comprehensive solution to core problem
- Should be your primary business driver

HIGH TIER (Prestige/Mastermind): $997-$5000+
- Maximum transformation and support
- Premium experience and access
- For customers ready for full commitment

For each tier provide:
- Name and format (course, coaching, mastermind, etc.)
- Specific transformation delivered
- Price range and positioning
- Strategic purpose in the ladder

Also provide overall strategy explaining how the tiers work together.

Respond in JSON format with structure: {
  "lowTier": {"name": string, "format": string, "transformation": string, "priceRange": string, "purpose": string},
  "midTier": {"name": string, "format": string, "transformation": string, "priceRange": string, "purpose": string},
  "highTier": {"name": string, "format": string, "transformation": string, "priceRange": string, "purpose": string},
  "strategy": string
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    throw new Error("Failed to generate value ladder: " + error.message);
  }
}