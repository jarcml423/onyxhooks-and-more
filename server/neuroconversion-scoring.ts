import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface NeuroConversionScore {
  overallScore: number;
  riskAssessment: number;
  costJustification: number;
  timeBelievability: number;
  statusElevation: number;
  buyerProfile: 'skeptical' | 'status-seeking' | 'solution-hungry';
  psychologicalTriggers: string[];
  optimizationSuggestions: string[];
  conversionPrediction: 'low' | 'medium' | 'high' | 'elite';
}

export interface ContentAnalysis {
  content: string;
  type: 'hook' | 'offer' | 'cta';
  industry?: string;
  targetAudience?: string;
}

export async function analyzeNeuroConversion(analysis: ContentAnalysis): Promise<NeuroConversionScore> {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are MOSAIC, VaultForge Elite's lead neuropsychologist specializing in conversion psychology and cognitive bias analysis.

NEUROCONVERSION SCORING FRAMEWORK:

RISK ASSESSMENT (1-10): Psychological risk perception
- 1-3: High perceived risk (complex, vague, unproven)
- 4-6: Moderate risk (some proof, clear but cautious)
- 7-10: Low perceived risk (proven, guaranteed, low commitment)

COST JUSTIFICATION (1-10): Value stack vs investment psychology
- 1-3: Poor value perception (price-focused, unclear ROI)
- 4-6: Acceptable value (basic benefits, reasonable price)
- 7-10: Exceptional value (transformation worth investment)

TIME BELIEVABILITY (1-10): Realistic timeline credibility
- 1-3: Unrealistic promises (overnight success, too fast)
- 4-6: Believable timeframe (reasonable expectations)
- 7-10: Perfectly calibrated (achievable, specific, credible)

STATUS ELEVATION (1-10): Identity transformation positioning
- 1-3: Generic positioning (basic benefits, no identity shift)
- 4-6: Moderate positioning (some status elements)
- 7-10: Elite positioning (clear identity upgrade, premium status)

BUYER PSYCHOLOGY PROFILES:
- SKEPTICAL: Need proof, testimonials, guarantees, risk reversal
- STATUS-SEEKING: Want exclusivity, premium positioning, identity elevation
- SOLUTION-HUNGRY: Focus on pain relief, urgency, clear outcomes

PSYCHOLOGICAL TRIGGERS TO DETECT:
- Authority (expert positioning, credentials)
- Social Proof (testimonials, case studies, numbers)
- Scarcity (limited time, limited spots, urgency)
- Reciprocity (free value, bonuses, giving first)
- Commitment (identity alignment, public commitment)
- Liking (similarity, shared values, relatability)

Response format: Return a JSON object with numerical scores, buyer profile classification, identified triggers, and specific optimization suggestions for maximum neurological impact.`
      },
      {
        role: "user", 
        content: `Analyze this ${analysis.type} for neuroconversion potential:

CONTENT: "${analysis.content}"
TYPE: ${analysis.type}
${analysis.industry ? `INDUSTRY: ${analysis.industry}` : ''}
${analysis.targetAudience ? `TARGET: ${analysis.targetAudience}` : ''}

Provide detailed neuropsychological analysis with scores and optimization recommendations.`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1500
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");

  // Calculate overall score and prediction
  const scores = [
    result.risk_assessment || 5,
    result.cost_justification || 5, 
    result.time_believability || 5,
    result.status_elevation || 5
  ];
  
  const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / 4 * 10);
  
  let conversionPrediction: 'low' | 'medium' | 'high' | 'elite';
  if (overallScore >= 85) conversionPrediction = 'elite';
  else if (overallScore >= 70) conversionPrediction = 'high';
  else if (overallScore >= 50) conversionPrediction = 'medium';
  else conversionPrediction = 'low';

  return {
    overallScore,
    riskAssessment: result.risk_assessment || 5,
    costJustification: result.cost_justification || 5,
    timeBelievability: result.time_believability || 5,
    statusElevation: result.status_elevation || 5,
    buyerProfile: result.buyer_profile || 'solution-hungry',
    psychologicalTriggers: result.psychological_triggers || [],
    optimizationSuggestions: result.optimization_suggestions || [],
    conversionPrediction
  };
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#F9C80E'; // Gold
  if (score >= 70) return '#1C84FF'; // Blue  
  if (score >= 50) return '#10B981'; // Green
  return '#EF4444'; // Red
}

export function getScoreLevel(score: number): string {
  if (score >= 85) return 'Elite';
  if (score >= 70) return 'High';
  if (score >= 50) return 'Medium';
  return 'Low';
}

export function getBuyerProfileInsights(profile: string): {
  description: string;
  triggers: string[];
  optimizations: string[];
} {
  const profiles = {
    skeptical: {
      description: "High-trust barriers, proof-driven, risk-averse decision making",
      triggers: ["Social Proof", "Authority", "Risk Reversal", "Guarantees"],
      optimizations: [
        "Add testimonials and case studies",
        "Include credentials and authority markers", 
        "Offer guarantees or risk reversal",
        "Use specific numbers and data"
      ]
    },
    'status-seeking': {
      description: "Ego-driven, premium positioning, exclusivity-motivated",
      triggers: ["Scarcity", "Authority", "Social Status", "Exclusivity"],
      optimizations: [
        "Emphasize premium positioning",
        "Add exclusivity elements (limited spots)",
        "Focus on status elevation and identity shift",
        "Use aspirational language and imagery"
      ]
    },
    'solution-hungry': {
      description: "Pain-driven, urgency-responsive, outcome-focused",
      triggers: ["Problem Agitation", "Urgency", "Clear Outcomes", "Pain Relief"],
      optimizations: [
        "Agitate current pain points",
        "Create urgency with time-sensitive offers",
        "Focus on clear, specific outcomes",
        "Emphasize immediate relief and transformation"
      ]
    }
  };

  return profiles[profile as keyof typeof profiles] || profiles['solution-hungry'];
}