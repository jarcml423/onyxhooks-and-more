// Email templates for OnyxHooks & More™ campaign system

// Tier scoring ranges for personalization
const SCORE_TIERS = [
  { min: 0, max: 25, tier: 'free', label: 'Foundation Builder', link: '/quiz', image: '/images/foundation.jpg' },
  { min: 26, max: 50, tier: 'starter', label: 'Growth Starter', link: '/subscribe?plan=starter', image: '/images/builder.jpg' },
  { min: 51, max: 75, tier: 'pro', label: 'Pro Operator', link: '/subscribe?plan=pro', image: '/images/authority.jpg' },
  { min: 76, max: 100, tier: 'vault', label: 'Vault Elite', link: '/subscribe?plan=vault', image: '/images/vault.jpg' }
];

// HTML email templates for OnyxHooks & More™
export const HTML_TEMPLATES = {
  email1: `
    <html>
      <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
          <h1 style='color: white; margin: 0; font-size: 24px;'>Welcome to OnyxHooks & More™</h1>
        </div>
        <div style='padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);'>
          <p>Hi {{firstName}},</p>
          <p>You've just unlocked access to the same AI system elite creators use to multiply their conversions.</p>
          <p>Your score: <strong>{{score}}/100</strong> places you in the <strong>{{tier}}</strong> category.</p>
          <blockquote style='background: #f8f9fa; border-left: 4px solid #764ba2; padding: 15px; margin: 20px 0; font-style: italic;'>
            "{{quote}}"
          </blockquote>
          <div style='text-align: center; margin: 30px 0;'>
            <img src='{{image_url}}' alt='Your Journey' style='max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.2);'/>
          </div>
          <div style='text-align: center; margin: 30px 0;'>
            <a href='{{plan_link}}' style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);'>Start Your Journey →</a>
          </div>
        </div>
      </body>
    </html>
  `,
  
  email2: `
    <html>
      <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
          <h1 style='color: white; margin: 0; font-size: 24px;'>This coach had your score… then scaled 10x</h1>
        </div>
        <div style='padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);'>
          <p style='font-size: 18px; color: #11998e; font-weight: bold;'>Real Success Story:</p>
          <blockquote style='background: #f8f9fa; border-left: 4px solid #38ef7d; padding: 15px; margin: 20px 0; font-style: italic;'>
            "I was stuck at $3K/month for 18 months. After implementing the OnyxHooks framework, I hit $30K within 90 days." - Sarah M., Business Coach
          </blockquote>
          <p>Someone at your exact level restructured their offer using our framework and hit <strong style='color: #11998e;'>$10K/month</strong> within 90 days.</p>
          <div style='text-align: center; margin: 30px 0;'>
            <img src='{{image_url}}' alt='Success Story' style='max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.2);'/>
          </div>
          <div style='text-align: center; margin: 30px 0;'>
            <a href='{{plan_link}}' style='background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(17, 153, 142, 0.3);'>Run Your Simulation →</a>
          </div>
        </div>
      </body>
    </html>
  `,
  
  email3: `
    <html>
      <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
          <h1 style='color: white; margin: 0; font-size: 24px;'>Over 2,000 Coaches. $50M+ Revenue. Your Turn?</h1>
        </div>
        <div style='padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);'>
          <p style='font-size: 18px; color: #667eea; font-weight: bold; text-align: center;'>OnyxHooks & More™ Results That Speak For Themselves:</p>
          <div style='background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;'>
            <ul style='list-style: none; padding: 0; margin: 0;'>
              <li style='padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 16px;'>
                <strong style='color: #764ba2;'>$50M+</strong> total revenue generated
              </li>
              <li style='padding: 10px 0; border-bottom: 1px solid #e9ecef; font-size: 16px;'>
                <strong style='color: #764ba2;'>847%</strong> average price increase
              </li>
              <li style='padding: 10px 0; font-size: 16px;'>
                <strong style='color: #764ba2;'>3.2x</strong> average conversion lift
              </li>
            </ul>
          </div>
          <p style='text-align: center; font-weight: bold; color: #667eea; font-size: 18px;'>You're next in line for transformation.</p>
          <div style='text-align: center; margin: 30px 0;'>
            <img src='{{image_url}}' alt='Success Metrics' style='max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.2);'/>
          </div>
          <div style='text-align: center; margin: 30px 0;'>
            <a href='{{plan_link}}' style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);'>View Vault Prompts →</a>
          </div>
        </div>
      </body>
    </html>
  `,
  
  email4: `
    <html>
      <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
          <h1 style='color: white; margin: 0; font-size: 24px;'>You're Leaving This on the Table…</h1>
        </div>
        <div style='padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);'>
          <p style='font-size: 18px; color: #ee5a24; font-weight: bold;'>Financial Reality Check:</p>
          <p>Coaches in your tier typically gain <strong style='color: #ff6b6b; font-size: 20px;'>$1K–$5K/month</strong> after optimizing their offer structure with our framework.</p>
          <div style='background: #fff5f5; border: 2px solid #ff6b6b; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;'>
            <p style='margin: 0; font-size: 16px;'>We estimate you're missing up to:</p>
            <p style='margin: 10px 0 0 0; font-size: 24px; font-weight: bold; color: #ee5a24;'>{{delta}}/month</p>
          </div>
          <p>You scored <strong>{{score}}/100</strong> — you're just 3 strategic tweaks away from a breakthrough.</p>
          <div style='text-align: center; margin: 30px 0;'>
            <img src='{{image_url}}' alt='Revenue Potential' style='max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.2);'/>
          </div>
          <div style='text-align: center; margin: 30px 0;'>
            <a href='{{plan_link}}' style='background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);'>See What You Unlock →</a>
          </div>
        </div>
      </body>
    </html>
  `,
  
  email5: `
    <html>
      <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>
          <h1 style='color: #2d3436; margin: 0; font-size: 24px;'>🔥 Your Council-Powered Upgrade Expires in 48H</h1>
        </div>
        <div style='padding: 30px; background: white; border-radius: 0 0 10px 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);'>
          <p style='font-size: 18px; color: #e17055; font-weight: bold;'>This is your final personalized email.</p>
          <p>Your <strong>{{tier}}</strong> upgrade includes everything you need to transform your offers:</p>
          <div style='background: #fdcb6e; background: linear-gradient(135deg, #fdcb6e 0%, #e84393 100%); padding: 25px; border-radius: 8px; margin: 25px 0; color: white;'>
            <ul style='list-style: none; padding: 0; margin: 0;'>
              <li style='padding: 8px 0; font-size: 16px;'>✨ AI-powered offer simulations</li>
              <li style='padding: 8px 0; font-size: 16px;'>✨ Editable offer rewrites</li>
              <li style='padding: 8px 0; font-size: 16px;'>✨ Full Vault prompts unlocked</li>
              <li style='padding: 8px 0; font-size: 16px;'>✨ Agent Council review access</li>
            </ul>
          </div>
          <div style='background: #ff7675; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;'>
            <p style='margin: 0; font-size: 18px; font-weight: bold;'>⏰ Expires in 48 Hours</p>
          </div>
          <div style='text-align: center; margin: 30px 0;'>
            <img src='{{image_url}}' alt='Final Opportunity' style='max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.2);'/>
          </div>
          <div style='text-align: center; margin: 30px 0;'>
            <a href='{{plan_link}}' style='background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%); color: #2d3436; padding: 18px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 5px 15px rgba(254, 202, 87, 0.4); font-size: 18px;'>Upgrade Now →</a>
          </div>
          <p style='color: #636e72; font-size: 14px; text-align: center; font-style: italic;'>Recommended by: The OnyxHooks Council</p>
        </div>
      </body>
    </html>
  `
};

