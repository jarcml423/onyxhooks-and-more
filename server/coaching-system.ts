import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

// Real-time coaching feedback for transformation fields
export interface TransformationScore {
  score: number;
  feedback: string;
  level: 'weak' | 'good' | 'strong';
  suggestions?: string[];
}

export interface OfferProfile {
  description: string;
  transformationDelivered: string;
  industry: string;
  coachType: string;
  painPoint: string;
  hook: string;
  userId: number;
}

// Advanced scoring logic for transformation quality
export function scoreTransformationField(transformation: string): TransformationScore {
  if (!transformation || transformation.trim().length < 10) {
    return {
      score: 25,
      feedback: "Too vague. Try being more specific about the exact result your client receives.",
      level: 'weak',
      suggestions: [
        "Include a measurable outcome (e.g., '$10K/month', '30 days', '50 leads')",
        "Specify the exact transformation (e.g., 'from overwhelmed to organized')",
        "Add emotional value (e.g., 'confidence', 'peace of mind', 'freedom')"
      ]
    };
  }

  const words = transformation.toLowerCase().split(/\s+/);
  const weakWords = ['help', 'assist', 'support', 'guide', 'coach'];
  const strongWords = ['achieve', 'generate', 'increase', 'build', 'create', 'scale', 'multiply'];
  const measurementWords = ['$', '%', 'days', 'weeks', 'months', 'x', 'times', 'double', 'triple'];
  
  let score = 40; // Base score
  let level: 'weak' | 'good' | 'strong' = 'weak';
  let feedback = '';
  const suggestions: string[] = [];

  // Check for weak language
  const hasWeakWords = weakWords.some(word => words.includes(word));
  const hasStrongWords = strongWords.some(word => words.includes(word));
  const hasMeasurements = measurementWords.some(word => transformation.toLowerCase().includes(word));
  
  if (hasWeakWords && !hasStrongWords) {
    score += 10;
    feedback = "Better. Replace vague words like 'help' with specific action words.";
    level = 'weak';
    suggestions.push("Use action words: 'generate', 'build', 'achieve', 'scale'");
  } else if (hasStrongWords && !hasMeasurements) {
    score += 30;
    feedback = "Good direction. Add specific measurements or timeframes.";
    level = 'good';
    suggestions.push("Add numbers: '$10K revenue', '30 days', '3x growth'");
  } else if (hasStrongWords && hasMeasurements) {
    score += 50;
    feedback = "Excellent! Clear transformation with measurable outcomes.";
    level = 'strong';
  } else if (words.length > 8 && words.length < 20) {
    score += 20;
    feedback = "Good length. Now make the outcome more specific and measurable.";
    level = 'good';
    suggestions.push("What exact result does your client get?");
  }

  // Bonus points for specificity
  if (transformation.includes('from') && transformation.includes('to')) {
    score += 15;
  }
  
  // Bonus for emotional language
  const emotionalWords = ['confident', 'freedom', 'peace', 'clarity', 'empowered', 'fulfilled'];
  if (emotionalWords.some(word => words.includes(word))) {
    score += 10;
  }

  return {
    score: Math.min(score, 100),
    feedback,
    level,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
}

// Score offer description quality
export function scoreOfferDescription(description: string): TransformationScore {
  if (!description || description.trim().length < 15) {
    return {
      score: 20,
      feedback: "Too brief. Describe what your offer actually delivers.",
      level: 'weak',
      suggestions: [
        "Explain the main components of your offer",
        "Include the format (coaching, course, done-for-you, etc.)",
        "Mention the duration or timeline"
      ]
    };
  }

  const words = description.toLowerCase().split(/\s+/);
  let score = 35;
  let level: 'weak' | 'good' | 'strong' = 'weak';
  let feedback = '';
  const suggestions: string[] = [];

  // Check for offer components
  const hasFormat = ['coaching', 'course', 'program', 'mastermind', 'done-for-you', 'service'].some(word => 
    words.includes(word) || words.includes(word.replace('-', ''))
  );
  
  const hasDuration = ['week', 'month', 'day', 'session', 'call'].some(word => 
    description.toLowerCase().includes(word)
  );
  
  const hasOutcome = ['result', 'outcome', 'transformation', 'achieve', 'get', 'receive'].some(word => 
    words.includes(word)
  );

  if (hasFormat) score += 20;
  if (hasDuration) score += 15;
  if (hasOutcome) score += 20;

  if (score < 50) {
    feedback = "Add more details about format, duration, and what clients receive.";
    level = 'weak';
    suggestions.push("What format is your offer? (coaching, course, etc.)");
    suggestions.push("How long does it take? (6 weeks, 90 days, etc.)");
  } else if (score < 75) {
    feedback = "Good foundation. Make the value proposition clearer.";
    level = 'good';
    suggestions.push("What specific outcome do clients achieve?");
  } else {
    feedback = "Strong offer description with clear format and outcomes.";
    level = 'strong';
  }

  return {
    score: Math.min(score, 100),
    feedback,
    level,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
}

// Store comprehensive offer profile for personalization
export async function submitOfferProfile(profile: OfferProfile): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(users)
      .set({
        industry: profile.industry,
        coachType: profile.coachType,
        painPoint: profile.painPoint,
        transformationDelivered: profile.transformationDelivered,
        currentOffer: profile.description,
        primaryHook: profile.hook,
        updatedAt: new Date()
      })
      .where(eq(users.id, profile.userId));

    return { success: true };
  } catch (error) {
    console.error('Error storing offer profile:', error);
    return { success: false, error: 'Failed to store profile' };
  }
}

