// Monthly Swipe Copy Bank Scheduler - Automated Content Updates
// Runs at 2:00 AM ET on the last day of each month
// Generates fresh templates and notifies Vault customers

import cron from 'node-cron';
import { db } from './db';
import { swipeCopyItems } from '@shared/schema';
import { generateNewSwipeCopyContent } from './swipe-copy-generator';
import nodemailer from 'nodemailer';

interface UpdateResult {
  success: boolean;
  itemCount?: number;
  error?: string;
}

class SwipeCopyScheduler {
  private scheduledJob?: cron.ScheduledTask;

  constructor() {
    this.initializeScheduler();
  }

  private initializeScheduler() {
    // Schedule for 2:00 AM ET on the last day of each month
    // Cron format: 0 2 28-31 * * (minute hour day month dayOfWeek)
    // This will run on days 28-31, but we'll check if it's actually the last day
    this.scheduledJob = cron.schedule('0 2 28-31 * *', async () => {
      await this.executeMonthlyUpdate();
    }, {
      scheduled: true,
      timezone: "America/New_York" // ET timezone
    });

    console.log('[SwipeCopy Scheduler] Monthly update scheduler initialized - runs at 2:00 AM ET on last day of month');
  }

  private async executeMonthlyUpdate(): Promise<UpdateResult> {
    try {
      // Check if today is actually the last day of the month
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      if (tomorrow.getMonth() !== today.getMonth()) {
        // Today is the last day of the month
        console.log(`[SwipeCopy Scheduler] Executing monthly update for ${today.toLocaleString('default', { month: 'long', year: 'numeric' })}`);
        
        return await this.generateMonthlyContent();
      } else {
        // Not the last day, skip
        console.log('[SwipeCopy Scheduler] Not the last day of month, skipping update');
        return { success: true, itemCount: 0 };
      }
    } catch (error: any) {
      console.error('[SwipeCopy Scheduler] Monthly update failed:', error);
      return {
        success: false,
        error: error.message || 'Unknown error during monthly update'
      };
    }
  }

  private async generateMonthlyContent(): Promise<UpdateResult> {
    const monthName = new Date().toLocaleString('default', { month: 'long' });
    const industries = [
      'Business Coaching', 'Fitness', 'Real Estate', 'SaaS', 'E-commerce',
      'Digital Marketing', 'Health & Wellness', 'Finance', 'Education', 'Agency'
    ];
    
    const categories = [
      { name: 'hooks', count: 6 },
      { name: 'ctas', count: 3 },
      { name: 'closers', count: 3 },
      { name: 'objections', count: 2 },
      { name: 'urgency', count: 1 }
    ];

    let totalGenerated = 0;
    const errors: string[] = [];

    try {
      for (const category of categories) {
        for (let i = 0; i < category.count; i++) {
          try {
            // Rotate through industries
            const industry = industries[totalGenerated % industries.length];
            
            const content = await generateNewSwipeCopyContent({
              category: category.name as any,
              industry,
              month: monthName,
              isMonthlyUpdate: true
            });

            // Save to database
            await db.insert(swipeCopyItems).values({
              title: content.title,
              content: content.copy, // content.copy maps to the 'content' column
              category: category.name,
              industry: content.industry,
              useCase: content.useCase,
              psychologyTriggers: content.psychologyTriggers,
              performanceData: content.performanceData, // Already JSON object
              isMonthlyUpdate: true,
              monthAdded: monthName
            });

            totalGenerated++;
            console.log(`[SwipeCopy Scheduler] Generated ${category.name} template: ${content.title}`);

          } catch (error: any) {
            console.error(`[SwipeCopy Scheduler] Failed to generate ${category.name} template:`, error);
            errors.push(`${category.name}: ${error.message}`);
          }
        }
      }

      // Send notification emails to Vault customers
      try {
        await this.notifyVaultCustomers(totalGenerated, monthName);
      } catch (error: any) {
        console.error('[SwipeCopy Scheduler] Failed to notify customers:', error);
        errors.push(`Email notifications: ${error.message}`);
      }

      console.log(`[SwipeCopy Scheduler] Monthly update complete. Generated ${totalGenerated} templates for ${monthName}`);

      return {
        success: true,
        itemCount: totalGenerated,
        error: errors.length > 0 ? `Partial success. Errors: ${errors.join(', ')}` : undefined
      };

    } catch (error: any) {
      console.error('[SwipeCopy Scheduler] Critical error during content generation:', error);
      return {
        success: false,
        error: error.message || 'Critical error during content generation'
      };
    }
  }