// Council-inspired motivational quotes
export const QUOTES = [
  "Your transformation is their destination – price accordingly.",
  "Every breakthrough starts with someone willing to invest in themselves.",
  "Elite creators know their worth and charge it confidently.",
  "The gap between where you are and where you want to be? That's your offer.",
  "Stop undervaluing the life-changing work you do."
];

// Function to get tier from score
export function getTierFromScore(score: number): { 
  tier: string, 
  label: string, 
  link: string, 
  image: string 
} {
  const tier = SCORE_TIERS.find(t => score >= t.min && score <= t.max);
  return tier || SCORE_TIERS[0];
}

// Helper function to check and update usage
export async function checkAndUpdateUsage(
  userId: string, 
  actionType: 'emailTemplates'
): Promise<{ success: boolean; limit?: number; reached?: boolean }> {
  try {
    // Demo mode - always allow
    return { success: true };
  } catch (error) {
    console.error(`Usage check error:`, error);
    return { success: false };
  }
}

// Generate complete email content
export async function generateEmailContent(templateId: string, userData: {
  score: number;
  firstName: string;
}): Promise<{ subject: string; htmlContent: string; textContent: string }> {
  const tierInfo = getTierFromScore(userData.score);
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  
  let template = HTML_TEMPLATES[templateId as keyof typeof HTML_TEMPLATES];
  
  if (!template) {
    template = HTML_TEMPLATES.email1;
  }
  
  // Replace variables in template
  const htmlContent = template
    .replace(/\{\{firstName\}\}/g, userData.firstName)
    .replace(/\{\{score\}\}/g, userData.score.toString())
    .replace(/\{\{tier\}\}/g, tierInfo.label)
    .replace(/\{\{plan_link\}\}/g, tierInfo.link)
    .replace(/\{\{image_url\}\}/g, tierInfo.image)
    .replace(/\{\{quote\}\}/g, randomQuote);

  // Extract text content (simplified)
  const textContent = `
OnyxHooks & More™ - Your Elite AI Toolkit

Hi ${userData.firstName},

You've just unlocked access to the same AI system elite creators use to multiply their conversions.

Your score: ${userData.score}/100 places you in the ${tierInfo.label} category.

"${randomQuote}"

Ready to access your tools? Visit: ${tierInfo.link}

Best regards,
The OnyxHooks Council
Onyx & Pearls Management, Inc.
  `.trim();

  const subjects = {
    email1: 'Welcome to OnyxHooks & More™ – Your Elite AI Toolkit',
    email2: 'Your Hook Just Dropped – Now Test It Like a Pro',
    email3: 'Unlock Unlimited Hooks with Pro Tier Access', 
    email4: 'Want 10X Performance? It\'s Inside the Vault.',
    email5: 'Still Thinking? Your Next Hook Is Waiting…'
  };

  return {
    subject: subjects[templateId as keyof typeof subjects] || subjects.email1,
    htmlContent,
    textContent
  };
}

