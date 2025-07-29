// Support Ticket Service
// Handles support ticket submission, management, and notifications

import { db } from './db';
import { supportTickets, emailUnsubscribes } from '@shared/schema';
import { eq, desc, count } from 'drizzle-orm';
import type { InsertSupportTicket, SupportTicket } from '@shared/schema';

export interface SubmitTicketOptions {
  name: string;
  email: string;
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general';
  subject: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface TicketUpdateOptions {
  ticketId: number;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes?: string;
}

export class SupportService {
  // Generate unique ticket number
  static generateTicketNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ONX-${timestamp.slice(-6)}-${random}`;
  }

  // Check if user is unsubscribed
  static async checkUnsubscribeStatus(email: string): Promise<boolean> {
    try {
      const result = await db.select()
        .from(emailUnsubscribes)
        .where(eq(emailUnsubscribes.email, email))
        .limit(1);

      return result.length > 0;
    } catch (error: any) {
      console.error('[Support Service] Error checking unsubscribe status:', error);
      return false;
    }
  }

  // Submit new support ticket
  static async submitTicket(options: SubmitTicketOptions): Promise<{ success: boolean; ticketNumber?: string; message: string }> {
    try {
      const ticketNumber = this.generateTicketNumber();
      const isUnsubscribed = await this.checkUnsubscribeStatus(options.email);

      const ticketData: InsertSupportTicket = {
        ticketNumber,
        name: options.name,
        email: options.email,
        category: options.category,
        subject: options.subject,
        message: options.message,
        status: 'open',
        priority: 'medium',
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        isUnsubscribedUser: isUnsubscribed
      };

      const [ticket] = await db.insert(supportTickets).values(ticketData).returning();

      console.log(`[Support Service] New ticket submitted: ${ticketNumber} from ${options.email}`);

      // Send confirmation email
      await this.sendConfirmationEmail(options.email, ticketNumber, options.name);

      // Send admin notification
      await this.sendAdminNotification(ticket);

      return {
        success: true,
        ticketNumber,
        message: 'Your support ticket has been submitted successfully. You will receive a confirmation email shortly.'
      };

    } catch (error: any) {
      console.error('[Support Service] Failed to submit ticket:', error);
      return {
        success: false,
        message: 'There was an error submitting your support ticket. Please try again or contact us directly at support@onyxnpearls.com'
      };
    }
  }

  // Send confirmation email to user
  static async sendConfirmationEmail(email: string, ticketNumber: string, name: string): Promise<void> {
    try {
      const { EmailService } = await import('./email-service');
      
      const subject = `Support Ticket Confirmation - ${ticketNumber}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8b5cf6; margin: 0; font-size: 28px;">OnyxHooks & More™</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Since there's more to fishing than just hooks</p>
            </div>
            
            <h2 style="color: #059669; margin-bottom: 20px;">Support Ticket Confirmed</h2>
            
            <p style="color: #374151; line-height: 1.6;">Hi ${name},</p>
            
            <p style="color: #374151; line-height: 1.6;">
              We've received your support request and assigned it ticket number <strong>${ticketNumber}</strong>.
              Our team will review your inquiry and respond as soon as possible.
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #374151; font-weight: bold;">Ticket Number: ${ticketNumber}</p>
              <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Please reference this number in any follow-up communications.</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              <strong>What happens next?</strong><br>
              • Our support team will review your request<br>
              • You'll receive updates via email as we work on your case<br>
              • Most tickets are resolved within 24-48 hours
            </p>
            
