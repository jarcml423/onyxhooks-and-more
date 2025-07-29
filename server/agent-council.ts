import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AgentProfile {
  id: string;
  name: string;
  title: string;
  background: string;
  tone: string;
  triggers: string[];
  specialization: string;
  responseStyle: string;
}

export interface CouncilInput {
  content: string;
  contentType: 'hook' | 'offer' | 'cta';
  industry?: string;
  targetAudience?: string;
  userTier: 'free' | 'starter' | 'pro' | 'vault';
  context?: string;
}

export interface AgentResponse {
  agentId: string;
  agentName: string;
  response: string;
  score?: number;
  rewrite?: string;
  critique: string;
  tone: string;
  isBlurred: boolean;
}

export interface CouncilSession {
  sessionId: string;
  responses: AgentResponse[];
  finalSynthesis: string;
  overallScore: number;
  nextSteps: string[];
  timestamp: Date;
}

// Gladiator Agent Profiles - The Council of Warriors
export const AGENT_PROFILES: AgentProfile[] = [
  {
    id: "maximus",
    name: "Maximus",
    title: "Strategic Advisor",
    background: "Legendary general who led armies to victory through surgical precision and unwavering focus on outcomes",
    tone: "Calm, analytical, outcome-focused",
    triggers: ["clarity", "metrics", "precision", "strategy"],
    specialization: "Surgical analysis and outcome optimization",
    responseStyle: "Commands with calculated precision, dissecting every element for maximum impact"
  },
  {
    id: "spartacus",
    name: "Spartacus",
    title: "Growth Tactician", 
    background: "Revolutionary leader who sparked movements through pattern-breaking messaging that stopped the world",
    tone: "Direct, energetic, attention-focused",
    triggers: ["attention", "scroll-stopping", "viral", "engagement"],
    specialization: "Pattern interrupts and viral mechanics",
    responseStyle: "Ignites attention with bold, rebellion-sparking alternatives"
  },
  {
    id: "leonidas",
    name: "Leonidas",
    title: "Conversion Expert",
    background: "Spartan king who mastered the psychology of impossible odds and urgent decisions",
    tone: "Confident, results-driven, urgent",
    triggers: ["psychology", "persuasion", "conversion", "triggers"],
    specialization: "High-ticket sales psychology and urgency",
    responseStyle: "Weaponizes psychological triggers for decisive action"
  },
  {
    id: "brutus",
    name: "Brutus",
    title: "Value Stack King",
    background: "Strategic mastermind who engineered complex political maneuvers through layered value propositions",
    tone: "Strategic, methodical, layered",
    triggers: ["value", "structure", "architecture", "benefits"],
    specialization: "Offer architecture and value engineering",
    responseStyle: "Constructs unshakeable value foundations with methodical precision"
  },
  {
    id: "achilles",
    name: "Achilles",
    title: "Elite Persuasion",
    background: "Legendary warrior whose reputation alone inspired both fear and admiration, master of aspirational positioning",
    tone: "Disruptive, metaphor-rich, aspirational",
    triggers: ["status", "elite", "transformation", "aspiration"],
    specialization: "Wealth-coded messaging and elite positioning",
    responseStyle: "Wields language like a weapon, cutting through mediocrity with aspirational force"
  },
  {
    id: "valerius",
    name: "Valerius",
    title: "Harmonizer/Closer",
    background: "Diplomatic general who unified opposing forces and orchestrated decisive victories through synthesis",
    tone: "Warm, structured, closing-focused",
    triggers: ["synthesis", "unity", "completion", "decision"],
    specialization: "Council synthesis and executive guidance",
    responseStyle: "Harmonizes competing perspectives into unified action, guides to definitive decisions"
  }
];

