import type { Express } from "express";
import { storage } from "../storage";

export function registerStarterTierRoutes(app: Express) {
  // Get Starter tier templates
  app.get("/api/starter/templates", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = req.user;
    if (user.role !== "starter" && user.role !== "vault" && user.role !== "platinum") {
      return res.status(403).json({ error: "Starter tier or higher required" });
    }

    const starterTemplates = [
      {
        id: "starter-fitness-1",
        title: "30-Day Body Transform Hook",
        category: "fitness",
        hook: "The 1 weird mistake keeping you from your dream body (and how Sarah lost 23 lbs fixing it)",
        bodyCopy: "Sarah tried everything - keto, CrossFit, meal prep. Nothing worked until she discovered this overlooked factor. Now she's in the best shape of her life.",
        cta: "See Sarah's Method",
        metrics: { conversionRate: 12.4, ctrLift: 187, avgCpa: 23, roas: 4.2 },
        tier: "starter",
        psychological_trigger: "Pattern Interrupt + Social Proof",
        use_cases: ["Facebook Ads", "Landing Pages", "Email Subject Lines"]
      },
      {
        id: "starter-business-1", 
        title: "Coach Authority Builder",
        category: "business",
        hook: "How I went from unknown coach to 6-figure authority in 90 days (without paid ads)",
        bodyCopy: "Most coaches struggle for years to build credibility. Here's the exact system I used to become the go-to expert in my niche.",
        cta: "Get The Blueprint",
        metrics: { conversionRate: 9.8, ctrLift: 156, avgCpa: 31, roas: 3.8 },
        tier: "starter",
        psychological_trigger: "Urgency + Authority",
        use_cases: ["Lead Magnets", "Webinar Titles", "Course Marketing"]
      },
      {
        id: "starter-yoga-1",
        title: "Inner Peace Flow Offer",
        category: "yoga", 
        hook: "The 5-minute morning ritual that ended my anxiety (without meditation apps)",
        bodyCopy: "After 15 years of panic attacks, I discovered this simple practice. Now I wake up calm and centered every single day.",
        cta: "Try It Free",
        metrics: { conversionRate: 15.2, ctrLift: 203, avgCpa: 18, roas: 5.1 },
        tier: "starter",
        psychological_trigger: "Curiosity + Transformation",
        use_cases: ["Instagram Ads", "YouTube Titles", "Blog Headlines"]
      }
    ];

    res.json({ templates: starterTemplates });
  });

  // Track template usage for upgrade triggers
  app.post("/api/starter/track-usage", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { templateId, action } = req.body;
    const user = req.user;

    try {
      // Update user's template usage count
      const updatedUser = await storage.updateUserTemplateUsage(user.id, templateId, action);
      
      // Check for upgrade triggers
      const upgradeOpportunity = updatedUser.templatesUsed >= 3 || updatedUser.usageCount >= 3;
      
      res.json({ 
        success: true, 
        templatesUsed: updatedUser.templatesUsed,
        upgradeOpportunity 
      });
    } catch (error) {
      console.error("Error tracking template usage:", error);
      res.status(500).json({ error: "Failed to track usage" });
    }
  });

  // Generate template variation
  app.post("/api/starter/generate-variation", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { templateId, variationType } = req.body;
    const user = req.user;

    if (user.role !== "starter" && user.role !== "vault" && user.role !== "platinum") {
      return res.status(403).json({ error: "Starter tier or higher required" });
    }

    // Simulate AI generation with variations
    const variations = {
      hook: [
        "The surprising reason 90% of fitness goals fail (and the 10-minute fix that changes everything)",
        "Why your workout routine is sabotaging your results (the counterintuitive truth coaches won't tell you)",
        "The metabolism mistake that's keeping you stuck (and how to reverse it in 21 days)"
      ],
      bodyCopy: [
        "What if everything you've been told about getting in shape is backwards? Here's the science-backed approach that finally works.",
        "Most people are working harder, not smarter. This simple shift changes everything about how your body responds to exercise.",
        "The fitness industry has been lying to you. Here's what actually works when you stop following their broken advice."
      ],
      cta: [
        "Discover The Truth",
        "Start Your Transformation", 
        "Get The Real Solution",
        "Unlock Your Results"
      ]
    };

    const randomVariation = variations[variationType as keyof typeof variations]?.[
      Math.floor(Math.random() * variations[variationType as keyof typeof variations].length)
    ];

    res.json({ 
      success: true, 
      variation: randomVariation,
      originalTemplate: templateId 
    });
  });
}