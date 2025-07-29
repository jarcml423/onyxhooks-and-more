import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface EliteContentInput {
  industry: string;
  targetAudience: string;
  businessModel: string;
  painPoint: string;
  desiredOutcome: string;
  pricePoint: string;
  competitorAnalysis?: string;
  brandPersonality: string;
}

interface EliteContentOutput {
  strategicFramework: {
    marketPosition: string;
    competitiveDifferentiation: string;
    psychologicalTriggers: string[];
    conversionStrategy: string;
  };
  campaignAssets: {
    hook: string;
    problemAgitation: string;
    authorityBuilding: string;
    solutionPresentation: string;
    socialProof: string;
    urgencyMechanism: string;
    callToAction: string;
  };
  psychologicalProfile: {
    customerAvatar: string;
    emotionalDrivers: string[];
    cognitiveBiases: string[];
    decisionMakingProcess: string;
  };
  marketIntelligence: {
    industryInsights: string;
    trendAnalysis: string;
    opportunityGaps: string[];
    riskFactors: string[];
  };
  conversionOptimization: {
    primaryMessage: string;
    secondaryMessages: string[];
    objectionHandling: string[];
    valueStackBuilding: string;
  };
}

// Industry Language Style Helper
function getIndustryLanguageStyle(industry: string) {
  const styles = {
    fitness: {
      tone: "energetic and motivational",
      accessibility: "relatable fitness metaphors",
      metaphors: "body-building and athletic analogies", 
      vocabulary: "performance, transformation, results-driven language",
      approachability: "direct and encouraging"
    },
    business: {
      tone: "professional and strategic",
      accessibility: "business-savvy but not overly technical",
      metaphors: "growth and scaling analogies",
      vocabulary: "ROI, systems, optimization language",
      approachability: "confident yet approachable"
    },
    finance: {
      tone: "analytical and authoritative", 
      accessibility: "sophisticated but clear financial concepts",
      metaphors: "investment and wealth-building analogies",
      vocabulary: "portfolio, compound, leverage terminology",
      approachability: "expert yet trustworthy"
    },
    consulting: {
      tone: "strategic and insightful",
      accessibility: "high-level but actionable insights",
      metaphors: "strategic warfare and chess analogies",
      vocabulary: "framework, methodology, optimization language", 
      approachability: "authoritative yet collaborative"
    }
  };
  
  return styles[industry as keyof typeof styles] || styles.business;
}

