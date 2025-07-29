import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface OfferGenerationInput {
  coachType: string;
  offerType: string;
  tonePreference?: string;
  painPoint?: string;
  challengeFaced?: string;
  desiredFeeling?: string;
}

export interface OnyxHooksFramework {
  hook: string;
  problem: string;
  promise: string;
  cta: string;
  offerName: string;
  priceRange: string;
}

export interface HookGenerationInput {
  industry: string;
  coachType: string;
  targetAudience?: string;
}

export async function generateOnyxHooksFramework(input: OfferGenerationInput): Promise<OnyxHooksFramework> {
  try {
    const prompt = `You are an expert offer strategist and copywriter specializing in high-converting offers for coaches and course creators.

Create a complete OnyxHooks framework based on:
- Coach Type: ${input.coachType}
- Offer Type: ${input.offerType}
${input.tonePreference ? `- Tone Preference: ${input.tonePreference}` : ''}
${input.painPoint ? `- Pain Point: ${input.painPoint}` : ''}
${input.challengeFaced ? `- Challenge Faced: ${input.challengeFaced}` : ''}
${input.desiredFeeling ? `- Desired Feeling: ${input.desiredFeeling}` : ''}

Generate a complete OnyxHooks framework with:
1. HOOK: A compelling opening that grabs attention and creates curiosity (emotional trigger + clarity)
2. PROBLEM: The specific pain point and consequence of not solving it
3. PROMISE: The transformation and outcome they'll achieve
4. CTA: A clear, action-oriented call-to-action with urgency

Also include:
- Offer Name: Compelling name with transformation and timeframe
- Price Range: Appropriate pricing for the value ($297-$4,997)

Inject proven copywriting principles: emotional triggers, curiosity, clarity, and psychological resonance.

Respond with JSON in this exact format: {
  "hook": "string",
  "problem": "string", 
  "promise": "string",
  "cta": "string",
  "offerName": "string",
  "priceRange": "$X,XXX - $X,XXX"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      hook: result.hook || "Are you tired of spinning your wheels without seeing real results?",
      problem: result.problem || "You're working hard but struggling to break through to the next level because you lack a proven system.",
      promise: result.promise || "I'll show you the exact framework that transforms your efforts into consistent, measurable success.",
      cta: result.cta || "Reserve your spot now - only 10 places available this month.",
      offerName: result.offerName || "The Breakthrough Method",
      priceRange: result.priceRange || "$997 - $2,997"
    };
  } catch (error) {
    throw new Error("Failed to generate offer: " + (error as Error).message);
  }
}

export async function generateHooks(input: HookGenerationInput): Promise<string[]> {
  try {
    const prompt = `You are an expert copywriter specializing in high-converting hooks for coaches and course creators.

Generate 2 powerful hooks based on:
- Industry: ${input.industry}
- Coach Type: ${input.coachType}
${input.targetAudience ? `- Target Audience: ${input.targetAudience}` : ''}

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

Respond with JSON in this exact format: {
  "hooks": ["hook1", "hook2"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return result.hooks || [
      "Most coaches never realize they're one framework away from 6-figure months",
      "The #1 mistake that keeps talented coaches stuck at $3K months (and how to fix it)"
    ];
  } catch (error) {
    console.error("Error generating hooks:", error);
    throw new Error("Failed to generate hooks. Please try again.");
  }
}

export interface FunnelCritiqueInput {
  url?: string;
  content?: string;
  toneOverride?: string;
}

export interface FunnelCritique {
  score: number;
  critique: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

export async function analyzeFunnel(input: FunnelCritiqueInput): Promise<FunnelCritique> {
  try {
    const content = input.content || `Please analyze the funnel at URL: ${input.url}`;
    const tone = input.toneOverride || "expert conversion optimizer";
    
    const prompt = `You are a ${tone} analyzing a sales funnel for conversion optimization.

Analyze this funnel content: ${content}

Provide a comprehensive critique focusing on:
1. CTA clarity and placement
2. Messaging and value proposition
3. Structure and flow
4. Trust elements and social proof
5. Conversion barriers

Give a score from 0-100 and specific recommendations.

Respond with JSON in this exact format: {
  "score": number,
  "critique": "detailed analysis",
  "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5"],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as FunnelCritique;
  } catch (error) {
    throw new Error("Failed to analyze funnel: " + (error as Error).message);
  }
}

export interface QuizScoring {
  answers: Record<string, any>;
}

export interface QuizResult {
  score: number;
  feedback: string;
  recommendations: string[];
  tier: "Needs Work" | "Getting Close" | "Optimized";
}

export async function scoreQuiz(input: QuizScoring): Promise<QuizResult> {
  try {
    const prompt = `You are an expert offer strategist scoring an "Offer Strength Quiz" based on these answers: ${JSON.stringify(input.answers)}

Score the offer from 0-100 based on:
- Clarity of target audience
- Specificity of transformation
- Value proposition strength
- Pricing strategy
- Market positioning

Provide tier-based feedback:
- 0-40: "Needs Work" - Focus on fundamentals
- 41-75: "Getting Close" - Refine and optimize
- 76-100: "Optimized" - Ready to scale

Respond with JSON in this exact format: {
  "score": number,
  "feedback": "detailed personalized feedback",
  "recommendations": ["rec1", "rec2", "rec3"],
  "tier": "Needs Work" | "Getting Close" | "Optimized"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as QuizResult;
  } catch (error) {
    throw new Error("Failed to score quiz: " + (error as Error).message);
  }
}

export async function generateOfferImprovement(currentOffer: string, score: number): Promise<string> {
  try {
    const prompt = `Based on this offer "${currentOffer}" with a score of ${score}/100, provide 3 specific improvement suggestions to increase conversion and value perception. Focus on positioning, pricing, and messaging improvements.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    throw new Error("Failed to generate improvements: " + (error as Error).message);
  }
}
