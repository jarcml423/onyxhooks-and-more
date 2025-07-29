import type { Express } from "express";

export function registerTemplateRoutes(app: Express): void {
  // Track template usage for upgrade triggers
  app.post("/api/starter/track-usage", async (req, res) => {
    try {
      const { templateId, action } = req.body;
      
      // Track usage data for analytics and upgrade triggers
      const usageData = {
        templateId,
        action, // 'use', 'copy', 'generate_variation', 'export'
        timestamp: new Date(),
        userTier: 'starter' // Would get from auth in real app
      };
      
      console.log('Template usage tracked:', usageData);
      
      // Simulate upgrade trigger logic
      if (action === 'generate_variation') {
        // After 5 variations, suggest Pro upgrade
        const variationCount = Math.floor(Math.random() * 10);
        if (variationCount >= 5) {
          return res.json({
            success: true,
            upgradePrompt: {
              message: "You've used your starter variation limit. Upgrade to Pro for unlimited variations and custom backgrounds.",
              ctaText: "Upgrade to Pro",
              urgency: "high"
            }
          });
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Template tracking error:', error);
      res.status(500).json({ error: 'Failed to track usage' });
    }
  });

  // Generate new template variations
  app.post("/api/templates/generate-variation", async (req, res) => {
    try {
      const { templateId, industry, tone } = req.body;
      
      // Simulate AI-powered variation generation
      const variations = {
        'fitness-transformation': [
          {
            hook: "Lose 20 Pounds in 60 Days — No Counting Calories",
            body: "Jennifer dropped 3 dress sizes with this breakthrough method. 15 minutes daily, results guaranteed.",
            cta: "Start Today"
          },
          {
            hook: "The 90-Day Body Transformation That Shocked Everyone",
            body: "Mike's transformation photo went viral. Here's the simple system he used to build muscle and burn fat.",
            cta: "Get The System"
          }
        ],
        'business-coaching': [
          {
            hook: "$5K to $50K in 6 Months — The Complete Roadmap",
            body: "Emma scaled her coaching business without burnout. This system automates client acquisition.",
            cta: "Download Roadmap"
          },
          {
            hook: "How I Built a 6-Figure Coaching Business in 18 Months",
            body: "From struggling freelancer to multiple 6-figures. The exact strategy that changed everything.",
            cta: "Learn My Method"
          }
        ]
      };
      
      const templateVariations = variations[templateId] || variations['fitness-transformation'];
      const randomVariation = templateVariations[Math.floor(Math.random() * templateVariations.length)];
      
      res.json({
        success: true,
        variation: randomVariation
      });
    } catch (error) {
      console.error('Variation generation error:', error);
      res.status(500).json({ error: 'Failed to generate variation' });
    }
  });
}