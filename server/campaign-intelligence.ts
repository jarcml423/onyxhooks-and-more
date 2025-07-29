import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CampaignMetrics {
  campaignName: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  adSpend: number;
  signups: number;
  churnedUsers: number;
  timeframe: string;
}

export interface CampaignScore {
  overall: number;
  roi: number;
  cac: number;
  ctr: number;
  churnImpact: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  status: 'excellent' | 'good' | 'needs_attention' | 'underperforming' | 'critical';
}

export interface CampaignRecommendation {
  type: 'copy_improvement' | 'targeting_adjustment' | 'budget_reallocation' | 'timing_optimization' | 'creative_refresh';
  priority: 'high' | 'medium' | 'low';
  description: string;
  expectedImpact: string;
  actionItems: string[];
  estimatedROILift: number;
}

export interface CampaignIntelligence {
  campaignName: string;
  score: CampaignScore;
  recommendations: CampaignRecommendation[];
  keyInsights: string[];
  nextActions: string[];
  competitorBenchmark?: {
    industryAverage: number;
    topPerformer: number;
    yourPosition: 'above' | 'at' | 'below';
  };
}

export function calculateCampaignScore(metrics: CampaignMetrics): CampaignScore {
  // Calculate core metrics
  const ctr = metrics.clicks / metrics.impressions * 100;
  const conversionRate = metrics.conversions / metrics.clicks * 100;
  const roi = ((metrics.revenue - metrics.adSpend) / metrics.adSpend) * 100;
  const cac = metrics.adSpend / metrics.signups;
  const churnRate = metrics.churnedUsers / metrics.signups * 100;
  
  // Score each dimension (0-100)
  const roiScore = Math.min(100, Math.max(0, (roi + 100) / 3)); // -200% to 400% ROI mapped to 0-100
  const cacScore = Math.min(100, Math.max(0, 100 - (cac / 50) * 100)); // $0-$50 CAC mapped to 100-0
  const ctrScore = Math.min(100, ctr * 10); // 0-10% CTR mapped to 0-100
  const churnScore = Math.min(100, Math.max(0, 100 - churnRate * 2)); // 0-50% churn mapped to 100-0
  
  // Weighted overall score
  const overall = (roiScore * 0.4) + (cacScore * 0.25) + (ctrScore * 0.2) + (churnScore * 0.15);
  
  // Determine grade and status
  let grade: CampaignScore['grade'];
  let status: CampaignScore['status'];
  
  if (overall >= 90) { grade = 'A+'; status = 'excellent'; }
  else if (overall >= 85) { grade = 'A'; status = 'excellent'; }
  else if (overall >= 80) { grade = 'B+'; status = 'good'; }
  else if (overall >= 75) { grade = 'B'; status = 'good'; }
  else if (overall >= 70) { grade = 'C+'; status = 'needs_attention'; }
  else if (overall >= 60) { grade = 'C'; status = 'needs_attention'; }
  else if (overall >= 50) { grade = 'D'; status = 'underperforming'; }
  else { grade = 'F'; status = 'critical'; }
  
  return {
    overall: Math.round(overall),
    roi: Math.round(roiScore),
    cac: Math.round(cacScore),
    ctr: Math.round(ctrScore),
    churnImpact: Math.round(churnScore),
    grade,
    status
  };
}