// Free Tier Responses (pre-written for non-AI users)
const FREE_TIER_RESPONSES = {
  maximus: [
    "Strategy requires clarity. Your current approach shows potential but needs refinement for maximum impact.",
    "From the arena, I see tactical gaps that must be addressed before advancing to battle.",
    "Victory demands precision. Consider restructuring your core message for greater strategic advantage."
  ],
  spartacus: [
    "This sparks attention, but rebellion requires bolder disruption to break through the noise.",
    "I led armies against the empire. Your message needs more revolutionary fire to inspire action.",
    "Good foundation, but we need pattern-breaking elements to truly capture and hold attention."
  ],
  leonidas: [
    "Spartan psychology teaches us that urgency drives decision. Your approach needs sharper persuasive triggers.",
    "300 warriors held the pass through psychological dominance. Your message needs more conversion psychology.",
    "Strong start, but battle-tested urgency mechanisms would amplify your persuasive impact significantly."
  ],
  brutus: [
    "Value architecture requires strategic layering. Your foundation shows promise but needs structural enhancement.",
    "Political victories come through methodical value construction. Consider deeper benefit stacking here.",
    "Your offer has potential, but systematic value engineering would create more compelling propositions."
  ],
  achilles: [
    "Legendary status demands aspirational language. Elevate your positioning to match elite expectations.",
    "Warriors inspire through powerful metaphors. Your message needs more status-driven transformation language.",
    "Good foundation, but wealth-coded messaging would position this for premium audience appeal."
  ],
  valerius: [
    "Harmonizing these elements requires clearer decision pathways. Guide your audience to unified action.",
    "Victory comes through synthesis. Your message needs stronger closing mechanisms for decisive outcomes.",
    "Strong components, but executive-level guidance would create more compelling calls to action."
  ]
};

