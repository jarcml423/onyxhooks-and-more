import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface OriginStoryInput {
  coachType: string;
  turningPoint: string;
  whyStarted: string;
  whoTheyServe: string;
  transformation?: string;
}

export interface OriginStoryResult {
  story: string;
  hooks: string[];
  keyMessages: string[];
}

export interface VSLScriptInput {
  hook: string;
  offer: string;
  transformation: string;
  industry?: string;
  painPoint?: string;
}

export interface VSLScriptResult {
  fullScript: string;
  painSection: string;
  truthSection: string;
  shiftSection: string;
  ctaSection: string;
  scriptNotes: string[];
}

export interface LeadMagnetInput {
  industry: string;
  coachType: string;
  transformation: string;
  offer?: string;
}

export interface LeadMagnetResult {
  magnets: {
    title: string;
    format: string;
    description: string;
    cta: string;
    deliveryMethod: string;
  }[];
}

export interface EmailSequenceInput {
  offer: string;
  transformation: string;
  painPoints?: string[];
  objections?: string[];
  industry?: string;
}

export interface EmailSequenceResult {
  emails: {
    day: number;
    subject: string;
    bodyContent: string;
    tone: string;
    purpose: string;
  }[];
  sequenceStrategy: string;
}

/**
 * Generate emotional founder origin story for brand building
 */
export async function generateOriginStory(input: OriginStoryInput): Promise<OriginStoryResult> {
  try {
    const prompt = `You are a brand storytelling expert who crafts compelling founder origin stories.

COACH TYPE: ${input.coachType}
TURNING POINT: ${input.turningPoint}
WHY THEY STARTED: ${input.whyStarted}
WHO THEY SERVE: ${input.whoTheyServe}
${input.transformation ? `TRANSFORMATION THEY DELIVER: ${input.transformation}` : ''}

Create a 60-90 second origin story written in first person that includes:

1. THE STRUGGLE: Personal challenge or turning point that started their journey
2. THE DISCOVERY: What they learned or realized that changed everything
3. THE MISSION: Why they now help others achieve the same transformation
4. THE PROOF: Subtle credibility or results indicators

The story should:
- Be emotionally engaging and relatable
- Position them as someone who "gets it" because they've been there
- Create natural transition to their offer/solution
- Feel authentic, not overly promotional

Also provide:
- 3 hook variations that could open the story
- Key messaging themes woven throughout

Write in conversational, authentic language suitable for VSLs, About pages, or live presentations.

Respond in JSON format with structure: {
  "story": string,
  "hooks": string[],
  "keyMessages": string[]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error: any) {
    throw new Error("Failed to generate origin story: " + error.message);
  }
}

/**
 * Generate full VSL script with Pain → Truth → Shift → CTA structure
 */
export async function generateVSLScript(input: VSLScriptInput): Promise<VSLScriptResult> {
  try {
    const prompt = `You are a VSL copywriting expert who creates high-converting video scripts.

HOOK: ${input.hook}
OFFER: ${input.offer}
TRANSFORMATION: ${input.transformation}
${input.industry ? `INDUSTRY: ${input.industry}` : ''}
${input.painPoint ? `PAIN POINT: ${input.painPoint}` : ''}

Create a 90-second VSL script using the Pain → Truth → Shift → CTA structure:

1. PAIN (20-25 seconds)
- Agitate the current frustration/struggle
- Make them feel understood and seen
- Build emotional tension

2. TRUTH (25-30 seconds)  
- Reveal the real reason they're stuck
- Challenge conventional thinking
- Position yourself as the guide who knows better

3. SHIFT (25-30 seconds)
- Present your solution/approach
- Show the transformation possible
- Build excitement and possibility

4. CTA (10-15 seconds)
- Clear, specific next step
- Urgency or scarcity element
- Remove friction from taking action

Write in conversational, direct language with:
- Strong emotional triggers
- Logical flow between sections
- Natural transitions
- Clear visual/audio cues for editing

Provide the full script plus individual sections and production notes.

Respond in JSON format with keys: fullScript, painSection, truthSection, shiftSection, ctaSection, scriptNotes`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error: any) {
    throw new Error("Failed to generate VSL script: " + error.message);
  }
}

/**
 * Generate lead magnet ideas with titles, formats, and CTAs
 */
export async function generateLeadMagnets(input: LeadMagnetInput): Promise<LeadMagnetResult> {
  try {
    const prompt = `You are a lead generation expert who creates irresistible lead magnets.

INDUSTRY: ${input.industry}
COACH TYPE: ${input.coachType}
TRANSFORMATION: ${input.transformation}
${input.offer ? `RELATED OFFER: ${input.offer}` : ''}

Create 3 distinct lead magnet options that attract your ideal prospects:

Types to consider:
- Checklists/Templates
- Mini-courses/Email series
- Assessments/Quizzes
- Toolkits/Resource bundles
- Challenges/Quick wins
- Exclusive reports/Guides

For each lead magnet provide:
1. TITLE: Clear, benefit-driven, curiosity-inducing
2. FORMAT: Delivery method (PDF, email series, video, etc.)
3. DESCRIPTION: What's included and what outcome they'll get
4. CTA: How to position the opt-in offer
5. DELIVERY METHOD: How they receive and consume it

Focus on:
- Quick wins that demonstrate your expertise
- Natural bridge to your paid offer
- High perceived value with low delivery cost
- Specific outcomes, not generic information

Respond in JSON format with structure: {
  "magnets": [
    {
      "title": string,
      "format": string, 
      "description": string,
      "cta": string,
      "deliveryMethod": string
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error: any) {
    throw new Error("Failed to generate lead magnets: " + error.message);
  }
}

/**
 * Generate complete email sequence to convert leads to buyers
 */
export async function generateEmailSequence(input: EmailSequenceInput): Promise<EmailSequenceResult> {
  try {
    const prompt = `You are an email marketing expert who creates conversion-focused nurture sequences.

OFFER: ${input.offer}
TRANSFORMATION: ${input.transformation}
${input.painPoints ? `PAIN POINTS: ${input.painPoints.join(', ')}` : ''}
${input.objections ? `OBJECTIONS: ${input.objections.join(', ')}` : ''}
${input.industry ? `INDUSTRY: ${input.industry}` : ''}

Create a 7-email nurture sequence to convert leads into buyers:

EMAIL SEQUENCE STRATEGY:
- Email 1: Welcome + Quick Win (Inspire)
- Email 2: Backstory + Credibility (Connect)  
- Email 3: Educational Content (Educate)
- Email 4: Social Proof + Results (Validate)
- Email 5: Objection Handling (Address)
- Email 6: Urgency + Offer (Push)
- Email 7: Final Call + FOMO (Close)

For each email provide:
- Day number and timing
- Subject line (curiosity + benefit)
- Full body content (300-500 words)
- Tone classification (inspire/educate/push/close)
- Strategic purpose

Write emails that:
- Build relationship before selling
- Address specific objections and concerns
- Use storytelling and social proof
- Create natural progression to purchase
- Feel personal and authentic

Also provide overall sequence strategy and timing recommendations.

Respond in JSON format with structure: {
  "emails": [
    {
      "day": number,
      "subject": string,
      "bodyContent": string,
      "tone": string,
      "purpose": string
    }
  ],
  "sequenceStrategy": string
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error: any) {
    throw new Error("Failed to generate email sequence: " + error.message);
  }
}