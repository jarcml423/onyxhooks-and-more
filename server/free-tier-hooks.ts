import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface FreeHookInput {
  industry: string;
  targetAudience: string;
  painPoint: string;
  desiredOutcome: string;
}

export interface GladiatorHook {
  gladiator: 'Maximus' | 'Spartacus';
  hook: string;
  critique: string;
}

export interface FreeHookResponse {
  hooks: GladiatorHook[];
  gladiatorClash: {
    maximusCritique: string;
    spartacusCritique: string;
  };
  upgradeTeaser: string;
  hooksRemaining: number;
  nextReset: string;
}

const MONTHLY_FREE_LIMIT = 2;

// Simple demo usage tracking
let demoHookUsage = 0;

export function incrementDemoUsage(): void {
  demoHookUsage++;
}

export function getDemoUsage(): number {
  return demoHookUsage;
}

export function resetDemoUsage(): void {
  demoHookUsage = 0;
}

function getFreeHookSystemPrompt(): string {
  return `You are "The Free Tier Gladiator Council" — composed of two stylized personas:

1. **Maximus** – Calm, analytical, outcome-focused strategist who creates hooks that focus on systems, efficiency, and measurable results
2. **Spartacus** – Direct, energetic, attention-grabbing disruptor who creates hooks with urgency, rebellion, and bold transformation

Your mission: Deliver 2 powerful marketing hooks. Each hook should:
- Address a clear pain or problem
- Present a bold transformation or outcome  
- Include urgency or differentiation
- Be less than 25 words
- Be industry-specific and audience-relevant

Format your response as JSON with this structure:
{
  "maximusHook": "Hook text here",
  "spartacusHook": "Hook text here", 
  "maximusCritique": "Single sentence critique of Spartacus's hook",
  "spartacusCritique": "Single sentence critique of Maximus's hook"
}

Each gladiator has a distinct voice:
- Maximus: Strategic, systems-focused, outcome-driven language
- Spartacus: Rebellious, urgent, disruptive language with energy`;
}

export async function generateFreeHooks(input: FreeHookInput): Promise<FreeHookResponse> {
  try {
    const prompt = `
Industry: ${input.industry}
Target Audience: ${input.targetAudience}
Pain Point: ${input.painPoint}
Desired Outcome: ${input.desiredOutcome}

Generate two distinct marketing hooks following the gladiator personas. Make them industry-specific and compelling.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: getFreeHookSystemPrompt() },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 500
    });

    const aiResponse = JSON.parse(response.choices[0].message.content || '{}');

    const hooks: GladiatorHook[] = [
      {
        gladiator: 'Maximus',
        hook: aiResponse.maximusHook || "Build systems that work while you sleep.",
        critique: aiResponse.spartacusCritique || "Maximus is strategic but could use more edge."
      },
      {
        gladiator: 'Spartacus', 
        hook: aiResponse.spartacusHook || "Stop chasing. Start dominating.",
        critique: aiResponse.maximusCritique || "Spartacus hits hard but risks sounding generic."
      }
    ];

    // Calculate remaining hooks after this generation
    const hooksAfterGeneration = Math.max(0, MONTHLY_FREE_LIMIT - (demoHookUsage + 1));

    return {
      hooks,
      gladiatorClash: {
        maximusCritique: aiResponse.maximusCritique || "Spartacus hits hard but needs more strategic focus.",
        spartacusCritique: aiResponse.spartacusCritique || "Maximus is sharp but could use more urgency."
      },
      upgradeTeaser: "🚀 Upgrade to STARTER for unlimited hooks, OfferForge Framework, and 3 gladiators! Just $47/month.",
      hooksRemaining: hooksAfterGeneration,
      nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()
    };

  } catch (error) {
    console.error('Free hook generation error:', error);
    
    // Calculate remaining hooks after this generation for fallback
    const hooksAfterGeneration = Math.max(0, MONTHLY_FREE_LIMIT - (demoHookUsage + 1));
    
    // Fallback response for demo/testing
    return {
      hooks: [
        {
          gladiator: 'Maximus',
          hook: "Build systems that generate results while you focus on growth.",
          critique: "Spartacus brings energy but could be more specific to the outcome."
        },
        {
          gladiator: 'Spartacus',
          hook: "Stop wrestling with inefficiency. Dominate with automation.",
          critique: "Maximus is strategic but needs more urgency to grab attention."
        }
      ],
      gladiatorClash: {
        maximusCritique: "Spartacus brings powerful energy but could benefit from more strategic positioning.",
        spartacusCritique: "Maximus delivers solid strategy but needs more edge to cut through the noise."
      },
      upgradeTeaser: "🚀 Upgrade to STARTER for unlimited hooks, OfferForge Framework, and 3 gladiators! Just $47/month.",
      hooksRemaining: hooksAfterGeneration,
      nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()
    };
  }
}

export async function checkFreeHookUsage(userId: number): Promise<{ canGenerate: boolean; hooksUsed: number; hooksRemaining: number }> {
  // For demo/testing mode without authentication
  if (!userId || userId === 0) {
    // Track usage in memory for demo - simulate 2 hook limit
    const canGenerate = demoHookUsage < MONTHLY_FREE_LIMIT;
    const hooksRemaining = Math.max(0, MONTHLY_FREE_LIMIT - demoHookUsage);
    
    return {
      canGenerate,
      hooksUsed: demoHookUsage,
      hooksRemaining
    };
  }

  try {
    const { storage } = await import("./storage");
    const user = await storage.getUser(userId);
    
    if (!user) {
      return {
        canGenerate: false,
        hooksUsed: 0,
        hooksRemaining: 0
      };
    }

    // Check if we're in a new month - reset usage if so
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
    const lastUsedMonth = user.lastUsed ? `${user.lastUsed.getFullYear()}-${user.lastUsed.getMonth()}` : null;
    
    let currentUsage = user.usageCount || 0;
    
    // Reset usage count if it's a new month
    if (lastUsedMonth !== currentMonth) {
      currentUsage = 0;
    }
    
    const canGenerate = currentUsage < MONTHLY_FREE_LIMIT;
    const hooksRemaining = Math.max(0, MONTHLY_FREE_LIMIT - currentUsage);
    
    return {
      canGenerate,
      hooksUsed: currentUsage,
      hooksRemaining
    };
  } catch (error) {
    console.error('Error checking free hook usage:', error);
    // Default to allowing generation if there's an error
    return {
      canGenerate: true,
      hooksUsed: 0,
      hooksRemaining: MONTHLY_FREE_LIMIT
    };
  }
}