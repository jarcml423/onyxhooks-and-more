// Email Unsubscribe Service
// Handles email unsubscribe functionality and CAN-SPAM compliance

import crypto from 'crypto';
import { db } from './db';
import { emailUnsubscribes } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface UnsubscribeOptions {
  email: string;
  emailType?: 'all' | 'marketing' | 'updates' | 'vault_notifications';
  ipAddress?: string;
  userAgent?: string;
}

export class UnsubscribeService {
  // Generate a unique unsubscribe token
  static generateUnsubscribeToken(email: string): string {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256')
      .update(`${email}-${timestamp}-${randomBytes}`)
      .digest('hex');
    return hash.substring(0, 32); // 32 character token
  }

  // Create unsubscribe link
  static createUnsubscribeLink(email: string, emailType: string = 'all'): string {
    const token = this.generateUnsubscribeToken(email);
    const baseUrl = process.env.REPLIT_DEV_DOMAIN || 'localhost:5000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    return `${protocol}://${baseUrl}/unsubscribe?token=${token}&email=${encodeURIComponent(email)}&type=${emailType}`;
  }

  // Process unsubscribe request
  static async processUnsubscribe(options: UnsubscribeOptions): Promise<{ success: boolean; message: string }> {
    try {
      const token = this.generateUnsubscribeToken(options.email);
      
      // Check if already unsubscribed
      const existing = await db.select()
        .from(emailUnsubscribes)
        .where(eq(emailUnsubscribes.email, options.email))
        .limit(1);

      if (existing.length > 0) {
        return {
          success: true,
          message: 'You have already been unsubscribed from our emails.'
        };
      }

      // Add to unsubscribe list
      await db.insert(emailUnsubscribes).values({
        email: options.email,
        unsubscribeToken: token,
        emailType: options.emailType || 'all',
        ipAddress: options.ipAddress,
        userAgent: options.userAgent
      });

      console.log(`[Unsubscribe Service] ${options.email} unsubscribed from ${options.emailType || 'all'} emails`);

      return {
        success: true,
        message: 'You have been successfully unsubscribed from our emails.'
      };

    } catch (error: any) {
      console.error('[Unsubscribe Service] Failed to process unsubscribe:', error);
      return {
        success: false,
        message: 'There was an error processing your unsubscribe request. Please contact support.'
      };
    }
  }

  // Check if email is unsubscribed
  static async isUnsubscribed(email: string, emailType: string = 'all'): Promise<boolean> {
    try {
      const result = await db.select()
        .from(emailUnsubscribes)
        .where(eq(emailUnsubscribes.email, email))
        .limit(1);

      if (result.length === 0) return false;

      const unsubscribe = result[0];
      // If unsubscribed from 'all', block all email types
      // If unsubscribed from specific type, only block that type
      return unsubscribe.emailType === 'all' || unsubscribe.emailType === emailType;

    } catch (error: any) {
      console.error('[Unsubscribe Service] Error checking unsubscribe status:', error);
      return false; // Default to allowing emails if there's an error
    }
  }

  // Generate unsubscribe footer for emails
  static generateUnsubscribeFooter(email: string, emailType: string = 'marketing'): {
    html: string;
    text: string;
  } {
    const unsubscribeLink = this.createUnsubscribeLink(email, emailType);
    
    const html = `
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; line-height: 1.5;">
        <p style="margin: 0 0 10px 0;">
          You received this email because you're subscribed to OnyxHooks & More™ updates.
        </p>
        <p style="margin: 0;">
          <a href="${unsubscribeLink}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> | 
          <a href="mailto:info@onyxnpearls.com" style="color: #6b7280; text-decoration: underline;">Contact Support</a>
        </p>
        <p style="margin: 10px 0 0 0; font-size: 11px;">
          OnyxHooks & More™ by Onyx & Pearls Management, Inc.<br>
          This email was sent to ${email}
        </p>
      </div>
    `;

    const text = `
---
You received this email because you're subscribed to OnyxHooks & More™ updates.
Unsubscribe: ${unsubscribeLink}
Contact Support: info@onyxnpearls.com

OnyxHooks & More™ by Onyx & Pearls Management, Inc.
This email was sent to ${email}
    `;

    return { html, text };
  }
}