// Corrected Fitness Campaign Templates - Target: Women 40+
// Based on Council Review feedback addressing market misalignment

export const correctedFitnessTemplates = [
  {
    id: 'fitness-waist-transformation',
    title: '4-Inch Waist Transformation',
    hook: "What if losing 4 inches off your waist didn't require more workouts — just this one pattern shift?",
    body: "You've tried the workouts, the meal plans, the cardio. But that belly fat? Still there. Still stuck. What if the problem isn't your effort — it's your metabolism's operating system? Over 1,200 women over 40 — from busy moms to business owners — finally saw results they could feel and see. Jeans zipped up. Waistlines shrank. Confidence soared.",
    cta: "See My Waist Plan →",
    industry: 'women_fitness',
    tone: 'empowering',
    backgroundImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba3cd00?w=800&h=600&fit=crop',
    metrics: {
      conversionRate: '4.8%',
      ctrLift: '+127%',
      cpa: '$23',
      roas: '8.2x'
    },
    tier: 'vault' as const,
    psychologyTags: ['Mirror Moments', 'Real Results', 'Confidence Boost'],
    targetAudience: 'Women 40+',
    painPoints: ['Stubborn belly fat', 'Tired mornings', 'Hiding body'],
    emotionalTriggers: ['Hope', 'Trust', 'Transformation']
  },
  {
    id: 'metabolism-reset',
    title: 'Metabolism Reset for Women 40+',
    hook: "Most women over 40 are working harder than ever… yet their waistlines won't budge. This 1 shift resets the body's fat-burning mode.",
    body: "You wake up tired. You look in the mirror and that stubborn belly fat is still there — despite all your efforts. The truth? Your metabolism shifted after 40, but nobody told you how to shift with it. This isn't about more restriction or harder workouts. It's about working with your body's new reality.",
    cta: "Unlock My Reset →",
    industry: 'women_fitness',
    tone: 'understanding',
    backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    metrics: {
      conversionRate: '5.2%',
      ctrLift: '+143%',
      cpa: '$19',
      roas: '9.1x'
    },
    tier: 'vault' as const,
    psychologyTags: ['Metabolic Truth', 'Age-Specific', 'Body Wisdom'],
    targetAudience: 'Women 40+',
    painPoints: ['Slow metabolism', 'Age-related changes', 'Feeling stuck'],
    emotionalTriggers: ['Understanding', 'Relief', 'Empowerment']
  },
  {
    id: 'confidence-transformation',
    title: 'From Hiding to Confident',
    hook: "Stop hiding behind oversized sweaters. In 45 days, zip up those jeans with pride again.",
    body: "Remember when you felt confident in your own skin? When you didn't think twice about what to wear or how you looked? That woman is still there. She just needs the right approach — one that works with your lifestyle, your schedule, and your body after 40. No extreme diets. No 2-hour gym sessions. Just real results.",
    cta: "Get My Confidence Back →",
    industry: 'women_fitness',
    tone: 'inspiring',
    backgroundImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba3cd00?w=800&h=600&fit=crop',
    metrics: {
      conversionRate: '4.6%',
      ctrLift: '+118%',
      cpa: '$26',
      roas: '7.8x'
    },
    tier: 'vault' as const,
    psychologyTags: ['Identity Shift', 'Self-Worth', 'Authentic Self'],
    targetAudience: 'Women 40+',
    painPoints: ['Low confidence', 'Hiding body', 'Lost identity'],
    emotionalTriggers: ['Nostalgia', 'Hope', 'Self-love']
  }
];

export const getFitnessTemplatesByTier = (tier: 'starter' | 'pro' | 'vault') => {
  switch (tier) {
    case 'starter':
      return correctedFitnessTemplates.slice(0, 1); // Basic template
    case 'pro':
      return correctedFitnessTemplates.slice(0, 2); // Two templates
    case 'vault':
      return correctedFitnessTemplates; // All templates
    default:
      return [];
  }
};