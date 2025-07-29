// AI-Powered Swipe Copy Generator for Monthly Updates
// Uses OpenAI GPT-4o to generate fresh, high-converting templates

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GenerateContentParams {
  category: 'hooks' | 'ctas' | 'closers' | 'objections' | 'urgency';
  industry: string;
  month: string;
  isMonthlyUpdate: boolean;
}

interface GeneratedContent {
  title: string;
  copy: string;
  useCase: string;
  industry: string;
  performanceData: {
    estimatedCTR: string;
    conversionLift: string;
    psychologyTrigger: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  psychologyTriggers: string[];
}

export async function generateNewSwipeCopyContent(params: GenerateContentParams): Promise<GeneratedContent> {
  const { category, industry, month, isMonthlyUpdate } = params;

  const systemPrompt = `You are an elite copywriting specialist tasked with creating high-converting ${category} for the OnyxHooks & More™ Swipe Copy Bank monthly update.

CONTEXT:
- This is a ${month} monthly update for Vault tier members ($5,000/year)
- Industry focus: ${industry}
- Category: ${category}
- These templates will join a collection worth $50,000+ in proven copy

REQUIREMENTS:
1. Create battle-tested, proven templates based on real 7-figure campaigns
2. Include specific psychology triggers and conversion principles
3. Make it immediately actionable with clear use case scenarios
4. Ensure it feels fresh and current for ${month}
5. Target conversion rates should be realistic but impressive

STYLE GUIDELINES:
- Professional but compelling
- Backed by psychology and proven frameworks
- Industry-specific where relevant
- Immediately usable across multiple channels
- Should feel premium and exclusive

Respond with JSON only in this exact format:
{
  "title": "Descriptive name for this template",
  "copy": "The actual copy template with [variables] where needed",
  "useCase": "Specific scenario when to use this (2-3 sentences)",
  "industry": "${industry}",
  "performanceData": {
    "estimatedCTR": "X.X%",
    "conversionLift": "+XX%",
    "psychologyTrigger": "Primary psychology principle used",
    "difficulty": "beginner|intermediate|advanced"
  },
  "psychologyTriggers": ["trigger1", "trigger2", "trigger3"]
}`;

  const userPrompt = getCategorySpecificPrompt(category, industry, month);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI");
    }

    const parsedContent = JSON.parse(content);
    
    // Validate the response structure
    if (!parsedContent.title || !parsedContent.copy || !parsedContent.useCase) {
      throw new Error("Invalid response structure from OpenAI");
    }

    return parsedContent as GeneratedContent;

  } catch (error: any) {
    console.error("Failed to generate swipe copy content:", error);
    
    // Fallback to a basic template if AI fails
    return generateFallbackContent(params);
  }
}

function getCategorySpecificPrompt(category: string, industry: string, month: string): string {
  const prompts = {
    hooks: `Generate a high-converting HOOK for ${industry} that:
    - Captures attention in the first 3 seconds
    - Creates pattern interrupts for saturated markets
    - Uses curiosity gaps and emotional triggers
    - Works across paid ads, email subject lines, and social media
    - Reflects current ${month} trends and pain points
    
    Examples of great hooks:
    - "The 37-second trick that [specific outcome]..."
    - "Why [common belief] is actually keeping you [stuck/poor/frustrated]..."
    - "The [industry] secret that [authority figure] doesn't want you to know..."`,

    ctas: `Generate a high-converting CALL-TO-ACTION for ${industry} that:
    - Creates urgency without being pushy
    - Removes friction from the decision-making process
    - Uses action-oriented language with clear value proposition
    - Works for landing pages, emails, and sales pages
    - Incorporates ${month} seasonality or current events
    
    Examples of great CTAs:
    - "Get Your [Specific Outcome] Blueprint (Before [Deadline])"
    - "Claim Your [Industry] Advantage - Only [X] Spots Left"
    - "Start Your [Transformation] Today - Risk-Free for 30 Days"`,

    closers: `Generate a high-converting CLOSER for ${industry} that:
    - Reinforces the main value proposition
    - Addresses final objections without being salesy
    - Creates FOMO (fear of missing out)
    - Works in long-form sales copy and video scripts
    - Feels authentic and builds trust for ${month}
    
    Examples of great closers:
    - "The choice is yours: [stay stuck] or [transformation]..."
    - "I can't make this decision for you, but I can promise..."
    - "This offer expires [timeframe], but your [outcome] can last forever..."`,

    objections: `Generate a high-converting OBJECTION HANDLER for ${industry} that:
    - Acknowledges the concern without dismissing it
    - Provides logical and emotional reassurance
    - Includes social proof or guarantees
    - Sounds conversational and understanding
    - Addresses ${month} specific concerns or market conditions
    
    Examples of great objection handlers:
    - "I understand the concern about [objection]. Here's what [social proof]..."
    - "You might be thinking '[objection]' and you're right to be cautious..."
    - "The biggest risk isn't [their fear], it's [staying stuck]..."`,

    urgency: `Generate a high-converting URGENCY element for ${industry} that:
    - Creates genuine scarcity without manipulation
    - Uses deadline-driven language that motivates action
    - Builds anticipation for immediate response
    - Works in multiple marketing contexts
    - Leverages ${month} timing and seasonal psychology
    
    Examples of great urgency:
    - "Only [X] copies available - once they're gone, they're gone"
    - "This [special rate/bonus] expires in [timeframe]"
    - "Join the [X] successful [industry] professionals who've already [outcome]"`
  };

  return prompts[category as keyof typeof prompts] || prompts.hooks;
}

function generateFallbackContent(params: GenerateContentParams): GeneratedContent {
  const { category, industry, month } = params;
  
  const fallbackTemplates = {
    hooks: {
      title: `${month} Pattern Interrupt Hook`,
      copy: `The surprising [industry-specific method] that [target audience] are using to [desired outcome] (without [common struggle])`,
      psychologyTriggers: ['curiosity', 'specificity', 'exclusivity']
    },
    ctas: {
      title: `${month} Action-Driven CTA`,
      copy: `Get Your [Specific Outcome] - Limited Time ${month} Access`,
      psychologyTriggers: ['urgency', 'specificity', 'scarcity']
    },
    closers: {
      title: `${month} Decision-Point Closer`,
      copy: `The question isn't whether this works (it does). The question is: are you ready to [transformation]?`,
      psychologyTriggers: ['social-proof', 'identity-shift', 'commitment']
    },
    objections: {
      title: `${month} Trust-Building Response`,
      copy: `I understand your hesitation about [objection]. Here's what [number]+ [industry] professionals discovered...`,
      psychologyTriggers: ['empathy', 'social-proof', 'authority']
    },
    urgency: {
      title: `${month} Scarcity Element`,
      copy: `${month} Special: Only [X] spots available for [offer]. Previous months sold out in [timeframe].`,
      psychologyTriggers: ['scarcity', 'social-proof', 'fomo']
    }
  };

  const template = fallbackTemplates[category];
  
  return {
    title: template.title,
    copy: template.copy,
    useCase: `Use this ${category} template when targeting ${industry} audiences who need ${category === 'hooks' ? 'attention-grabbing openers' : category === 'ctas' ? 'clear action steps' : category === 'closers' ? 'decision reinforcement' : category === 'objections' ? 'trust building' : 'immediate action motivation'}. Perfect for ${month} campaigns.`,
    industry,
    performanceData: {
      estimatedCTR: "3.2%",
      conversionLift: "+25%",
      psychologyTrigger: template.psychologyTriggers[0],
      difficulty: "intermediate" as const
    },
    psychologyTriggers: template.psychologyTriggers
  };
}