// Get user profile for personalized coaching
export async function getUserProfile(userId: number): Promise<{
  industry?: string;
  coachType?: string;
  painPoint?: string;
  transformationDelivered?: string;
  currentOffer?: string;
  primaryHook?: string;
} | null> {
  try {
    const result = await db.select({
      industry: users.industry,
      coachType: users.coachType,
      painPoint: users.painPoint,
      transformationDelivered: users.transformationDelivered,
      currentOffer: users.currentOffer,
      primaryHook: users.primaryHook
    })
    .from(users)
    .where(eq(users.id, userId));

    const user = result[0];
    
    return user ? {
      industry: user.industry || undefined,
      coachType: user.coachType || undefined,
      painPoint: user.painPoint || undefined,
      transformationDelivered: user.transformationDelivered || undefined,
      currentOffer: user.currentOffer || undefined,
      primaryHook: user.primaryHook || undefined
    } : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Weekly summary generation logic
export interface WeeklySummary {
  coachName: string;
  hooksGenerated: number;
  offersGenerated: number;
  councilSessions: number;
  transformation: string;
  encouragement: string;
  nextSteps: string[];
}

export function generateWeeklySummary(userData: {
  name: string;
  usage: { hook: number; offer: number; council: number };
  transformationDelivered?: string;
  industry?: string;
  plan: string;
}): WeeklySummary {
  const { name, usage, transformationDelivered, industry, plan } = userData;
  
  // Mosaic-style encouraging summary
  let encouragement = `${name}, your progress shows real momentum this week.`;
  
  if (usage.hook > 2) {
    encouragement += ` Your ${usage.hook} hook iterations demonstrate commitment to finding the perfect message.`;
  }
  
  if (usage.offer > 1) {
    encouragement += ` Testing ${usage.offer} offer variations shows strategic thinking.`;
  }

  // Personalized next steps based on activity
  const nextSteps: string[] = [];
  
  if (usage.hook === 0) {
    nextSteps.push("Generate 3 hooks this week to test different angles");
  } else if (usage.hook < 3) {
    nextSteps.push("Test 2 more hook variations to find your best performer");
  }
  
  if (usage.offer === 0) {
    nextSteps.push("Create your first offer framework with clear transformation");
  } else if (usage.council === 0 && (plan === 'pro' || plan === 'vault')) {
    nextSteps.push("Get Council feedback on your strongest offer");
  }

  if (transformationDelivered && transformationDelivered.length < 20) {
    nextSteps.push("Refine your transformation statement with specific outcomes");
  }

  return {
    coachName: name,
    hooksGenerated: usage.hook,
    offersGenerated: usage.offer,
    councilSessions: usage.council,
    transformation: transformationDelivered || "Not specified yet",
    encouragement,
    nextSteps
  };
}

// Real-time field validation for frontend
export interface FieldValidation {
  field: string;
  score: number;
  feedback: string;
  level: 'weak' | 'good' | 'strong';
  suggestions?: string[];
}

export function validateOfferFields(fields: {
  transformation?: string;
  description?: string;
  hook?: string;
  industry?: string;
}): FieldValidation[] {
  const validations: FieldValidation[] = [];

  if (fields.transformation) {
    const transformationScore = scoreTransformationField(fields.transformation);
    validations.push({
      field: 'transformation',
      ...transformationScore
    });
  }

  if (fields.description) {
    const descriptionScore = scoreOfferDescription(fields.description);
    validations.push({
      field: 'description',
      ...descriptionScore
    });
  }

  if (fields.hook) {
    const hookScore = scoreHookQuality(fields.hook);
    validations.push({
      field: 'hook',
      ...hookScore
    });
  }

  return validations;
}

// Hook quality scoring
function scoreHookQuality(hook: string): TransformationScore {
  if (!hook || hook.trim().length < 5) {
    return {
      score: 15,
      feedback: "Too short. A good hook needs to grab attention immediately.",
      level: 'weak',
      suggestions: [
        "Start with a surprising fact or question",
        "Challenge a common belief",
        "Promise a specific outcome"
      ]
    };
  }

  let score = 30;
  let level: 'weak' | 'good' | 'strong' = 'weak';
  let feedback = '';
  const suggestions: string[] = [];

  const isQuestion = hook.trim().endsWith('?');
  const hasNumbers = /\d/.test(hook);
  const hasEmotionalWords = ['secret', 'mistake', 'truth', 'finally', 'never', 'always'].some(word => 
    hook.toLowerCase().includes(word)
  );

  if (isQuestion) score += 15;
  if (hasNumbers) score += 20;
  if (hasEmotionalWords) score += 15;

  if (hook.length > 80) {
    score -= 10;
    suggestions.push("Keep it under 80 characters for maximum impact");
  }

  if (score < 45) {
    feedback = "Needs more curiosity or emotional trigger.";
    level = 'weak';
    suggestions.push("Try starting with 'What if...' or 'The secret to...'");
  } else if (score < 70) {
    feedback = "Good structure. Add more specificity or intrigue.";
    level = 'good';
    suggestions.push("Include a specific number or timeframe");
  } else {
    feedback = "Strong hook with good curiosity and emotional appeal.";
    level = 'strong';
  }

  return {
    score: Math.min(score, 100),
    feedback,
    level,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
}