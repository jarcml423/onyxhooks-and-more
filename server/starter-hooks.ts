import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface StarterHookInput {
  industry: string;
  targetAudience: string;
  painPoint: string;
  desiredOutcome: string;
  tonePref?: string;
}

export interface StarterGladiatorHook {
  gladiator: 'Maximus' | 'Spartacus' | 'Leonidas';
  hook: string;
  critique: string;
  conversionTips: string[];
  variation: string;
}

export interface StarterHookResponse {
  hooks: StarterGladiatorHook[];
  councilConsensus: string;
  abTestSuggestion: string;
  upgradeTeaser: string;
  hooksRemaining: number;
}

function getStarterHookSystemPrompt(): string {
  return `You are "The Starter Elite Gladiator Council" — composed of three advanced personas:

1. **Maximus** – Strategic systems thinker who creates hooks focused on outcomes, efficiency, and measurable results
2. **Spartacus** – Disruptive challenger who creates hooks with urgency, rebellion, and bold transformation  
3. **Leonidas** – Results-driven warrior who creates hooks emphasizing achievement, victory, and proven success

Your mission: Deliver 3 elite marketing hooks with enhanced analysis. Each hook should:
- Address the specific pain point with precision
- Present a compelling transformation or outcome
- Include psychological triggers and conversion elements
- Be under 30 words but highly specific to the audience
- Include A/B test variations for optimization

For each gladiator, provide:
- One primary hook
- Critique of approach and psychology used
- 3 specific conversion optimization tips
- One A/B test variation hook

Format your response as JSON with this structure:
{
  "hooks": [
    {
      "gladiator": "Maximus",
      "hook": "Hook text here",
      "critique": "Analysis of psychological approach",
      "conversionTips": ["Tip 1", "Tip 2", "Tip 3"],
      "variation": "A/B test version"
    }
  ],
  "councilConsensus": "Overall strategic recommendation",
  "abTestSuggestion": "Specific A/B testing strategy"
}

Each gladiator maintains distinct voice:
- Maximus: Systems, frameworks, proven methodologies
- Spartacus: Disruption, rebellion, breaking free from status quo
- Leonidas: Victory, achievement, battlefield-tested results`;
}

export async function generateStarterHooks(input: StarterHookInput): Promise<StarterHookResponse> {
  try {
    const prompt = `
Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Pain Point: ${input.painPoint}
Desired Outcome: ${input.desiredOutcome}
${input.tonePref ? `Tone Preference: ${input.tonePref}` : ''}

Generate three distinct marketing hooks with advanced analysis. Make them industry-specific, psychologically compelling, and include optimization recommendations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: getStarterHookSystemPrompt() },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 1500
    });

    const aiResponse = JSON.parse(response.choices[0].message.content || '{}');

    const hooks: StarterGladiatorHook[] = aiResponse.hooks || [
      {
        gladiator: 'Maximus',
        hook: "Build systems that generate results while you focus on growth.",
        critique: "Strategic approach focusing on automation and scalability.",
        conversionTips: ["Use specific numbers", "Emphasize time savings", "Include social proof"],
        variation: "The system that built my 6-figure business while I slept."
      },
      {
        gladiator: 'Spartacus',
        hook: "Stop wrestling with inefficiency. Dominate with automation.",
        critique: "Disruptive language targeting frustration with current methods.",
        conversionTips: ["Create urgency", "Use power words", "Challenge status quo"],
        variation: "Break free from the daily grind. Automate your way to freedom."
      },
      {
        gladiator: 'Leonidas',
        hook: "Victory belongs to those who act. Here's your battle plan.",
        critique: "Achievement-focused with clear call to action.",
        conversionTips: ["Use victory language", "Create clear next steps", "Emphasize winning"],
        variation: "Champions don't wait. They execute. Your winning strategy inside."
      }
    ];

    return {
      hooks,
      councilConsensus: aiResponse.councilConsensus || "The council recommends testing the strategic vs. disruptive approaches to determine which resonates best with your specific audience segment.",
      abTestSuggestion: aiResponse.abTestSuggestion || "Test Maximus (systematic) vs Spartacus (rebellious) hooks first, then introduce Leonidas (victory) as the control-beater. Run 70/30 splits for statistical significance.",
      upgradeTeaser: "🚀 Unlock PRO: 5+ gladiator agents, neuromarketing triggers, advanced psychology frameworks, and Battle Lab A/B testing with real conversion data.",
      hooksRemaining: 999 // Unlimited for Starter tier
    };

  } catch (error) {
    console.error('Starter hook generation error:', error);
    
    // Fallback response
    return {
      hooks: [
        {
          gladiator: 'Maximus',
          hook: "Build systems that generate results while you focus on scaling.",
          critique: "Strategic systems approach with clear efficiency focus.",
          conversionTips: ["Use specific metrics", "Emphasize automation benefits", "Include time savings"],
          variation: "The framework that built my 6-figure system in 90 days."
        },
        {
          gladiator: 'Spartacus',
          hook: "Stop chasing leads. Start attracting clients automatically.",
          critique: "Disruptive positioning against traditional methods.",
          conversionTips: ["Create urgency", "Challenge conventional wisdom", "Use transformation language"],
          variation: "Break the lead-chasing cycle. Automate client acquisition."
        },
        {
          gladiator: 'Leonidas',
          hook: "Victory demands action. Here's your proven battle plan.",
          critique: "Achievement-focused with military metaphors for strength.",
          conversionTips: ["Use victory terminology", "Create clear action steps", "Emphasize proven results"],
          variation: "Winners execute immediately. Your success blueprint awaits."
        }
      ],
      councilConsensus: "The council recommends testing systematic vs. disruptive messaging to identify your audience's primary motivation: efficiency or transformation.",
      abTestSuggestion: "Run 50/50 split between Maximus (systems) and Spartacus (disruption) hooks, measuring click-through and conversion rates over 7-day periods.",
      upgradeTeaser: "🚀 Unlock PRO: Advanced neuromarketing, 5+ elite agents, conversion psychology, and Battle Lab testing with real performance data.",
      hooksRemaining: 999
    };
  }
}