            <p style="color: #374151; line-height: 1.6;">
              If you need urgent assistance, you can always contact us directly at 
              <a href="mailto:support@onyxnpearls.com" style="color: #8b5cf6;">support@onyxnpearls.com</a>
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">OnyxHooks & More™ by Onyx & Pearls Management, Inc.</p>
              <p style="margin: 5px 0 0 0;">This email was sent to ${email}</p>
            </div>
          </div>
        </div>
      `;
      
      const textContent = `
Support Ticket Confirmation - ${ticketNumber}

Hi ${name},

We've received your support request and assigned it ticket number ${ticketNumber}.
Our team will review your inquiry and respond as soon as possible.

Ticket Number: ${ticketNumber}
Please reference this number in any follow-up communications.

What happens next?
• Our support team will review your request
• You'll receive updates via email as we work on your case
• Most tickets are resolved within 24-48 hours

If you need urgent assistance, you can always contact us directly at support@onyxnpearls.com

OnyxHooks & More™ by Onyx & Pearls Management, Inc.
This email was sent to ${email}
      `;

      await EmailService.sendEmail({
        to: email,
        subject,
        html: htmlContent,
        text: textContent
      });

      console.log(`[Support Service] Confirmation email sent to ${email} for ticket ${ticketNumber}`);

    } catch (error: any) {
      console.error('[Support Service] Failed to send confirmation email:', error);
    }
  }

  // Send admin notification
  static async sendAdminNotification(ticket: SupportTicket): Promise<void> {
    try {
      const { EmailService } = await import('./email-service');
      
      const adminEmail = process.env.ALERT_EMAIL || 'support@onyxnpearls.com';
      const subject = `New Support Ticket: ${ticket.ticketNumber} - ${ticket.category.toUpperCase()}`;
      
      const priorityColor = ticket.priority === 'urgent' ? '#dc2626' : 
                           ticket.priority === 'high' ? '#ea580c' :
                           ticket.priority === 'medium' ? '#ca8a04' : '#059669';
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #8b5cf6; margin-bottom: 20px;">New Support Ticket</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #374151;">Ticket #:</td>
                  <td style="padding: 5px 0; color: #6b7280;">${ticket.ticketNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #374151;">From:</td>
                  <td style="padding: 5px 0; color: #6b7280;">${ticket.name} (${ticket.email})</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #374151;">Category:</td>
                  <td style="padding: 5px 0; color: #6b7280;">${ticket.category.replace('_', ' ').toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #374151;">Priority:</td>
                  <td style="padding: 5px 0; color: ${priorityColor}; font-weight: bold;">${ticket.priority.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #374151;">Status:</td>
                  <td style="padding: 5px 0; color: #6b7280;">${ticket.status.toUpperCase()}</td>
                </tr>
                ${ticket.isUnsubscribedUser ? `
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; color: #dc2626;">Unsubscribed:</td>
                  <td style="padding: 5px 0; color: #dc2626; font-weight: bold;">YES - Service request only</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 10px;">Subject:</h3>
              <p style="color: #6b7280; margin: 0; padding: 10px; background: #f9fafb; border-radius: 6px;">${ticket.subject}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
              <div style="color: #6b7280; padding: 15px; background: #f9fafb; border-radius: 6px; white-space: pre-wrap;">${ticket.message}</div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'localhost:5000'}/admin" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Admin Dashboard</a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">Submitted: ${new Date(ticket.submittedAt!).toLocaleString()}</p>
              ${ticket.ipAddress ? `<p style="margin: 5px 0 0 0;">IP: ${ticket.ipAddress}</p>` : ''}
            </div>
          </div>
        </div>
      `;

      await EmailService.sendEmail({
        to: adminEmail,
        subject,
        html: htmlContent,
        text: `New Support Ticket: ${ticket.ticketNumber}\n\nFrom: ${ticket.name} (${ticket.email})\nCategory: ${ticket.category}\nSubject: ${ticket.subject}\n\nMessage:\n${ticket.message}`
      });

      console.log(`[Support Service] Admin notification sent for ticket ${ticket.ticketNumber}`);

    } catch (error: any) {
      console.error('[Support Service] Failed to send admin notification:', error);
    }
  }

  // Get all tickets for admin dashboard
  static async getAllTickets(limit: number = 50, offset: number = 0): Promise<SupportTicket[]> {
    try {
      const tickets = await db.select()
        .from(supportTickets)
        .orderBy(desc(supportTickets.submittedAt))
        .limit(limit)
        .offset(offset);

      return tickets;
    } catch (error: any) {
      console.error('[Support Service] Failed to get tickets:', error);
      return [];
    }
  }

  // Update ticket status
  static async updateTicket(options: TicketUpdateOptions): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: Partial<SupportTicket> = {};
      
      if (options.status) updateData.status = options.status;
      if (options.priority) updateData.priority = options.priority;
      if (options.adminNotes) updateData.adminNotes = options.adminNotes;
      if (options.status === 'resolved' || options.status === 'closed') {
        updateData.resolvedAt = new Date();
      }

      const [updatedTicket] = await db.update(supportTickets)
        .set(updateData)
        .where(eq(supportTickets.id, options.ticketId))
        .returning();

      if (!updatedTicket) {
        return { success: false, message: 'Ticket not found' };
      }

      // Send status update email if resolved
      if (options.status === 'resolved') {
        await this.sendStatusUpdateEmail(updatedTicket);
      }

      console.log(`[Support Service] Ticket ${updatedTicket.ticketNumber} updated: ${options.status || 'notes added'}`);

      return { success: true, message: 'Ticket updated successfully' };

    } catch (error: any) {
      console.error('[Support Service] Failed to update ticket:', error);
      return { success: false, message: 'Failed to update ticket' };
    }
  }

  // Send status update email to user
  static async sendStatusUpdateEmail(ticket: SupportTicket): Promise<void> {
    try {
      const { EmailService } = await import('./email-service');
      
      const subject = `Support Ticket Resolved - ${ticket.ticketNumber}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8b5cf6; margin: 0; font-size: 28px;">OnyxHooks & More™</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Since there's more to fishing than just hooks</p>
            </div>
            
