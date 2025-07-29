// Swipe Copy Bank for Vault tier - 20 prewritten examples categorized by use case

export interface SwipeCopyItem {
  id: string;
  category: "hooks" | "ctas" | "closers" | "objections" | "urgency";
  title: string;
  copy: string;
  useCase: string;
  industry?: string;
}

export const SWIPE_COPY_BANK: SwipeCopyItem[] = [
  // HOOKS
  {
    id: "hook-1",
    category: "hooks",
    title: "The Secret Method",
    copy: "The little-known method that [specific transformation] without [common struggle] (even if you've tried everything else)",
    useCase: "Opening hook for coaches with unique methodology",
    industry: "Business Coaching"
  },
  {
    id: "hook-2",
    category: "hooks",
    title: "Controversial Truth",
    copy: "Why [conventional wisdom] is keeping you stuck (and what to do instead)",
    useCase: "Pattern interrupt for saturated markets",
  },
  {
    id: "hook-3",
    category: "hooks",
    title: "Before/After Reveal",
    copy: "From [painful starting point] to [dream outcome] in [timeframe] - here's exactly how",
    useCase: "Success story positioning for transformation-based offers",
  },
  {
    id: "hook-4",
    category: "hooks",
    title: "Industry Insider",
    copy: "After [number] years in [industry], I discovered the one thing that separates [winners] from [strugglers]",
    useCase: "Authority positioning with credibility markers",
  },

  // CTAs
  {
    id: "cta-1",
    category: "ctas",
    title: "Time-Sensitive Action",
    copy: "Click below to secure your spot before [deadline] - only [number] spaces available",
    useCase: "Urgency-driven enrollment for limited programs",
  },
  {
    id: "cta-2",
    category: "ctas",
    title: "Risk-Free Trial",
    copy: "Start your [transformation] today with our 30-day guarantee - if you don't see results, get every penny back",
    useCase: "High-ticket offers with money-back guarantee",
  },
  {
    id: "cta-3",
    category: "ctas",
    title: "Next Step Clarity",
    copy: "Ready to [specific outcome]? Click here to book your [consultation type] call",
    useCase: "Service-based businesses with discovery calls",
  },
  {
    id: "cta-4",
    category: "ctas",
    title: "Free Value First",
    copy: "Download your free [lead magnet] and start [transformation] in the next 24 hours",
    useCase: "Lead generation for email list building",
  },

  // CLOSERS
  {
    id: "closer-1",
    category: "closers",
    title: "Cost of Inaction",
    copy: "Every day you wait is another day [negative consequence]. The question isn't whether you can afford this - it's whether you can afford not to act.",
    useCase: "High-stakes decision making for premium offers",
  },
  {
    id: "closer-2",
    category: "closers",
    title: "Future Self Vision",
    copy: "A year from now, you'll either be [dream outcome] or in the exact same place. Which version of yourself do you want to meet?",
    useCase: "Identity-based selling for transformation programs",
  },
  {
    id: "closer-3",
    category: "closers",
    title: "Social Proof Stack",
    copy: "[Number] clients have already used this exact system to [transformation]. They started exactly where you are now.",
    useCase: "Building confidence through peer success stories",
  },
  {
    id: "closer-4",
    category: "closers",
    title: "Scarcity Truth",
    copy: "I can only work with [number] new clients this [timeframe] to ensure results. If you're ready to [transformation], this is your moment.",
    useCase: "Authentic scarcity for high-touch services",
  },

  // OBJECTION HANDLERS
  {
    id: "objection-1",
    category: "objections",
    title: "Price Objection",
    copy: "I understand this feels like an investment. But what's the cost of staying where you are for another year? This pays for itself when you [specific result].",
    useCase: "Reframing price as investment with ROI logic",
  },
  {
    id: "objection-2",
    category: "objections",
    title: "Time Objection",
    copy: "You're busy because you're doing everything the hard way. This gives you back [time savings] every week by [specific benefit].",
    useCase: "Time scarcity concerns for efficiency solutions",
  },
  {
    id: "objection-3",
    category: "objections",
    title: "Skepticism Objection",
    copy: "I get it - you've been burned before. That's exactly why I include [guarantee/proof]. This isn't another [failed solution type].",
    useCase: "Trust building for previously disappointed prospects",
  },
  {
    id: "objection-4",
    category: "objections",
    title: "Timing Objection",
    copy: "There's never a 'perfect' time for [transformation]. But the best time was a year ago. The second best time is right now.",
    useCase: "Overcoming procrastination and perfect timing myth",
  },

  // URGENCY FRAMEWORKS
  {
    id: "urgency-1",
    category: "urgency",
    title: "Limited Cohort",
    copy: "This cohort fills up every time because results speak for themselves. Next opening isn't until [future date].",
    useCase: "Authentic urgency for group programs",
  },
  {
    id: "urgency-2",
    category: "urgency",
    title: "Market Window",
    copy: "This opportunity exists because of [market condition]. When that changes, this advantage disappears.",
    useCase: "Market-timing urgency for business opportunities",
  },
  {
    id: "urgency-3",
    category: "urgency",
    title: "Bonus Expiration",
    copy: "The [bonus name] worth $[value] expires [date]. After that, it's gone forever.",
    useCase: "Value stack urgency with deadline pressure",
  },
  {
    id: "urgency-4",
    category: "urgency",
    title: "Personal Commitment",
    copy: "I'm capping this at [number] clients to ensure everyone gets results. Once we hit that number, enrollment closes.",
    useCase: "Capacity-based urgency for high-touch services",
  }
];

export function getSwipeCopyByCategory(category: SwipeCopyItem["category"]): SwipeCopyItem[] {
  return SWIPE_COPY_BANK.filter(item => item.category === category);
}

export function getAllSwipeCopy(): SwipeCopyItem[] {
  return SWIPE_COPY_BANK;
}

export function searchSwipeCopy(query: string): SwipeCopyItem[] {
  const lowerQuery = query.toLowerCase();
  return SWIPE_COPY_BANK.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.copy.toLowerCase().includes(lowerQuery) ||
    item.useCase.toLowerCase().includes(lowerQuery) ||
    (item.industry && item.industry.toLowerCase().includes(lowerQuery))
  );
}