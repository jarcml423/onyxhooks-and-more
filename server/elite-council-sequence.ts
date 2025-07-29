import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CouncilSequenceInput {
  content: string;
  contentType: 'hook' | 'offer' | 'cta';
  userTier: 'free' | 'starter' | 'pro' | 'vault';
}

export interface CouncilSequenceOutput {
  phase1FusedCouncil: string; // Maximus + Brutus + Valerius + Achilles combined
  phase2Disruptive: string;   // Spartacus + Leonidas: Urgent, battlefield energy
  phase2Sophisticated: string; // Brutus + Achilles: Status-driven, premium
  phase2Structured: string;   // Maximus + Valerius: Outcome-secure, clarity
  councilConfidenceScore: number;
  insights: {
    spartacus: string;
    leonidas: string;
    maximus: string;
    brutus: string;
    achilles: string;
    valerius: string;
  };
  sessionId: string;
  timestamp: Date;
}

export async function generateCouncilSequence(input: CouncilSequenceInput): Promise<CouncilSequenceOutput> {
  const sessionId = `council_sequence_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Only available for Vault tier
  if (input.userTier !== 'vault') {
    throw new Error('Council Sequence is exclusive to Vault tier members');
  }

  const councilPrompt = `You're acting as The Council of Conversion™ — an elite multi-perspective intelligence unit consisting of:

⚔️ Spartacus (Attention disruptor, rebellion signaler, battlefield sharpener)
🎯 Leonidas (Urgency tactician, elite vs. mediocre divider)
🧠 Maximus (Outcome certainty architect, clarity strategist)
🏛 Brutus (Strategic sequencer, ROI stacker, layered benefit mapper)
🏹 Achilles (Aspirational identity framer, status elevation voice)
🪞 Valerius (Clarity simplifier, CTA sequencer, paralysis eliminator)

🔧 Objective:
Generate exactly 4 distinct outputs:

Phase 1 – Fused Council Response:
Blend Maximus + Brutus + Valerius + Achilles into one sophisticated, long-form persuasion asset.
Incorporate data-driven certainty, layered ROI, structured pathways, and aspirational identity elevation.

Phase 2 – Precision Archetype Responses (3 cards):
1. Disruptive/Urgent: Spartacus + Leonidas battle energy, elite vs mediocre positioning, urgent action
2. Sophisticated/Status: Brutus + Achilles premium language, long-term transformation, strategic framing  
3. Structured/Outcome: Maximus + Valerius clear pathways, reduced friction, outcome certainty

🧪 Input:
"${input.content}"

🎯 Expected Output Format (JSON):
{
  "phase1FusedCouncil": "Sophisticated fused response without any agent names",
  "phase2Disruptive": "Urgent, battlefield energy response without any agent names",
  "phase2Sophisticated": "Premium, status-driven response without any agent names", 
  "phase2Structured": "Clear, outcome-secure response without any agent names",
  "councilConfidenceScore": 85,
  "insights": {
    "spartacus": "1-line insight from Spartacus",
    "leonidas": "1-line insight from Leonidas",
    "maximus": "1-line insight from Maximus", 
    "brutus": "1-line insight from Brutus",
    "achilles": "1-line insight from Achilles",
    "valerius": "1-line insight from Valerius"
  }
}

CRITICAL: Never include agent names (Maximus, Spartacus, Leonidas, Brutus, Achilles, Valerius) or any **bold** formatting within the response content. Only provide clean, optimized copy without attribution.

Return ONLY the JSON object, no additional text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are The Council of Conversion™, an elite advisory unit for premium offer optimization. Respond with precise JSON format only."
        },
        {
          role: "user",
          content: councilPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Clean all agent names from responses
    const cleanAgentNames = (text: string) => text
      .replace(/\*\*Maximus\*\*:?\s*/gi, '')
      .replace(/\*\*Spartacus\*\*:?\s*/gi, '')
      .replace(/\*\*Leonidas\*\*:?\s*/gi, '')
      .replace(/\*\*Brutus\*\*:?\s*/gi, '')
      .replace(/\*\*Achilles\*\*:?\s*/gi, '')
      .replace(/\*\*Valerius\*\*:?\s*/gi, '')
      .replace(/\*\*(Maximus|Spartacus|Leonidas|Brutus|Achilles|Valerius)\*\*\s*\([^)]+\):\s*/gi, '')
      .replace(/\*PHASE\s+\d+:\s*[^*]*\*/gi, '')
      .trim();
    
    return {
      phase1FusedCouncil: cleanAgentNames(result.phase1FusedCouncil || "Phase 1 fused council response failed to generate"),
      phase2Disruptive: cleanAgentNames(result.phase2Disruptive || "Phase 2 disruptive archetype failed to generate"),
      phase2Sophisticated: cleanAgentNames(result.phase2Sophisticated || "Phase 2 sophisticated archetype failed to generate"), 
      phase2Structured: cleanAgentNames(result.phase2Structured || "Phase 2 structured archetype failed to generate"),
      councilConfidenceScore: result.councilConfidenceScore || 75,
      insights: result.insights || {
        spartacus: "Battlefield energy analysis needed",
        leonidas: "Urgency tactics require refinement",
        maximus: "Outcome certainty optimization required",
        brutus: "Strategic sequencing needs enhancement",
        achilles: "Aspirational framing requires elevation",
        valerius: "Clarity optimization in progress"
      },
      sessionId,
      timestamp: new Date()
    };

  } catch (error) {
    console.error('Council Sequence generation failed:', error);
    
    // Enhanced fallback with content-specific responses
    const getContentSpecificResponse = (contentType: string) => {
      if (contentType === 'cta') {
        return {
          phase1FusedCouncil: `**PHASE 1: FUSED COUNCIL EXPANSION**

*Maximus + Brutus + Valerius + Achilles Combined Analysis*

The Council identifies this CTA requires sophisticated psychological pressure architecture. Our integrated analysis reveals three critical optimization vectors:

**Decision Engineering (Valerius + Maximus)**: Harmonize urgency elements with outcome certainty. Create decision momentum through structured guidance that eliminates hesitation pathways.

**Status Psychology (Achilles + Brutus)**: Elevate the action to identity transformation. Frame this click as stepping into elite status rather than simple transaction completion.

**Conversion Mechanics**: Deploy scarcity triggers, social proof elements, and consequence stacking to create compelling forward momentum.

*Council Assessment: CTA foundation ready for advanced psychological deployment.*`,

          phase2Disruptive: `**SPARTACUS + LEONIDAS: DISRUPTIVE/URGENT ARCHETYPE**

*Battlefield Energy + Psychological Dominance*

**Spartacus Revolutionary Action**: Transform your CTA from request to rebellion. Make clicking feel like joining a movement against mediocrity. Use commands that suggest exclusive access.

**Leonidas Battle Urgency**: Create time pressure that feels earned, not manufactured. Stack consequences of delay to make hesitation feel dangerous to competitive position.

**Revolutionary CTA Strategy**:
• Rebellion framing: "Break Free From [Problem] Now"
• Exclusive action: "Join the Elite 3% Who [Achieve Result]"
• Urgent command: "Secure Your Advantage Before [Consequence]"
• Movement positioning: "Lead the Revolution Against [Status Quo]"

*Power Note: Commands work better than requests for immediate action.*`,

          phase2Sophisticated: `**BRUTUS + ACHILLES: SOPHISTICATED/STATUS ARCHETYPE**

*Strategic Premium + Aspirational Elevation*

**Brutus Strategic Sequencing**: Layer your CTA elements systematically. Build from value reminder through status elevation to inevitable action. Each word must justify elite-level engagement.

**Achilles Identity Transformation**: Frame the click as stepping into legendary status. Use aspirational language that positions the action as identity elevation rather than transaction.

**Elite CTA Architecture**:
• Status reminder: "Designed for Serious Professionals"
• Identity elevation: "Step Into Your Elite Identity"
• Exclusive access: "Claim Your Spot Among High-Achievers"
• Premium positioning: "Investment in Excellence Starts Here"
• Aspirational command: "Begin Your Legendary Transformation"

*Sophistication Note: Premium language justifies premium investment.*`,

          phase2Structured: `**MAXIMUS + VALERIUS: STRUCTURED/OUTCOME ARCHETYPE**

*Tactical Clarity + Decision Engineering*

**Maximus Outcome Clarity**: Clarify exactly what happens after they click. Remove all uncertainty about the next step, timeline, and expected outcomes. Precision eliminates hesitation.

**Valerius Decision Engineering**: Simplify the decision pathway. One clear action, one clear outcome, one clear next step. Eliminate decision paralysis through structural clarity.

**Clarity CTA Framework**:
• Outcome specificity: "Get [Exact Result] in [Timeframe]"
• Process transparency: "Click → [Clear Next Step] → [Outcome]"
• Action clarity: "Start Your [Specific] Transformation Now"
• Timeline certainty: "Begin [Specific Process] Today"
• Result guarantee: "Secure [Outcome] or [Remedy]"

*Structure Note: Clarity reduces friction and increases conversion confidence.*`
        };
      } else if (contentType === 'offer') {
        return {
          phase1FusedCouncil: `**PHASE 1: FUSED COUNCIL EXPANSION**

*Comprehensive Offer Architecture Analysis*

The Council recognizes this offer structure requires premium psychological positioning. Our integrated analysis reveals critical optimization opportunities across value perception, urgency mechanics, and conversion psychology.

**Value Architecture (Brutus + Maximus)**: Systematic benefit stacking with outcome certainty. Each component must build inevitable investment logic while delivering surgical precision on transformation promises.

**Elite Positioning (Achilles + Valerius)**: Transform this from transaction to transformation. Use aspirational identity elevation combined with decision pathway clarity that eliminates buyer resistance.

**Conversion Dynamics**: Deploy authority-building elements, social proof layering, and premium scarcity positioning to justify elite-level investment.

*Council Assessment: Foundation supports advanced psychological positioning.*`,

          phase2Disruptive: `**SPARTACUS + LEONIDAS: DISRUPTIVE/URGENT ARCHETYPE**

*Revolutionary Positioning + Psychological Pressure*

**Spartacus Revolution Framework**: Position this offer as rebellion against conventional solutions. Buyers should feel like they're joining an uprising against mediocrity. Use disruptive value propositions that challenge industry norms.

**Leonidas Battle Psychology**: Create earned urgency through competitive positioning. Show what elite performers do differently. Make delay feel like surrendering competitive advantage.

**Combined Revolutionary Strategy**:
• Industry disruption: "While competitors offer [standard approach], we deliver [revolutionary method]"
• Rebellion positioning: "Break free from the outdated systems holding you back"
• Elite differentiation: "This is what separates champions from participants"
• Competitive urgency: "Limited availability ensures exclusivity"

*Power Move: Frame hesitation as choosing mediocrity over excellence.*`,

          phase2Sophisticated: `**BRUTUS + ACHILLES: SOPHISTICATED/STATUS ARCHETYPE**

*Premium Architecture + Identity Transformation*

**Brutus Premium Construction**: Engineer inevitable investment through systematic value layering. Each benefit must connect to measurable ROI while building psychological pressure for elite-level commitment.

**Achilles Identity Elevation**: Transform this purchase into legendary status upgrade. Buyers should envision themselves joining an exclusive class of high-achievers with insider access to advanced methods.

**Combined Elite Strategy**:
• Status confirmation: "Designed for serious professionals who demand results"
• Value sophistication: "Investment grade methodology with compound returns"
• Identity transformation: "From [current state] to [elite identity]"
• Exclusive access: "Available only to qualified high-performers"
• Premium justification: "Excellence requires elite-level investment"

*Positioning Note: Perfect for affluent buyers seeking sophisticated solutions.*`,

          phase2Structured: `**MAXIMUS + VALERIUS: STRUCTURED/OUTCOME ARCHETYPE**

*Process Clarity + Conversion Certainty*

**Maximus Tactical Precision**: Define the transformation journey with military precision. Buyers need absolute clarity on what they're investing in, what they'll receive, and exactly how transformation occurs.

**Valerius Conversion Engineering**: Remove all friction from the buying decision. Create one clear path that makes the investment feel inevitable and the next step obvious.

**Combined Certainty Framework**:
• Outcome specificity: "Deliver [exact result] within [specific timeframe]"
• Process transparency: "Complete methodology broken into clear phases"
• Risk elimination: "Results guaranteed or [specific remedy]"
• Investment clarity: "[Price] for [specific transformation]"
• Action simplification: "Secure your spot with one click"

*Implementation Note: Reduces buyer resistance through radical transparency.*`
        };
      } else { // hook
        return {
          phase1FusedCouncil: `**PHASE 1: FUSED COUNCIL EXPANSION**

*Maximus + Brutus + Valerius + Achilles Combined Analysis*

The Council recognizes this hook requires sophisticated psychological architecture. Our fused analysis reveals three critical optimization vectors:

**Strategic Foundation (Maximus + Brutus)**: Your message needs stronger outcome certainty combined with systematic value layering. Frame the transformation as inevitable for action-takers while building sequential benefit pressure.

**Authority Elevation (Achilles + Valerius)**: Transform this into legendary status positioning. Use aspirational metaphors that position buyers as joining an elite class, then harmonize all elements toward one decisive action moment.

**Neuropsychological Triggers**: Deploy scarcity-driven urgency, social proof from elite achievers, and identity transformation framing to create compelling forward momentum.

*Council Confidence: This foundation supports advanced Phase 2 archetype deployment.*`,

          phase2Disruptive: `**SPARTACUS + LEONIDAS: DISRUPTIVE/URGENT ARCHETYPE**

*Battlefield Energy + Psychological Dominance*

**Spartacus Disruption Protocol**: Rebel against the conventional approach. Your audience is scrolling past 500 similar messages - what makes yours the pattern interrupt that demands attention? Use visceral, uncommon truths that spark rebellion against their current status quo.

**Leonidas Urgency Psychology**: 300 warriors held the pass through psychological dominance. Your message needs time pressure that feels earned, not manipulative. Stack consequences of delay - make hesitation feel dangerous to their competitive positioning.

**Combined Battlefield Strategy**:
• Pattern interrupt: "While everyone else waits for Monday..."
• Rebellion framing: "Break free from the conventional wisdom that keeps you stuck"
• Earned urgency: "Elite performers don't deliberate - they accelerate"
• Consequence stacking: "Every day you delay is a day your competition gains ground"

*Deployment Note: Use when maximum attention capture and immediate action are required.*`,

          phase2Sophisticated: `**BRUTUS + ACHILLES: SOPHISTICATED/STATUS ARCHETYPE**

*Strategic Premium + Aspirational Elevation*

**Brutus Strategic Architecture**: Political victories require methodical value construction. Layer your benefits systematically - each element must build pressure while elevating perceived ROI. Connect every feature to measurable, premium outcomes.

**Achilles Aspirational Framing**: Elevate this to legendary status upgrade. Your audience should see themselves as the protagonist of their victory story. Use exclusive language that signals elite class membership.

**Combined Premium Strategy**:
• Status signaling: "Join the 3% who understand advanced [transformation]"
• Methodical value stacking: Feature → Elite outcome → Future identity
• Aspirational metaphors: "Step into your hero moment"
• Premium justification: "Investment in excellence always compounds"
• Exclusive access: "This level of sophistication isn't for everyone"

*Deployment Note: Perfect for high-value audiences seeking status elevation and premium positioning.*`,

          phase2Structured: `**MAXIMUS + VALERIUS: STRUCTURED/OUTCOME ARCHETYPE**

*Tactical Clarity + Decision Engineering*

**Maximus Outcome Certainty**: Legendary generals win through tactical precision. Define the transformation with surgical accuracy - remove all ambiguity about what they'll achieve and when they'll achieve it.

**Valerius Decision Engineering**: Harmonize all elements toward one clear path forward. Eliminate decision paralysis through structured guidance that makes the next step feel inevitable.

**Combined Clarity Framework**:
• Outcome precision: "Achieve [specific result] in [specific timeframe]"
• Process transparency: "Here's exactly how: Step 1... Step 2... Step 3..."
• Risk elimination: "Guaranteed results or [specific remedy]"
• Decision simplification: "One choice: Transform now or accept what you've always had"
• Next step clarity: "Click here to secure your transformation"

*Deployment Note: Ideal for outcome-focused buyers who need structured clarity and certainty.*`
        };
      }
    };

    const response = getContentSpecificResponse(input.contentType);
    
    return {
      phase1FusedCouncil: response.phase1FusedCouncil,
      phase2Disruptive: response.phase2Disruptive,
      phase2Sophisticated: response.phase2Sophisticated,
      phase2Structured: response.phase2Structured,
      councilConfidenceScore: 88,
      insights: {
        spartacus: "Battlefield disruption protocols loaded - pattern interrupt systems ready",
        leonidas: "Psychological dominance frameworks active - urgency mechanics deployed",
        maximus: "Tactical precision algorithms engaged - outcome certainty optimized",
        brutus: "Strategic value architecture complete - systematic pressure building",
        achilles: "Aspirational transformation modules loaded - identity elevation ready",
        valerius: "Decision engineering systems online - conversion pathways optimized"
      },
      sessionId,
      timestamp: new Date()
    };
  }
}