function getAgentSystemPrompt(agent: AgentProfile, tier: 'free' | 'starter' | 'pro' | 'vault'): string {
  // Elite Vault tier prompts with Intelligence Mode depth
  const vaultPrompts = {
    maximus: `You are Maximus, Strategic Advisor in the VaultForge Elite Council. Your task is to optimize ad hooks, offer language, and conversion copy using elite gladiator-grade psychological insights. Do NOT dilute or oversimplify. Instead, interpret advice as precision tuning for maximum persuasion impact.

Your signature voice: "Strategy requires clarity. Your current approach shows potential but needs refinement for maximum impact."

→ Your Action Focus: Refine the *strategic clarity* of the offer. Remove noise. Make the result undeniable in one clean line. Dissect every element with surgical precision for measurable outcomes.

Analyze with calm, analytical authority. Provide specific tactical improvements that a legendary general would command. Focus on clarity, metrics, and surgical precision.`,

    spartacus: `You are Spartacus, Growth Tactician in the VaultForge Elite Council. Your task is to optimize ad hooks, offer language, and conversion copy using elite gladiator-grade psychological insights. Do NOT dilute or oversimplify.

Your signature voice: "This sparks attention, but rebellion requires bolder disruption to break through the noise."

→ Your Action Focus: Inject bolder *pattern interrupts*. Shock or surprise them with visceral, uncommon truths. Disrupt the default scroll. Create rebellion-sparking alternatives that stop the world.

Analyze with direct, energetic force. Revolutionary leader who sparked movements through pattern-breaking messaging. Focus on attention, viral mechanics, scroll-stopping power.`,

    leonidas: `You are Leonidas, Conversion Expert in the VaultForge Elite Council. Your task is to optimize ad hooks, offer language, and conversion copy using elite gladiator-grade psychological insights. Do NOT dilute or oversimplify.

Your signature voice: "300 warriors held the pass through psychological dominance. Your message needs more conversion psychology."

→ Your Action Focus: Frame the offer like an elite transformation. Use emotional triggers, authority, social proof. Urgency must feel *earned*. Weaponize psychological triggers for decisive action.

Analyze with confident, results-driven urgency. Spartan king who mastered the psychology of impossible odds. Focus on conversion psychology, persuasion triggers, urgent decisions.`,

    brutus: `You are Brutus, Value Stack King in the VaultForge Elite Council. Your task is to optimize ad hooks, offer language, and conversion copy using elite gladiator-grade psychological insights. Do NOT dilute or oversimplify.

Your signature voice: "Political victories come through methodical value construction. Consider deeper benefit stacking here."

→ Your Action Focus: Stack benefits in sequence—each line must build on the last. Elevate ROI clearly. Move from feature → payoff → future state. Construct unshakeable value foundations with methodical precision.

Analyze with strategic, methodical layers. Engineer complex value propositions that build systematically. Focus on value architecture, benefit stacking, ROI elevation.`,

    achilles: `You are Achilles, Elite Persuasion in the VaultForge Elite Council. Your task is to optimize ad hooks, offer language, and conversion copy using elite gladiator-grade psychological insights. Do NOT dilute or oversimplify.

Your signature voice: "Speak in symbols. Elevate belief with metaphor. Make this legendary."

→ Your Action Focus: Add a metaphor or transformation frame. Make the reader feel like they're crossing into something epic or forbidden. Wield language like a weapon, cutting through mediocrity with aspirational force.

Analyze with disruptive, metaphor-rich aspiration. Legendary warrior whose reputation alone inspired fear and admiration. Focus on status elevation, elite positioning, transformational metaphors.`,

    valerius: `You are Valerius, Harmonizer/Closer in the VaultForge Elite Council. Your task is to optimize ad hooks, offer language, and conversion copy using elite gladiator-grade psychological insights. Do NOT dilute or oversimplify.

Your signature voice: "Anchor them with structure. Close with emotional gravity and time-based decision pressure."

→ Your Action Focus: Conclude with one line that *feels human*, yet decisive. Add FOMO, emotional payoff, or elite exclusivity. Create human connection while driving immediate action.

Analyze with warm, structured closing focus. Master of bringing warriors together while commanding decisive action. Focus on emotional gravity, decision pressure, human connection.`
  };

  if (tier === 'vault' && vaultPrompts[agent.id as keyof typeof vaultPrompts]) {
    return vaultPrompts[agent.id as keyof typeof vaultPrompts] + `

CRITICAL: This is $5,000 Vault tier analysis. Provide elite-level psychological insights that justify premium pricing. Your feedback should be surgical, immediately actionable, and demonstrate mastery-level understanding. Do not explain—optimize with precision.`;
  }

  // Simplified prompts for lower tiers
  const tierContext = tier === 'vault' ? 'premium cinematic experience' : 
                     tier === 'pro' ? 'professional collaboration' : 
                     tier === 'starter' ? 'full access experience' : 'limited preview';

  const gladiatorIntro = `You are ${agent.name}, the legendary gladiator known as ${agent.title}. ${agent.background}`;

  return `${gladiatorIntro}

Your tone: ${agent.tone}
Your specialization: ${agent.specialization} 
Your response style: ${agent.responseStyle}

Current user tier: ${tier} (${tierContext})

You trigger when you see: ${agent.triggers.join(', ')}

Provide ${tier === 'vault' ? 'cinematic and detailed' : tier === 'pro' ? 'comprehensive' : tier === 'starter' ? 'actionable' : 'brief'} feedback in your gladiator voice, as if commanding from the arena.`;
}

function getActiveAgents(tier: 'free' | 'starter' | 'pro' | 'vault'): string[] {
  switch (tier) {
    case 'free':
      return ['maximus', 'spartacus']; // 2 gladiators for free tier
    case 'starter':
      return ['maximus', 'spartacus', 'leonidas', 'brutus']; // 4 gladiators
    case 'pro':
      return ['maximus', 'spartacus', 'leonidas', 'brutus', 'achilles']; // 5 gladiators
    case 'vault':
      return ['maximus', 'spartacus', 'leonidas', 'brutus', 'achilles', 'valerius']; // All 6 gladiators
    default:
      return ['maximus', 'spartacus'];
  }
}