export async function generateEliteContent(input: EliteContentInput): Promise<EliteContentOutput> {
  // Get industry-adaptive language guidance
  const industryLanguageStyle = getIndustryLanguageStyle(input.industry);
  
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are the VaultForge Elite Council - a team of 5 world-class strategists with advanced psychological profiling capabilities:

🏛️ ALEX HORMOZI (Strategy Lead): $100M+ business scaling, value equation mastery, buyer psychology segmentation
🔥 SABRI SUBY (Acquisition): $500M+ ad spend, conversion psychology, neurological trigger optimization  
🧠 MOSAIC (Psychology): Behavioral trigger analysis, neuroplasticity, decision architecture, cognitive bias exploitation
⚡ BLAZE (Execution): Rapid implementation, systematic optimization, performance amplification, conversion velocity
🎯 MICHAEL (Closer): High-ticket sales, objection handling, neuropsychological closing techniques

ENHANCED COUNCIL DIRECTIVE: Generate ${industryLanguageStyle.tone} strategies with advanced buyer psychology analysis:

BUYER PSYCHOLOGY PROFILING:
- SKEPTICAL BUYERS: High-trust barriers, need proof-heavy messaging, risk-averse
- STATUS-SEEKING BUYERS: Ego-driven, premium positioning, exclusivity triggers
- SOLUTION-HUNGRY BUYERS: Pain-driven, urgency-responsive, outcome-focused

NEUROCONVERSION ANALYSIS FRAMEWORK:
Risk Assessment: Rate psychological risk perception (1-10)
Cost Justification: Value stack vs investment psychology 
Time Believability: Realistic timeline credibility
Status Elevation: Identity transformation positioning

LANGUAGE ADAPTATION FOR ${input.industry.toUpperCase()}:
- Replace technical jargon with ${industryLanguageStyle.metaphors}
- Use ${industryLanguageStyle.vocabulary} that resonates with ${input.targetAudience}
- Maintain authority while being ${industryLanguageStyle.approachability}
- Echo user's natural language patterns from input while elevating sophistication

STRATEGIC ECHOING PROTOCOL:
- Mirror user's transformation language style
- Amplify their core pain point terminology
- Reflect their natural metaphors with premium elevation

Alex's Enhanced Value Equation: (Dream Outcome × Perceived Likelihood) - (Time Delay + Effort Required + Risk Factors + Status Threats) = NEUROCONVERSION VALUE

Response format: Comprehensive JSON with buyer psychology profiles, neuroconversion scoring, strategic frameworks, and conversion copy optimized for maximum psychological impact.`
      },
      {
        role: "user",
        content: `Develop an elite marketing strategy for:

Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Business Model: ${input.businessModel}
Core Pain Point: ${input.painPoint}
Desired Outcome: ${input.desiredOutcome}
Price Point: ${input.pricePoint}
Brand Personality: ${input.brandPersonality}

Deliver a comprehensive strategic framework with:
1. Advanced market positioning analysis
2. Psychological trigger identification and deployment
3. Multi-layered conversion strategy
4. Deep customer psychology profiling
5. Industry-specific intelligence and trend analysis
6. Premium copy that demonstrates exceptional understanding

The output should feel like it was created by a team of the world's top strategists, psychologists, and copywriters working together. Every element should show sophisticated understanding of human behavior, market dynamics, and conversion psychology.`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 4000
  });

  const content = JSON.parse(response.choices[0].message.content || "{}");

  return {
    strategicFramework: {
      marketPosition: content.strategic_framework?.market_position || "Premium market leader with differentiated value proposition",
      competitiveDifferentiation: content.strategic_framework?.competitive_differentiation || "Unique positioning in marketplace",
      psychologicalTriggers: content.strategic_framework?.psychological_triggers || ["Authority", "Scarcity", "Social Proof"],
      conversionStrategy: content.strategic_framework?.conversion_strategy || "Multi-touch attribution model with psychological progression"
    },
    campaignAssets: {
      hook: content.campaign_assets?.hook || "Premium hook with psychological triggers",
      problemAgitation: content.campaign_assets?.problem_agitation || "Deep problem exploration with emotional resonance",
      authorityBuilding: content.campaign_assets?.authority_building || "Credibility establishment through proof and expertise",
      solutionPresentation: content.campaign_assets?.solution_presentation || "Comprehensive solution architecture",
      socialProof: content.campaign_assets?.social_proof || "Multi-layered validation and testimonials",
      urgencyMechanism: content.campaign_assets?.urgency_mechanism || "Psychological urgency with genuine scarcity",
      callToAction: content.campaign_assets?.call_to_action || "Compelling action-oriented directive"
    },
    psychologicalProfile: {
      customerAvatar: content.psychological_profile?.customer_avatar || "Detailed customer archetype with behavioral patterns",
      emotionalDrivers: content.psychological_profile?.emotional_drivers || ["Achievement", "Security", "Recognition"],
      cognitiveBiases: content.psychological_profile?.cognitive_biases || ["Loss Aversion", "Authority Bias", "Social Proof"],
      decisionMakingProcess: content.psychological_profile?.decision_making_process || "Rational evaluation with emotional validation"
    },
    marketIntelligence: {
      industryInsights: content.market_intelligence?.industry_insights || "Key industry trends and opportunities",
      trendAnalysis: content.market_intelligence?.trend_analysis || "Emerging patterns and market shifts",
      opportunityGaps: content.market_intelligence?.opportunity_gaps || ["Unmet market needs", "Competitive weaknesses"],
      riskFactors: content.market_intelligence?.risk_factors || ["Market volatility", "Competitive threats"]
    },
    conversionOptimization: {
      primaryMessage: content.conversion_optimization?.primary_message || "Core value proposition with psychological appeal",
      secondaryMessages: content.conversion_optimization?.secondary_messages || ["Supporting benefits", "Risk mitigation"],
      objectionHandling: content.conversion_optimization?.objection_handling || ["Price concerns", "Trust issues", "Timing objections"],
      valueStackBuilding: content.conversion_optimization?.value_stack_building || "Comprehensive value articulation with perceived value maximization"
    }
  };
}

export async function generateIndustryBackground(industry: string): Promise<{
  backgroundStyle: string;
  colorPalette: string[];
  visualElements: string[];
  luxuryLevel: string;
}> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a luxury brand designer who creates opulent visual experiences for Fortune 500 companies. Generate sophisticated background and visual styling recommendations."
      },
      {
        role: "user",
        content: `Create luxury visual styling for ${industry} industry that feels like Range Rover meets Big 4 consulting presentation. Include background styles, premium color palettes, and visual elements that convey opulence and exclusivity.`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.6,
    max_tokens: 1000
  });

  const styling = JSON.parse(response.choices[0].message.content || "{}");

  return {
    backgroundStyle: styling.background_style || "Gradient with subtle geometric patterns",
    colorPalette: styling.color_palette || ["#1a1a1a", "#2d3748", "#4a5568", "#d4af37"],
    visualElements: styling.visual_elements || ["Subtle grid patterns", "Floating particles", "Glass morphism"],
    luxuryLevel: styling.luxury_level || "Ultra-premium with sophisticated restraint"
  };
}