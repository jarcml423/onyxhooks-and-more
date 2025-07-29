import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface ObjectionEraserInput {
  industry: string;
  offer: string;
  hook?: string;
  transformation?: string;
}

export interface ObjectionEraserResult {
  priceObjections: {
    objection: string;
    reframe: string;
    emotionalLogic: string;
  }[];
  timeObjections: {
    objection: string;
    reframe: string;
    emotionalLogic: string;
  }[];
  beliefObjections: {
    objection: string;
    reframe: string;
    emotionalLogic: string;
  }[];
}

export interface GuaranteeGeneratorInput {
  offer: string;
  transformation: string;
  industry?: string;
}

export interface GuaranteeGeneratorResult {
  primaryGuarantee: string;
  alternativeGuarantee: string;
  riskReversalFraming: string;
  trustBuilders: string[];
}

export interface UrgencyEngineInput {
  offer: string;
  hook?: string;
  transformation?: string;
}

export interface UrgencyEngineResult {
  deadlineUrgency: {
    framework: string;
    example: string;
    reasoning: string;
  };
  priorityUrgency: {
    framework: string;
    example: string;
    reasoning: string;
  };
  scarcityFraming: {
    framework: string;
    example: string;
    reasoning: string;
  };
}

/**
 * Generate objection handling frameworks for price, time, and belief concerns
 */
export async function generateObjectionErasers(input: ObjectionEraserInput): Promise<ObjectionEraserResult> {
  try {
    const prompt = `You are an objection handling expert who creates emotional reframes for common buyer concerns.

OFFER: ${input.offer}
INDUSTRY: ${input.industry}
${input.hook ? `HOOK: ${input.hook}` : ''}
${input.transformation ? `TRANSFORMATION: ${input.transformation}` : ''}

Generate objection handling frameworks for three categories:

1. PRICE OBJECTIONS
Common objections: "Too expensive", "Can't afford it", "Need to think about it"
Create 2-3 reframes using:
- Cost of inaction logic
- Value anchoring
- Investment vs expense framing

2. TIME OBJECTIONS  
Common objections: "Don't have time", "Too busy", "Wrong timing"
Create 2-3 reframes using:
- Time scarcity logic
- Opportunity cost framing
- Priority reframing

3. BELIEF OBJECTIONS
Common objections: "Doesn't work for my situation", "Tried before", "Skeptical"
Create 2-3 reframes using:
- Social proof implications
- Identity-based logic
- Future self visualization

For each objection provide:
- The common objection statement
- OnyxHooks-style reframe (direct, emotional, logical)
- Emotional logic explanation

Respond in JSON format with structure: {
  "priceObjections": [{"objection": string, "reframe": string, "emotionalLogic": string}],
  "timeObjections": [{"objection": string, "reframe": string, "emotionalLogic": string}],
  "beliefObjections": [{"objection": string, "reframe": string, "emotionalLogic": string}]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    throw new Error("Failed to generate objection erasers: " + error.message);
  }
}

/**
 * Generate bold, trust-building guarantees with risk reversal
 */
export async function generateGuarantees(input: GuaranteeGeneratorInput): Promise<GuaranteeGeneratorResult> {
  try {
    const prompt = `You are a guarantee specialist who creates bold, trust-building risk reversals.

OFFER: ${input.offer}
TRANSFORMATION: ${input.transformation}
${input.industry ? `INDUSTRY: ${input.industry}` : ''}

Create guarantee frameworks that build trust and remove buyer risk:

1. PRIMARY GUARANTEE (1-2 sentences)
- Bold, specific, transformation-focused
- Easy to understand and believe
- Addresses the core fear/doubt

2. ALTERNATIVE GUARANTEE (1-2 sentences)  
- Different angle or timeframe
- Results-focused or experience-focused
- Complements the primary guarantee

3. RISK REVERSAL FRAMING (2-3 sentences)
- Positions the guarantee as confidence in the offer
- Makes NOT buying feel riskier than buying
- Addresses "what if it doesn't work" concerns

4. TRUST BUILDERS (3-4 bullet points)
- Social proof elements
- Credibility indicators  
- Process transparency points

Write all copy in confident, direct language that coaches can use verbatim in their sales materials.

Respond in JSON format with keys: primaryGuarantee, alternativeGuarantee, riskReversalFraming, trustBuilders`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    throw new Error("Failed to generate guarantees: " + error.message);
  }
}

/**
 * Generate urgency and scarcity frameworks without hype
 */
export async function generateUrgencyFrameworks(input: UrgencyEngineInput): Promise<UrgencyEngineResult> {
  try {
    const prompt = `You are an urgency specialist who creates authentic motivation without hype or manipulation.

OFFER: ${input.offer}
${input.hook ? `HOOK: ${input.hook}` : ''}
${input.transformation ? `TRANSFORMATION: ${input.transformation}` : ''}

Create three urgency frameworks:

1. DEADLINE URGENCY
- Framework: Structure for time-based urgency
- Example: Specific copy coaches can use
- Reasoning: Why this deadline feels authentic and necessary

2. PRIORITY URGENCY  
- Framework: Structure for importance-based urgency
- Example: Copy that makes this feel like their most important decision
- Reasoning: Why taking action now serves their bigger goals

3. SCARCITY FRAMING
- Framework: Structure for availability-based scarcity
- Example: Copy about limited spots, inventory, or access
- Reasoning: Why the limitation is logical and believable

All urgency must be:
- Authentic and believable
- Connected to real consequences
- Focused on serving the buyer's best interests
- Free from manipulation or false pressure

Respond in JSON format with structure: {
  "deadlineUrgency": {"framework": string, "example": string, "reasoning": string},
  "priorityUrgency": {"framework": string, "example": string, "reasoning": string},
  "scarcityFraming": {"framework": string, "example": string, "reasoning": string}
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    throw new Error("Failed to generate urgency frameworks: " + error.message);
  }
}