// Generate email campaign with personalization
export async function generateEmailCampaign(request: {
  userId: string;
  name: string;
  email: string;
  score: number;
  templateIds: string[];
}): Promise<{ success: boolean; templates?: any[]; error?: string }> {
  try {
    const usageCheck = await checkAndUpdateUsage(request.userId, 'emailTemplates');
    
    if (!usageCheck.success && usageCheck.limit && usageCheck.reached) {
      return {
        success: false,
        error: `Monthly limit of ${usageCheck.limit} email templates reached. Upgrade your plan to continue.`
      };
    }

    const templates = [];
    for (const templateId of request.templateIds) {
      const template = await generateEmailContent(templateId, {
        score: request.score,
        firstName: request.name
      });
      templates.push({
        id: templateId,
        ...template
      });
    }

    return { success: true, templates };
  } catch (error) {
    console.error('Email campaign generation error:', error);
    return { 
      success: false, 
      error: 'Failed to generate email campaign. Please try again.' 
    };
  }
}

// Export PLAN_LIMITS for routes
export const PLAN_LIMITS = {
  free: { hook: 2, offer: 2, council: 1, emailTemplates: 3 },
  starter: { hook: 25, offer: 25, council: 2, emailTemplates: 10 },
  pro: { hook: 999, offer: 999, council: 3, emailTemplates: 50 },
  vault: { hook: 9999, offer: 9999, council: 9999, emailTemplates: 999 }
};