  private async notifyVaultCustomers(templateCount: number, monthName: string) {
    const subject = `🚀 ${monthName} Swipe Copy Bank Update - ${templateCount} New Templates Added`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1e293b; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #a855f7; margin: 0; font-size: 28px;">OnyxHooks & More™</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0;">Vault Elite Monthly Update</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
          <h2 style="margin: 0 0 10px 0; font-size: 24px;">Fresh Templates Just Dropped!</h2>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">${templateCount} battle-tested templates added to your Vault</p>
        </div>
        
        <div style="background-color: #334155; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #a855f7; margin: 0 0 15px 0;">What's New in ${monthName}:</h3>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>6 High-Converting Hooks (latest psychology triggers)</li>
            <li>3 Conversion-Optimized CTAs</li>
            <li>3 Deal-Closing Closers</li>
            <li>2 Objection-Crushing Responses</li>
            <li>1 Urgency Framework (limited-time psychology)</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="https://onyxnpearls.com/vault" style="display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Access Your New Templates
          </a>
        </div>
        
        <div style="border-top: 1px solid #475569; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 14px;">
          <p>You're receiving this because you're a Vault Elite member ($5,000/year).<br>
          These templates are worth $50,000+ in proven copy assets.</p>
        </div>
        
        <div style="border-top: 1px solid #475569; padding-top: 20px; margin-top: 20px; text-align: center; color: #64748b; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 10px 0;">You received this email because you're a Vault Elite member.</p>
          <p style="margin: 0;"><a href="${process.env.REPLIT_DEV_DOMAIN || 'localhost:5000'}/unsubscribe?email=${encodeURIComponent(testEmail)}&type=vault_notifications" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> | <a href="mailto:info@onyxnpearls.com" style="color: #64748b; text-decoration: underline;">Contact Support</a></p>
          <p style="margin: 10px 0 0 0; font-size: 11px;">OnyxHooks & More™ by Onyx & Pearls Management, Inc. | This email was sent to ${testEmail}</p>
        </div>
      </div>
    `;

    const textContent = `
OnyxHooks & More™ - ${monthName} Vault Update

Fresh Templates Just Dropped!
${templateCount} battle-tested templates added to your Vault.

What's New in ${monthName}:
• 6 High-Converting Hooks (latest psychology triggers)
• 3 Conversion-Optimized CTAs  
• 3 Deal-Closing Closers
• 2 Objection-Crushing Responses
• 1 Urgency Framework (limited-time psychology)

Access your new templates: https://onyxnpearls.com/vault

You're receiving this because you're a Vault Elite member ($5,000/year).
These templates are worth $50,000+ in proven copy assets.

---
You received this email because you're a Vault Elite member.
Unsubscribe: ${process.env.REPLIT_DEV_DOMAIN || 'localhost:5000'}/unsubscribe?email=${encodeURIComponent(testEmail)}&type=vault_notifications
Contact Support: info@onyxnpearls.com
OnyxHooks & More™ by Onyx & Pearls Management, Inc. | This email was sent to ${testEmail}
    `;

    // In production, this would query the database for Vault customers
    // For now, we'll send to the admin email as a test
    const testEmail = process.env.ALERT_EMAIL || 'jarviscamp@bellsouth.net';
    
    // Send email using SendGrid
    const transporter = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    const mailOptions = {
      from: '"OnyxHooks & More™ Team" <info@onyxnpearls.com>',
      to: testEmail,
      subject,
      text: textContent,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`[SwipeCopy Scheduler] Notification email sent to ${testEmail}:`, result.messageId);
    return result;
  }

  // Manual trigger for testing/admin use
  async triggerManualUpdate(): Promise<UpdateResult> {
    console.log('[SwipeCopy Scheduler] Manual update triggered by admin');
    return await this.generateMonthlyContent();
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.scheduledJob?.running || false,
      nextRun: this.scheduledJob?.nextDates(1)?.[0]?.toISOString(),
      timezone: 'America/New_York'
    };
  }

  // Stop the scheduler
  stop() {
    if (this.scheduledJob) {
      this.scheduledJob.stop();
      console.log('[SwipeCopy Scheduler] Monthly scheduler stopped');
    }
  }

  // Start the scheduler
  start() {
    if (this.scheduledJob) {
      this.scheduledJob.start();
      console.log('[SwipeCopy Scheduler] Monthly scheduler started');
    }
  }
}

// Export singleton instance
export const swipeCopyScheduler = new SwipeCopyScheduler();