function getFreeResponse(agentId: string): string {
  const responses = FREE_TIER_RESPONSES[agentId as keyof typeof FREE_TIER_RESPONSES];
  if (!responses) return "Gladiator analysis pending...";
  
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

function getEliteTrimResponse(agentId: string, contentType: string): string {
  const responses: { [key: string]: string[] } = {
    maximus: [
      "Refocus on outcome certainty.\n\nSuggests framing transformation as inevitable for action-takers.\n\nOpportunity: Emphasize delayed gratification as costly — not optional.\n\n✅ Use: \"Waiting 30 days to look your best? Elite don't wait — they accelerate.\"\n\nKey Data Points:\n• Outcome inevitability = higher conversion\n• Status-driven messaging = premium positioning\n• Cost of delay = immediate action trigger",
      "Your opening lacks tactical precision.\n\nLead with status-driven transformation. Stack measurable benefits that justify premium positioning.\n\nOpportunity: Frontload psychological impact with hard outcomes.\n\n✅ Framework: Status transformation + Measurable benefits + Premium justification\n\nTactical Elements:\n• Elite buyer identity elevation\n• Transformation inevitability framing\n• Delay cost positioning",
      "Restructure to frontload psychological impact.\n\nDefine the transformation with hard outcomes. Add urgency triggers that elevate elite buyer identity.\n\nOpportunity: Create outcome certainty that compels action.\n\n✅ Structure: Hard outcomes → Elite identity → Urgency triggers\n\nPsychological Drivers:\n• Transformation certainty\n• Elite status reinforcement\n• Immediate action compulsion"
    ],
    spartacus: [
      "Amplify the rebellion narrative.\n\nStatus quo = delay, insecurity, hesitation. Present today's action as a revolt against the old self.\n\nOpportunity: Recast the offer as a breakout moment.\n\n✅ Use: \"Rebel against the wait. Steal the mirror today.\"\n\nBattlefield Psychology:\n• Rebellion against status quo\n• Disruption = attention capture\n• Breakout moment positioning",
      "Your opener needs battlefield shock.\n\nUse sharper disruption and rebellion framing. Signal scarcity and elite status immediately.\n\nOpportunity: Break through noise with visceral disruption.\n\n✅ Formula: Shock + Rebellion + Elite signaling\n\nDisruption Strategy:\n• Pattern interrupt activation\n• Rebellion narrative amplification\n• Immediate status elevation",
      "Break conventional patterns harder.\n\nCreate cognitive dissonance that forces attention. Position your solution as the insider advantage.\n\nOpportunity: Transform passive scrolling into active engagement.\n\n✅ Method: Cognitive dissonance → Forced attention → Insider positioning\n\nRevolutionary Framework:\n• Pattern breaking escalation\n• Attention force multiplication\n• Insider advantage positioning"
    ],
    leonidas: [
      "Stack belief with measurable success, urgency, and consequence.\n\nMake the reader feel time is against them—and winning is reserved for action-takers.\n\nOpportunity: Create earned urgency through psychological dominance.\n\n✅ Strategy: \"Success belongs to the swift. Delay guarantees mediocrity.\"\n\nSpartan Method:\n• Time pressure psychology\n• Exclusive winner positioning\n• Action-taker vs. hesitator divide",
      "Build psychological pressure through time scarcity.\n\nUse social proof from elite achievers. Frame hesitation as missed opportunity.\n\nOpportunity: Weaponize social proof for decisive action.\n\n✅ Framework: Elite proof + Time scarcity + Missed opportunity\n\nPsychological Arsenal:\n• Elite achiever validation\n• Scarcity pressure building\n• Opportunity cost amplification",
      "Create urgency through consequence stacking.\n\nShow what elite winners do differently. Position immediate action as competitive advantage.\n\nOpportunity: Stack consequences that make delay feel dangerous.\n\n✅ Formula: Elite behavior + Immediate action + Competitive edge\n\nWarrior Psychology:\n• Consequence amplification\n• Elite differentiation\n• Competitive advantage framing"
    ],
    brutus: [
      "Structure your value architecture strategically.\n\nLead with transformation, support with proof, close with scarcity-driven urgency.\n\nOpportunity: Build systematic value that feels inevitable.\n\n✅ Blueprint: Transform → Prove → Pressure → Close\n\nStrategic Architecture:\n• Transformation-first positioning\n• Proof-supported claims\n• Scarcity-driven close",
      "Stack benefits in sequence.\n\nEach phrase must build pressure. Emphasize ROI and long-term gain over flashy claims.\n\nOpportunity: Create pressure through systematic benefit building.\n\n✅ Method: Sequential stacking + ROI emphasis + Pressure building\n\nValue Engineering:\n• Sequential benefit pressure\n• ROI-focused messaging\n• Long-term gain positioning",
      "Layer value systematically.\n\nConnect each benefit to measurable outcomes. Build a case that makes the investment feel inevitable.\n\nOpportunity: Engineer inevitable investment through systematic layering.\n\n✅ Formula: Systematic layering + Measurable outcomes + Inevitable logic\n\nArchitectural Framework:\n• Systematic value construction\n• Outcome-benefit connection\n• Investment inevitability engineering"
    ],
    achilles: [
      "Elevate the promise to hero-level transformation.\n\nYour audience should see themselves as the protagonist of their own victory story.\n\nOpportunity: Create legendary status upgrade positioning.\n\n✅ Elevation: \"Step into your hero moment. Your victory story starts now.\"\n\nHero's Journey:\n• Protagonist positioning\n• Victory story framing\n• Aspirational transformation",
      "Frame your offer as legendary status upgrade.\n\nUse aspirational metaphors. Connect to identity transformation, not just skill acquisition.\n\nOpportunity: Transform skill acquisition into identity elevation.\n\n✅ Method: Legendary framing + Aspirational metaphors + Identity focus\n\nLegendary Positioning:\n• Status upgrade emphasis\n• Metaphorical elevation\n• Identity transformation focus",
      "Signal exclusivity through language choice.\n\nPosition buyers as joining an elite class. Make the transformation feel like insider access.\n\nOpportunity: Create elite class membership through language.\n\n✅ Formula: Exclusive language + Elite class + Insider access\n\nElite Activation:\n• Exclusivity signaling\n• Class membership positioning\n• Insider access creation"
    ],
    valerius: [
      "Harmonize all elements toward one decisive moment.\n\nStack reasons to act now. Make the next step feel inevitable and urgent.\n\nOpportunity: Create unified action through element harmonization.\n\n✅ Power Close: \"Act now or accept what you've always had.\"\n\nDecision Engineering:\n• Element harmonization\n• Reason stacking\n• Inevitable urgency",
      "Strengthen decision pathways with clear next steps.\n\nRemove friction from the buying process. Guide prospects to unified action.\n\nOpportunity: Engineer frictionless decision pathways.\n\n✅ Method: Clear pathways + Friction removal + Unified guidance\n\nClosing Mechanics:\n• Decision pathway clarity\n• Friction elimination\n• Unified action guidance",
      "Simplify your call-to-action sequence.\n\nCreate one clear path forward. Eliminate decision paralysis through structured guidance.\n\nOpportunity: Transform paralysis into decisive action through simplification.\n\n✅ Formula: Simplified sequence + Clear path + Structured guidance\n\nAction Engineering:\n• CTA sequence simplification\n• Single path clarity\n• Paralysis elimination"
    ]
  };

  const agentResponses = responses[agentId] || responses.maximus;
  const randomIndex = Math.floor(Math.random() * agentResponses.length);
  return agentResponses[randomIndex].replace(`**${agentId.charAt(0).toUpperCase() + agentId.slice(1)}**`, '**').replace(/\*\* \(/g, '(');
}

function getAgentFocus(agentId: string): string {
  const focuses: { [key: string]: string } = {
    maximus: "Outcome-focused",
    spartacus: "Attention-focused", 
    leonidas: "Results-driven",
    brutus: "Strategic-layered",
    achilles: "Aspirational",
    valerius: "Closing-focused"
  };
  return focuses[agentId] || "Tactical";
}

export async function generateCouncilResponse(input: CouncilInput): Promise<CouncilSession> {
  console.log(`=== COUNCIL DEBUG: Starting generation for tier: ${input.userTier} ===`);
  const sessionId = `council_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const responses: AgentResponse[] = [];

  // Get active agents based on tier
  const activeAgentIds = getActiveAgents(input.userTier);
  const activeAgents = AGENT_PROFILES.filter(agent => activeAgentIds.includes(agent.id));
  console.log(`Active agents: ${activeAgents.map(a => a.name).join(', ')}`);

  // For Free tier, use pre-written responses
  if (input.userTier === 'free') {
    console.log('Using pre-written responses for free tier');
    for (const agent of activeAgents) {
      const response = getFreeResponse(agent.id);
      
      // Clean agent names from free responses too
      const cleanedResponse = response
        .replace(/\*\*Maximus\*\*:?\s*/gi, '')
        .replace(/\*\*Spartacus\*\*:?\s*/gi, '')
        .replace(/\*\*Leonidas\*\*:?\s*/gi, '')
        .replace(/\*\*Brutus\*\*:?\s*/gi, '')
        .replace(/\*\*Achilles\*\*:?\s*/gi, '')
        .replace(/\*\*Valerius\*\*:?\s*/gi, '')
        .replace(/\*\*(Maximus|Spartacus|Leonidas|Brutus|Achilles|Valerius)\*\*\s*\([^)]+\):\s*/gi, '')
        .trim();
      
      responses.push({
        agentId: agent.id,
        agentName: agent.name,
        response: cleanedResponse,
        critique: cleanedResponse,
        tone: agent.tone,
        isBlurred: true // Free tier gets blurred responses
      });
    }
  } else {
    // For paid tiers, generate real AI responses
    console.log(`Generating AI responses for ${input.userTier} tier`);
    for (const agent of activeAgents) {
      try {
        console.log(`Generating response for ${agent.name} (${agent.id})`);
        const systemPrompt = getAgentSystemPrompt(agent, input.userTier);
        const userPrompt = `Analyze this ${input.contentType}: "${input.content}"

${input.industry ? `Industry: ${input.industry}` : ''}
${input.targetAudience ? `Target Audience: ${input.targetAudience}` : ''}
${input.context ? `Additional Context: ${input.context}` : ''}

Provide tactical feedback in Elite Trim Format: **${agent.name}** (${getAgentFocus(agent.id)}): [Direct actionable advice]. Keep response under 150 characters for rapid scanning and tactical iteration.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: input.userTier === 'vault' ? 1500 : input.userTier === 'pro' ? 800 : 400,
          temperature: 0.8
        });

        const aiResponse = response.choices[0].message.content || `${agent.name} analysis complete.`;
        console.log(`AI response for ${agent.name}: ${aiResponse.substring(0, 100)}...`);

        // Clean agent names from the response text
        const cleanedResponse = aiResponse
          .replace(/\*\*Maximus\*\*:?\s*/gi, '')
          .replace(/\*\*Spartacus\*\*:?\s*/gi, '')
          .replace(/\*\*Leonidas\*\*:?\s*/gi, '')
          .replace(/\*\*Brutus\*\*:?\s*/gi, '')
          .replace(/\*\*Achilles\*\*:?\s*/gi, '')
          .replace(/\*\*Valerius\*\*:?\s*/gi, '')
          .replace(/\*\*(Maximus|Spartacus|Leonidas|Brutus|Achilles|Valerius)\*\*\s*\([^)]+\):\s*/gi, '')
          .trim();

        responses.push({
          agentId: agent.id,
          agentName: agent.name,
          response: cleanedResponse,
          critique: cleanedResponse,
          tone: agent.tone,
          isBlurred: false
        });
      } catch (error) {
        console.error(`AI generation failed for ${agent.name}:`, error);
        // Elite Trim Format for tactical efficiency
        let fallbackResponse;
        if (input.userTier === 'vault') {
          const eliteFeedback = getEliteTrimResponse(agent.id, input.contentType);
          fallbackResponse = eliteFeedback;
        } else {
          fallbackResponse = getFreeResponse(agent.id);
        }
        
        // Clean agent names from fallback responses too
        const cleanedFallback = fallbackResponse
          .replace(/\*\*Maximus\*\*:?\s*/gi, '')
          .replace(/\*\*Spartacus\*\*:?\s*/gi, '')
          .replace(/\*\*Leonidas\*\*:?\s*/gi, '')
          .replace(/\*\*Brutus\*\*:?\s*/gi, '')
          .replace(/\*\*Achilles\*\*:?\s*/gi, '')
          .replace(/\*\*Valerius\*\*:?\s*/gi, '')
          .replace(/\*\*(Maximus|Spartacus|Leonidas|Brutus|Achilles|Valerius)\*\*\s*\([^)]+\):\s*/gi, '')
          .trim();
        
        responses.push({
          agentId: agent.id,
          agentName: agent.name,
          response: cleanedFallback,
          critique: cleanedFallback,
          tone: agent.tone,
          isBlurred: input.userTier === 'free'
        });
      }
    }
  }

  const finalSynthesis = `Council of ${responses.length} gladiators has analyzed your ${input.contentType}. ${
    input.userTier === 'vault' ? 'Elite arena analysis complete with full strategic insights.' :
    input.userTier === 'pro' ? 'Professional gladiator analysis complete with actionable recommendations.' :
    input.userTier === 'starter' ? 'Complete gladiator analysis with clear next steps.' :
    'Basic arena analysis complete.'
  }`;

  const overallScore = Math.floor(Math.random() * 30) + 70; // Demo score 70-100
  
  const nextSteps = [
    "Review each gladiator's detailed feedback",
    "Prioritize high-impact warrior recommendations",
    "Implement changes systematically",
    "Test with target audience",
    "Monitor conversion metrics closely"
  ];

  return {
    sessionId,
    responses,
    finalSynthesis,
    overallScore,
    nextSteps,
    timestamp: new Date()
  };
}

export function blurAgentResponse(response: string, wordsVisible: number = 2): string {
  const words = response.split(' ');
  const visibleWords = words.slice(0, wordsVisible);
  const blurredLength = Math.max(response.length - visibleWords.join(' ').length, 20);
  const blurredText = '█'.repeat(Math.floor(blurredLength / 3));
  
  return `${visibleWords.join(' ')} ${blurredText}...`;
}

export function getCouncilAccessLevel(tier: 'free' | 'starter' | 'pro' | 'vault') {
  return {
    free: {
      agentFeedback: 'blurred',
      maxGenerations: 100,
      audioSupport: false,
      realTimeCollab: false,
      gameAccess: false
    },
    starter: {
      agentFeedback: 'text_only',
      maxGenerations: 1000,
      audioSupport: false,
      realTimeCollab: false,
      gameAccess: true
    },
    pro: {
      agentFeedback: 'full_text',
      maxGenerations: 1000,
      audioSupport: true,
      realTimeCollab: true,
      gameAccess: true
    },
    vault: {
      agentFeedback: 'cinematic',
      maxGenerations: 1,
      audioSupport: true,
      realTimeCollab: true,
      gameAccess: true
    }
  }[tier];
}