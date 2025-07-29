export interface SwipeTemplate {
  id: string;
  category: 'hooks' | 'ctas' | 'closers' | 'objections' | 'urgency';
  title: string;
  copy: string;
  industry: string[];
  conversionStats: {
    ctr: number;
    roiLift: number;
    sourceCampaign: string;
  };
  copyInsight: {
    neuralTrigger: string;
    painPoint: string;
    explanation: string;
  };
  tags: string[];
  tier: 'pro' | 'vault';
}

export interface SwipeCopyResponse {
  templates: SwipeTemplate[];
  totalCount: number;
  categories: {
    hooks: number;
    ctas: number;
    closers: number;
    objections: number;
    urgency: number;
  };
}

// PRODUCTION SECURITY: All hardcoded swipe copy templates removed for production deployment
// Real templates will be generated via automated monthly AI system and stored in database

export const SWIPE_TEMPLATES: SwipeTemplate[] = [
  // No hardcoded templates - real swipe copy will be generated monthly by AI system and stored in database
];

export function getSwipeCopyTemplates(filters: {
  category?: string;
  industry?: string;
  search?: string;
}): SwipeCopyResponse {
  // Safety check for empty templates array
  if (!SWIPE_TEMPLATES || SWIPE_TEMPLATES.length === 0) {
    return {
      templates: [],
      totalCount: 0,
      categories: {
        hooks: 0,
        ctas: 0,
        closers: 0,
        objections: 0,
        urgency: 0,
      }
    };
  }

  let filtered = SWIPE_TEMPLATES;

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(template => template.category === filters.category);
  }

  // Apply industry filter
  if (filters.industry && filters.industry !== 'all') {
    filtered = filtered.filter(template => template.industry.includes(filters.industry!));
  }

  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(template => 
      template.title.toLowerCase().includes(searchTerm) ||
      template.copy.toLowerCase().includes(searchTerm) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      template.copyInsight.neuralTrigger.toLowerCase().includes(searchTerm)
    );
  }

  // Calculate category counts with safety checks
  const categories = {
    hooks: SWIPE_TEMPLATES.filter(t => t.category === 'hooks').length || 0,
    ctas: SWIPE_TEMPLATES.filter(t => t.category === 'ctas').length || 0,
    closers: SWIPE_TEMPLATES.filter(t => t.category === 'closers').length || 0,
    objections: SWIPE_TEMPLATES.filter(t => t.category === 'objections').length || 0,
    urgency: SWIPE_TEMPLATES.filter(t => t.category === 'urgency').length || 0,
  };

  return {
    templates: filtered || [],
    totalCount: SWIPE_TEMPLATES.length || 0,
    categories
  };
}