            <h2 style="color: #059669; margin-bottom: 20px;">Support Ticket Resolved</h2>
            
            <p style="color: #374151; line-height: 1.6;">Hi ${ticket.name},</p>
            
            <p style="color: #374151; line-height: 1.6;">
              Great news! Your support ticket <strong>${ticket.ticketNumber}</strong> has been resolved.
              Our team has addressed your inquiry and the issue should now be taken care of.
            </p>
            
            <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #374151; font-weight: bold;">Ticket: ${ticket.ticketNumber}</p>
              <p style="margin: 5px 0 0 0; color: #6b7280;">Subject: ${ticket.subject}</p>
              ${ticket.adminNotes ? `<p style="margin: 10px 0 0 0; color: #6b7280;"><strong>Resolution Notes:</strong> ${ticket.adminNotes}</p>` : ''}
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              If you're still experiencing issues or have additional questions, please don't hesitate to submit a new support ticket or contact us directly.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="mailto:support@onyxnpearls.com" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Contact Support</a>
            </div>
            
            <p style="color: #374151; line-height: 1.6; text-align: center;">
              Thank you for using OnyxHooks & More™!
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
              <p style="margin: 0;">OnyxHooks & More™ by Onyx & Pearls Management, Inc.</p>
              <p style="margin: 5px 0 0 0;">This email was sent to ${ticket.email}</p>
            </div>
          </div>
        </div>
      `;

      await EmailService.sendEmail({
        to: ticket.email,
        subject,
        html: htmlContent,
        text: `Support Ticket Resolved - ${ticket.ticketNumber}\n\nHi ${ticket.name},\n\nGreat news! Your support ticket ${ticket.ticketNumber} has been resolved.\n\nIf you have additional questions, please contact support@onyxnpearls.com\n\nThank you for using OnyxHooks & More™!`
      });

      console.log(`[Support Service] Resolution email sent to ${ticket.email} for ticket ${ticket.ticketNumber}`);

    } catch (error: any) {
      console.error('[Support Service] Failed to send resolution email:', error);
    }
  }

  // Get ticket statistics
  static async getTicketStats(): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    byCategory: Record<string, number>;
  }> {
    try {
      const [totalResult] = await db.select({ count: count() }).from(supportTickets);
      const [openResult] = await db.select({ count: count() }).from(supportTickets).where(eq(supportTickets.status, 'open'));
      const [inProgressResult] = await db.select({ count: count() }).from(supportTickets).where(eq(supportTickets.status, 'in_progress'));
      const [resolvedResult] = await db.select({ count: count() }).from(supportTickets).where(eq(supportTickets.status, 'resolved'));

      const allTickets = await db.select({ category: supportTickets.category }).from(supportTickets);
      const byCategory = allTickets.reduce((acc, ticket) => {
        acc[ticket.category] = (acc[ticket.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: totalResult.count,
        open: openResult.count,
        inProgress: inProgressResult.count,
        resolved: resolvedResult.count,
        byCategory
      };

    } catch (error: any) {
      console.error('[Support Service] Failed to get ticket stats:', error);
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        byCategory: {}
      };
    }
  }
}