export async function generateCampaignRecommendations(
  metrics: CampaignMetrics, 
  score: CampaignScore
): Promise<CampaignRecommendation[]> {
  try {
    const prompt = `
You are a campaign optimization expert analyzing performance data. Generate specific, actionable recommendations.

Campaign: ${metrics.campaignName}
Source: ${metrics.utmSource} | Medium: ${metrics.utmMedium}
Performance: ${score.grade} (${score.overall}/100)

Metrics:
- CTR: ${(metrics.clicks / metrics.impressions * 100).toFixed(2)}%
- Conversion Rate: ${(metrics.conversions / metrics.clicks * 100).toFixed(2)}%
- ROI: ${(((metrics.revenue - metrics.adSpend) / metrics.adSpend) * 100).toFixed(2)}%
- CAC: $${(metrics.adSpend / metrics.signups).toFixed(2)}
- Churn Rate: ${(metrics.churnedUsers / metrics.signups * 100).toFixed(2)}%

Generate 3-5 specific recommendations in JSON format:
{
  "recommendations": [
    {
      "type": "copy_improvement|targeting_adjustment|budget_reallocation|timing_optimization|creative_refresh",
      "priority": "high|medium|low",
      "description": "Specific recommendation",
      "expectedImpact": "Projected outcome",
      "actionItems": ["Step 1", "Step 2", "Step 3"],
      "estimatedROILift": number (percentage)
    }
  ]
}

Focus on the lowest-scoring metrics and provide data-driven suggestions.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    return result.recommendations || [];
  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    // Fallback recommendations based on score analysis
    const fallbackRecommendations: CampaignRecommendation[] = [];
    
    if (score.ctr < 50) {
      fallbackRecommendations.push({
        type: 'copy_improvement',
        priority: 'high',
        description: 'Low click-through rate indicates weak ad copy or targeting mismatch',
        expectedImpact: 'Improve CTR by 25-40% with more compelling headlines',
        actionItems: [
          'A/B test 3 new headline variations',
          'Add urgency or scarcity elements',
          'Include specific value propositions'
        ],
        estimatedROILift: 15
      });
    }
    
    if (score.cac > 60) {
      fallbackRecommendations.push({
        type: 'targeting_adjustment',
        priority: 'high',
        description: 'High customer acquisition cost suggests inefficient targeting',
        expectedImpact: 'Reduce CAC by 20-30% through better audience segmentation',
        actionItems: [
          'Analyze top-converting audience segments',
          'Exclude low-performing demographics',
          'Create lookalike audiences from best customers'
        ],
        estimatedROILift: 25
      });
    }
    
    if (score.roi < 40) {
      fallbackRecommendations.push({
        type: 'budget_reallocation',
        priority: 'high',
        description: 'Poor ROI requires immediate budget optimization',
        expectedImpact: 'Improve ROI by 30-50% through strategic budget shifts',
        actionItems: [
          'Pause underperforming ad sets',
          'Increase budget on top performers',
          'Optimize bid strategies for conversions'
        ],
        estimatedROILift: 35
      });
    }
    
    return fallbackRecommendations;
  }
}

export async function generateCampaignIntelligence(metrics: CampaignMetrics): Promise<CampaignIntelligence> {
  const score = calculateCampaignScore(metrics);
  const recommendations = await generateCampaignRecommendations(metrics, score);
  
  // Generate key insights
  const keyInsights = [
    `Campaign grade: ${score.grade} with ${score.overall}% overall performance`,
    `${score.status === 'excellent' ? 'Exceptional' : score.status === 'good' ? 'Strong' : 'Needs improvement'} across key metrics`,
    `ROI: ${(((metrics.revenue - metrics.adSpend) / metrics.adSpend) * 100).toFixed(1)}%, CAC: $${(metrics.adSpend / metrics.signups).toFixed(2)}`,
    `${recommendations.length} optimization opportunities identified`
  ];
  
  // Generate next actions
  const nextActions = recommendations
    .filter(rec => rec.priority === 'high')
    .slice(0, 3)
    .map(rec => rec.actionItems[0]);
  
  // Industry benchmark (mock data for demo)
  const competitorBenchmark = {
    industryAverage: 65,
    topPerformer: 85,
    yourPosition: score.overall >= 85 ? 'above' as const : 
                 score.overall >= 65 ? 'at' as const : 'below' as const
  };
  
  return {
    campaignName: metrics.campaignName,
    score,
    recommendations,
    keyInsights,
    nextActions,
    competitorBenchmark
  };
}

export function flagUnderperformingCampaigns(campaigns: CampaignIntelligence[]): CampaignIntelligence[] {
  return campaigns.filter(campaign => 
    campaign.score.status === 'underperforming' || 
    campaign.score.status === 'critical'
  );
}

export function prioritizeRecommendations(campaigns: CampaignIntelligence[]): CampaignRecommendation[] {
  const allRecommendations = campaigns.flatMap(campaign => 
    campaign.recommendations.map(rec => ({
      ...rec,
      campaignName: campaign.campaignName
    }))
  );
  
  return allRecommendations
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.estimatedROILift - a.estimatedROILift;
    })
    .slice(0, 10); // Top 10 recommendations
}