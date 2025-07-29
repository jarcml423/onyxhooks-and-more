import sgMail from '@sendgrid/mail';

interface EmailCampaignData {
  email: string;
  firstName: string;
  lastName: string;
  tier: string;
  score: number;
  quizId: number;
  industry?: string;
}

interface CampaignEmail {
  day: number;
  subject: string;
  contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => { html: string; text: string };
}

// Tier-Based Email Journey Campaigns Based on Quiz Score
const TIER_CAMPAIGNS = {
  free: { // Score 0-29, anchored by Alex & Sabri voices
    duration: "3 weeks",
    emails: [
      {
        day: 0,
        subject: "You've Got the Spark – Let's Shape It Together",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Welcome to OnyxHooks & More™! You scored a <strong>${score}</strong> — and that means you're sitting on real potential.</p>
              <p>Let's lay the groundwork for a powerful, scalable offer.</p>
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0369a1; margin-top: 0;">✅ Your Free Journey Includes:</h3>
                <ul style="color: #0c4a6e;">
                  <li>2 Free Offer Generations</li>
                  <li>Weekly Expert Tips</li>
                  <li>Vault Preview & Journey Tracking</li>
                </ul>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Your First Offer →</a>
              <p style="margin-top: 30px;">To your breakthrough,<br>— Alex & The OnyxHooks Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nWelcome to OnyxHooks & More™! You scored a ${score} — and that means you're sitting on real potential.\n\nLet's lay the groundwork for a powerful, scalable offer.\n\n✅ Your Free Journey Includes:\n- 2 Free Offer Generations\n- Weekly Expert Tips\n- Vault Preview & Journey Tracking\n\nStart Your First Offer: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/dashboard\n\nTo your breakthrough,\n— Alex & The OnyxHooks Team`
        })
      },
      {
        day: 2,
        subject: "What Makes an Offer Great?",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => {
          const industryText = industry ? `${industry} coaches` : 'coaches';
          return {
            html: `
              <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                <h2 style="color: #2563eb;">Hi ${firstName},</h2>
                <p>Most ${industryText} think a great offer is just about pricing. They're missing the bigger picture.</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1e40af; margin-top: 0;">📚 Essential Reading for ${industry || 'Coaches'}</h3>
                  <p><strong>"The 3 Pillars of Irresistible Offers"</strong></p>
                  <p>Learn the framework that separates amateur offers from professional ones.</p>
                </div>
                <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/offer-generator" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Create Your First Offer Now</a>
                <p style="margin-top: 20px;">— Sabri & The OnyxHooks Team</p>
              </div>
            `,
            text: `Hi ${firstName},\n\nMost ${industryText} think a great offer is just about pricing. They're missing the bigger picture.\n\n📚 Essential Reading for ${industry || 'Coaches'}\n"The 3 Pillars of Irresistible Offers"\n\nLearn the framework that separates amateur offers from professional ones.\n\nCreate Your First Offer Now: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/offer-generator\n\n— Sabri & The OnyxHooks Team`
          };
        }
      },
      {
        day: 5,
        subject: "Your First Offer Unlocks a New Path",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Every expert was once a beginner. But the ones who succeeded? They took action.</p>
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0369a1; margin-top: 0;">🎯 Ready to see what's possible?</h3>
                <p>Get a glimpse of the advanced strategies waiting in the Vault.</p>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/vault" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Preview the Vault →</a>
              <p style="margin-top: 30px;">— Alex & The OfferForge Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nEvery expert was once a beginner. But the ones who succeeded? They took action.\n\n🎯 Ready to see what's possible?\nGet a glimpse of the advanced strategies waiting in the Vault.\n\nPreview the Vault: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/vault\n\n— Alex & The OfferForge Team`
        })
      },
      {
        day: 9,
        subject: "Others Started Where You Are...",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Susan scored a 28 on her first quiz. Today, she runs a 6-figure coaching business.</p>
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
                <blockquote style="margin: 0; font-style: italic; color: #0c4a6e;">
                  "I almost didn't start. My score was low, and I felt like maybe I wasn't ready. But OfferForge showed me that everyone starts somewhere. The key was taking that first step."
                </blockquote>
                <p style="text-align: right; margin-top: 15px; color: #0369a1;"><strong>— Susan M.</strong></p>
              </div>
              <p>Your journey is just beginning.</p>
              <p style="margin-top: 30px;">— The OfferForge Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nSusan scored a 28 on her first quiz. Today, she runs a 6-figure coaching business.\n\n"I almost didn't start. My score was low, and I felt like maybe I wasn't ready. But OfferForge showed me that everyone starts somewhere. The key was taking that first step."\n— Susan M.\n\nYour journey is just beginning.\n\n— The OfferForge Team`
        })
      },
      {
        day: 14,
        subject: "Your Final Free Offer – Use It Wisely",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>You've reached 1 of your 2 free offer generations. Make this one count.</p>
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">⚠️ Free Plan Reminder</h3>
                <p style="color: #92400e;">After your second offer, you'll need to upgrade to continue creating.</p>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/offer-generator" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Create Your Second Offer</a>
              <p style="margin-top: 30px;">— The OfferForge Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nYou've reached 1 of your 2 free offer generations. Make this one count.\n\n⚠️ Free Plan Reminder\nAfter your second offer, you'll need to upgrade to continue creating.\n\nCreate Your Second Offer: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/offer-generator\n\n— The OfferForge Team`
        })
      },
      {
        day: 17,
        subject: "Why Free Can Only Take You So Far",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Free tools are great for getting started. But to build something that lasts, you need more.</p>
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0369a1; margin-top: 0;">📖 Essential Reading</h3>
                <p><strong>"The Investment Mindset: Why Free Keeps You Stuck"</strong></p>
                <p>Discover why successful coaches invest in their growth.</p>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/before-after" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Read the Full Article</a>
              <p style="margin-top: 30px;">— The OfferForge Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nFree tools are great for getting started. But to build something that lasts, you need more.\n\n📖 Essential Reading\n"The Investment Mindset: Why Free Keeps You Stuck"\n\nDiscover why successful coaches invest in their growth.\n\nRead the Full Article: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/before-after\n\n— The OfferForge Team`
        })
      },
      {
        day: 21,
        subject: "Ready for Unlimited Creation? (15% Off Inside)",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>You've built your foundation. Now it's time to scale.</p>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #15803d; margin-top: 0;">🔥 Limited-Time: 15% Off Starter Tier</h3>
                <p style="color: #15803d;">72-hour special offer for foundation builders like you.</p>
                <ul style="color: #15803d;">
                  <li>Unlimited offer creation</li>
                  <li>Full editing capabilities</li>
                  <li>PDF/clipboard export</li>
                  <li>Remove watermarks</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=starter&discount=FOUNDATION15" style="background: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">Upgrade to Starter (15% Off) →</a>
                <p style="margin-top: 10px; color: #6b7280; font-size: 14px;">Just $47/month • Use code FOUNDATION15 • 72 hours only</p>
              </div>
              <p style="margin-top: 30px;">— The OfferForge Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nYou've built your foundation. Now it's time to scale.\n\n🔥 Limited-Time: 15% Off Starter Tier\n72-hour special offer for foundation builders like you.\n\n- Unlimited offer creation\n- Full editing capabilities\n- PDF/clipboard export\n- Remove watermarks\n\nUpgrade to Starter (15% Off): ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=starter&discount=FOUNDATION15\nJust $47/month • Use code FOUNDATION15 • 72 hours only\n\n— The OfferForge Team`
        })
      }
    ]
  },

  starter: { // Score 26-50, anchored by Mo & Gary voices
    duration: "5 days",
    emails: [
      {
        day: 0,
        subject: "Your Offer Shows Real Promise — Ready to Unlock Starter?",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Impressive! You scored a <strong>${score}</strong> — your offer shows solid fundamentals that deserve the right tools.</p>
              <p>Your score qualifies you for Starter tier, where you can truly optimize and scale.</p>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #15803d; margin-top: 0;">🚀 Unlock Starter Tier ($47/month):</h3>
                <ul style="color: #15803d;">
                  <li>Unlimited offer generation</li>
                  <li>Full editing capabilities</li>
                  <li>PDF/clipboard export</li>
                  <li>Remove watermarks</li>
                </ul>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=starter" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Upgrade to Starter →</a>
              <p style="margin-top: 30px;">— Mo & The OnyxHooks Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nImpressive! You scored a ${score} — your offer shows solid fundamentals that deserve the right tools.\n\nYour score qualifies you for Starter tier, where you can truly optimize and scale.\n\n🚀 Unlock Starter Tier ($47/month):\n- Unlimited offer generation\n- Full editing capabilities\n- PDF/clipboard export\n- Remove watermarks\n\nUpgrade to Starter: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=starter\n\n— Mo & The OnyxHooks Team`
        })
      },
      {
        day: 2,
        subject: "3 Quick Wins (While You're Thinking About Starter)",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>While you're considering Starter tier, here are three optimizations you can apply right now with your Free account.</p>
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">⚡ Quick Conversion Boosters:</h3>
                <ol style="color: #92400e;">
                  <li>Add specific outcome timelines</li>
                  <li>Include social proof elements</li>
                  <li>Create urgency with limited availability</li>
                </ol>
              </div>
              <p>Ready to implement unlimited variations?</p>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=starter" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Unlock Starter Tier →</a>
              <p style="margin-top: 30px;">— Gary & The OnyxHooks Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nWhile you're considering Starter tier, here are three optimizations you can apply right now with your Free account.\n\n⚡ Quick Conversion Boosters:\n1. Add specific outcome timelines\n2. Include social proof elements\n3. Create urgency with limited availability\n\nReady to implement unlimited variations?\n\nUnlock Starter Tier: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=starter\n\n— Gary & The OnyxHooks Team`
        })
      },
      {
        day: 4,
        subject: "Last Chance: Starter Tier (Then Pro Beckons)",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>You scored ${score} — that puts you in the top tier of quiz takers. Don't let that potential sit unused.</p>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #15803d; margin-top: 0;">🚀 Start with Starter ($47/month):</h3>
                <ul style="color: #15803d;">
                  <li>Unlimited offer creation</li>
                  <li>Full editing and export</li>
                  <li>Remove limitations</li>
                </ul>
              </div>
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0369a1; margin-top: 0;">🎯 Or Jump to Pro ($197/month):</h3>
                <ul style="color: #0c4a6e;">
                  <li>Everything in Starter, plus:</li>
                  <li>Advanced funnel analysis</li>
                  <li>ROI simulation tools</li>
                  <li>Priority support</li>
                </ul>
              </div>
              <div style="text-align: center;">
                <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=starter" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">Get Starter →</a>
                <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=pro" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Upgrade to Pro →</a>
              </div>
              <p style="margin-top: 30px;">— Mo & The OnyxHooks Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nYou scored ${score} — that puts you in the top tier of quiz takers. Don't let that potential sit unused.\n\n🚀 Start with Starter ($47/month):\n- Unlimited offer creation\n- Full editing and export\n- Remove limitations\n\n🎯 Or Jump to Pro ($197/month):\n- Everything in Starter, plus:\n- Advanced funnel analysis\n- ROI simulation tools\n- Priority support\n\nGet Starter: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=starter\nUpgrade to Pro: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=pro\n\n— Mo & The OnyxHooks Team`
        })
      }
    ]
  },

  pro: { // Score 51-75, anchored by Mo & Gary voices
    duration: "9 days",
    emails: [
      {
        day: 0,
        subject: "Your Offer Has Real Potential — Let's Scale It",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Welcome! You scored a <strong>${score}</strong> — that tells us your offer has real potential.</p>
              <p>Pro is your next logical step to accelerate traction.</p>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #15803d; margin-top: 0;">🚀 Pro Tier Includes:</h3>
                <ul style="color: #15803d;">
                  <li>Funnel Critique</li>
                  <li>ROI Simulator</li>
                  <li>Priority Support</li>
                  <li>Unlimited offer generation</li>
                </ul>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Upgrade to Pro →</a>
              <p style="margin-top: 30px;">— Mo & The OnyxHooks Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nWelcome! You scored a ${score} — that tells us your offer has real potential.\n\nPro is your next logical step to accelerate traction.\n\n🚀 Pro Tier Includes:\n- Funnel Critique\n- ROI Simulator\n- Priority Support\n- Unlimited offer generation\n\nUpgrade to Pro: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe\n\n— Mo & The OnyxHooks Team`
        })
      },
      {
        day: 2,
        subject: "The 3 Silent Offer Killers (And How to Beat Them)",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Even good offers can fail. Here's why — and how to fix it.</p>
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">⚠️ The 3 Silent Killers:</h3>
                <ol style="color: #92400e;">
                  <li>Unclear value proposition</li>
                  <li>Poor funnel flow</li>
                  <li>Missing urgency triggers</li>
                </ol>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/roi-simulator" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Run Your Funnel Critique</a>
              <p style="margin-top: 30px;">— Gary & The OnyxHooks Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nEven good offers can fail. Here's why — and how to fix it.\n\n⚠️ The 3 Silent Killers:\n1. Unclear value proposition\n2. Poor funnel flow\n3. Missing urgency triggers\n\nRun Your Funnel Critique: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/roi-simulator\n\n— Gary & The OnyxHooks Team`
        })
      },
      {
        day: 4,
        subject: "Your ROI Potential (Are You Missing Out?)",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Every day you delay optimization is money left on the table.</p>
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0369a1; margin-top: 0;">💰 What You Could Be Missing:</h3>
                <p style="color: #0c4a6e;">A 2% conversion improvement on a $2,000 offer with 100 leads = $4,000 extra per month.</p>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/roi-simulator" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Calculate Your ROI Potential</a>
              <p style="margin-top: 30px;">— Mo & The OfferForge Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nEvery day you delay optimization is money left on the table.\n\n💰 What You Could Be Missing:\nA 2% conversion improvement on a $2,000 offer with 100 leads = $4,000 extra per month.\n\nCalculate Your ROI Potential: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/roi-simulator\n\n— Mo & The OfferForge Team`
        })
      },
      {
        day: 7,
        subject: "What's Inside the Vault?",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>The Vault contains the frameworks that built 7-figure coaching businesses.</p>
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
                <blockquote style="margin: 0; font-style: italic; color: #0c4a6e;">
                  "The Vault gave me the exact prompts I needed to scale from $5K to $15K per month. It's like having the playbook of every successful coach."
                </blockquote>
                <p style="text-align: right; margin-top: 15px; color: #0369a1;"><strong>— Marcus R.</strong></p>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/vault" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Preview the Vault →</a>
              <p style="margin-top: 30px;">— Gary & The OfferForge Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nThe Vault contains the frameworks that built 7-figure coaching businesses.\n\n"The Vault gave me the exact prompts I needed to scale from $5K to $15K per month. It's like having the playbook of every successful coach."\n— Marcus R.\n\nPreview the Vault: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/vault\n\n— Gary & The OfferForge Team`
        })
      },
      {
        day: 9,
        subject: "Next-Level Offers Await",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>You've seen what Pro can do. Ready for the next level?</p>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #15803d; margin-top: 0;">🎯 Vault Tier Unlocks:</h3>
                <ul style="color: #15803d;">
                  <li>Elite-level prompts & frameworks</li>
                  <li>7-figure coaching blueprints</li>
                  <li>Monthly value delivery strategies</li>
                  <li>Direct access to success coaches</li>
                </ul>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=vault" style="background: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">Upgrade to Vault →</a>
              <p style="margin-top: 30px;">— Mo & The OfferForge Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nYou've seen what Pro can do. Ready for the next level?\n\n🎯 Vault Tier Unlocks:\n- Elite-level prompts & frameworks\n- 7-figure coaching blueprints\n- Monthly value delivery strategies\n- Direct access to success coaches\n\nUpgrade to Vault: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=vault\n\n— Mo & The OfferForge Team`
        })
      }
    ]
  },

  vault: { // Score 60-100, anchored by Demis, Runway, Michael voices
    duration: "7 days",
    emails: [
      {
        day: 0,
        subject: "You're One Prompt Away from a Market-Dominating Offer",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Welcome to the elite tier. You scored a <strong>${score}</strong> — you clearly understand what makes offers convert.</p>
              <p>The Vault gives you elite-level prompts and frameworks that outperform the competition.</p>
              <div style="background: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #7c3aed; margin-top: 0;">🏆 Vault Access Includes:</h3>
                <ul style="color: #7c3aed;">
                  <li>Market-dominating offer templates</li>
                  <li>7-figure scaling frameworks</li>
                  <li>Elite coaching strategies</li>
                  <li>Direct mentor access</li>
                </ul>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/vault" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Your Vault →</a>
              <p style="margin-top: 30px;">— Demis & The Elite Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nWelcome to the elite tier. You scored a ${score} — you clearly understand what makes offers convert.\n\nThe Vault gives you elite-level prompts and frameworks that outperform the competition.\n\n🏆 Vault Access Includes:\n- Market-dominating offer templates\n- 7-figure scaling frameworks\n- Elite coaching strategies\n- Direct mentor access\n\nAccess Your Vault: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/vault\n\n— Demis & The Elite Team`
        })
      },
      {
        day: 1,
        subject: "Vault Preview: Swipe the Blueprints of 7-Figure Coaches",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>Here's a glimpse of what's waiting inside your Vault...</p>
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #0369a1; margin-top: 0;">🎯 Blueprint Preview:</h3>
                <p style="color: #0c4a6e; font-style: italic;">[BLURRED PREVIEW] The "Authority Accelerator" framework that helped coaches like Sarah go from $3K to $25K months...</p>
              </div>
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=vault" style="background: #7c3aed; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">Unlock Full Access →</a>
              <p style="margin-top: 30px;">— Runway & The Elite Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nHere's a glimpse of what's waiting inside your Vault...\n\n🎯 Blueprint Preview:\n[BLURRED PREVIEW] The "Authority Accelerator" framework that helped coaches like Sarah go from $3K to $25K months...\n\nUnlock Full Access: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=vault\n\n— Runway & The Elite Team`
        })
      },
      {
        day: 3,
        subject: "Final Chance: Vault Bonus Ending Soon",
        contentGenerator: (tier: string, score: number, firstName: string, industry?: string) => ({
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2563eb;">Hi ${firstName},</h2>
              <p>This is your final notice — the Vault bonus package expires in 24 hours.</p>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #15803d; margin-top: 0;">🎁 Bonus Package Includes:</h3>
                <ul style="color: #15803d;">
                  <li>Live 1-on-1 strategy call with Michael</li>
                  <li>20% savings on annual Vault plan</li>
                  <li>Exclusive "Market Domination" playbook</li>
                  <li>Priority access to new frameworks</li>
                </ul>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=vault&bonus=true" style="background: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">Claim Your Vault Bonus →</a>
                <p style="margin-top: 10px; color: #6b7280; font-size: 14px;">24 hours remaining</p>
              </div>
              <p style="margin-top: 30px;">— Michael & The Elite Team</p>
            </div>
          `,
          text: `Hi ${firstName},\n\nThis is your final notice — the Vault bonus package expires in 24 hours.\n\n🎁 Bonus Package Includes:\n- Live 1-on-1 strategy call with Michael\n- 20% savings on annual Vault plan\n- Exclusive "Market Domination" playbook\n- Priority access to new frameworks\n\nClaim Your Vault Bonus: ${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/subscribe?plan=vault&bonus=true\n24 hours remaining\n\n— Michael & The Elite Team`
        })
      }
    ]
  }
};

// Determine tier based on quiz score ranges
function getTierFromScore(score: number): 'free' | 'starter' | 'pro' | 'vault' {
  // Cap score at 100 first
  const cappedScore = Math.min(Math.max(score, 0), 100);
  
  if (cappedScore >= 0 && cappedScore <= 25) return 'free';
  if (cappedScore >= 26 && cappedScore <= 50) return 'starter';
  if (cappedScore >= 51 && cappedScore <= 75) return 'pro';
  if (cappedScore >= 76 && cappedScore <= 100) return 'vault';
  return 'free'; // fallback
}

// Email sending logic with tier-based campaigns
export async function startEmailCampaign(data: EmailCampaignData): Promise<void> {
  try {
    // Determine correct tier based on score
    const tierKey = getTierFromScore(data.score);
    const campaign = TIER_CAMPAIGNS[tierKey];
    
    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured, email campaign simulation started');
      console.log(`Campaign started for: ${data.firstName} ${data.lastName} (${data.email})`);
      console.log(`Score: ${data.score}, Tier: ${tierKey}, Duration: ${campaign.duration}`);
      console.log(`Industry: ${data.industry || 'Not specified'}`);
      
      // Track campaign start for future implementation
      trackCampaignStart({...data, tier: tierKey});
      return;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Send immediate email (day 0)
    await sendScheduledEmail({...data, tier: tierKey}, 0);
    
    // Schedule remaining emails based on tier
    console.log(`${tierKey.toUpperCase()} campaign started for ${data.firstName} ${data.lastName}`);
    console.log(`Campaign duration: ${campaign.duration}`);
    console.log(`Scheduled emails: ${campaign.emails.map(e => `Day ${e.day}`).join(', ')}`);
    
    // Track campaign start
    trackCampaignStart({...data, tier: tierKey});
    
    // Schedule all emails in the tier campaign
    campaign.emails.forEach((email, index) => {
      if (email.day > 0) { // Skip day 0 since it's already sent
        setTimeout(() => 
          sendScheduledEmail({...data, tier: tierKey}, email.day), 
          email.day * 24 * 60 * 60 * 1000
        );
      }
    });

  } catch (error) {
    console.error('Failed to start email campaign:', error);
    // Don't throw - we don't want quiz submission to fail because of email issues
  }
}

export async function sendScheduledEmail(data: EmailCampaignData, dayNumber: number): Promise<void> {
  try {
    // Determine correct tier and get campaign
    const tierKey = getTierFromScore(data.score);
    const campaign = TIER_CAMPAIGNS[tierKey];
    
    const emailTemplate = campaign.emails.find(email => email.day === dayNumber);
    if (!emailTemplate) {
      console.error(`No email template found for day ${dayNumber} in ${tierKey} tier`);
      return;
    }

    // Check if user has already upgraded (stop campaign logic)
    const campaignStatus = getCampaignStatus(data.email);
    if (campaignStatus && campaignStatus.emailsSent.includes(dayNumber)) {
      console.log(`Email day ${dayNumber} already sent to ${data.email}`);
      return;
    }

    const content = emailTemplate.contentGenerator(data.tier, data.score, data.firstName, data.industry);
    
    // Generate dynamic subject for industry-specific emails
    let subject = emailTemplate.subject;
    if (subject.includes('{industry}') && data.industry) {
      subject = subject.replace('{industry}', data.industry);
    }

    if (process.env.SENDGRID_API_KEY) {
      const msg = {
        to: data.email,
        from: 'team@offerforge.ai', // Replace with your verified sender
        subject: subject,
        text: content.text,
        html: content.html,
      };

      await sgMail.send(msg);
      console.log(`Day ${dayNumber} email sent successfully to ${data.firstName} (${tierKey} tier)`);
    } else {
      console.log(`[SIMULATION] Day ${dayNumber} email would be sent to ${data.firstName} (${tierKey} tier)`);
      console.log(`Subject: ${subject}`);
      console.log(`Content preview: Hi ${data.firstName}...`);
    }

    // Update campaign tracking
    updateCampaignTracking(data.email, dayNumber);

  } catch (error) {
    console.error(`Failed to send day ${dayNumber} email:`, error);
  }
}

// Campaign tracking system
export interface EmailCampaignTracking {
  email: string;
  firstName: string;
  lastName: string;
  tier: string;
  score: number;
  industry?: string;
  quizId: number;
  campaignStarted: Date;
  emailsSent: number[];
  lastEmailSent?: Date;
}

// In-memory tracking (in production, use database)
const campaignTracking = new Map<string, EmailCampaignTracking>();

export function trackCampaignStart(data: EmailCampaignData): void {
  campaignTracking.set(data.email, {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    tier: data.tier,
    score: data.score,
    industry: data.industry,
    quizId: data.quizId,
    campaignStarted: new Date(),
    emailsSent: [],
  });
}

export function updateCampaignTracking(email: string, dayNumber: number): void {
  const tracking = campaignTracking.get(email);
  if (tracking) {
    tracking.emailsSent.push(dayNumber);
    tracking.lastEmailSent = new Date();
    campaignTracking.set(email, tracking);
  }
}

export function getCampaignStatus(email: string): EmailCampaignTracking | undefined {
  return campaignTracking.get(email);
}

// Fallback logic for re-engagement (if user doesn't open 2+ emails)
export function checkReEngagement(email: string): boolean {
  const tracking = campaignTracking.get(email);
  if (!tracking) return false;
  
  // Simple logic: if campaign started more than 10 days ago and only 1 or 0 emails sent
  const daysSinceStart = (Date.now() - tracking.campaignStarted.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceStart > 10 && tracking.emailsSent.length <= 1;
}

// Stop campaign if user upgrades
export function stopCampaignForUpgrade(email: string): void {
  const tracking = campaignTracking.get(email);
  if (tracking) {
    tracking.emailsSent = [0, 2, 5, 8]; // Mark all as sent to stop further emails
    campaignTracking.set(email, tracking);
    console.log(`Campaign stopped for ${email} due to upgrade`);
  }
}