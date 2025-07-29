import Stripe from 'stripe';
import { db } from './db';
import { webhookEvents, subscriptionHistory, users } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import type { WebhookEvent, InsertWebhookEvent, InsertSubscriptionHistory } from '@shared/schema';
import { sendWebhookFailureEmail, sendWebhookRecoveryEmail, sendWelcomeEmail } from './email-service';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export interface WebhookProcessingResult {
  success: boolean;
  eventId: string;
  eventType: string;
  processed: boolean;
  error?: string;
  data?: any;
}

export class WebhookService {
  /**
   * Process a Stripe webhook event
   */
  static async processWebhookEvent(event: Stripe.Event): Promise<WebhookProcessingResult> {
    const eventRecord: InsertWebhookEvent = {
      stripeEventId: event.id,
      eventType: event.type,
      data: event.data,
      processed: false,
      processingAttempts: 0,
    };

    try {
      // Check if event already exists
      const existingEvent = await db
        .select()
        .from(webhookEvents)
        .where(eq(webhookEvents.stripeEventId, event.id))
        .limit(1);

      if (existingEvent.length > 0) {
        console.log(`Webhook event ${event.id} already processed`);
        return {
          success: true,
          eventId: event.id,
          eventType: event.type,
          processed: true,
          data: existingEvent[0]
        };
      }

      // Insert webhook event record
      const [savedEvent] = await db
        .insert(webhookEvents)
        .values(eventRecord)
        .returning();

      // Process based on event type
      let processingResult: any = null;
      
      switch (event.type) {
        case 'customer.created':
          processingResult = await this.handleCustomerCreated(event);
          break;
        
        case 'customer.updated':
          processingResult = await this.handleCustomerUpdated(event);
          break;
        
        case 'customer.subscription.created':
          processingResult = await this.handleSubscriptionCreated(event);
          break;
        
        case 'customer.subscription.updated':
          processingResult = await this.handleSubscriptionUpdated(event);
          break;
        
        case 'customer.subscription.deleted':
          processingResult = await this.handleSubscriptionDeleted(event);
          break;
        
        case 'invoice.paid':
          processingResult = await this.handleInvoicePaid(event);
          break;
        
        case 'invoice.payment_failed':
          processingResult = await this.handleInvoicePaymentFailed(event);
          break;
        
        case 'customer.subscription.trial_will_end':
          processingResult = await this.handleTrialWillEnd(event);
          break;
        
        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
          processingResult = { message: `Event type ${event.type} not handled` };
      }

      // Mark event as processed
      await db
        .update(webhookEvents)
        .set({
          processed: true,
          processedAt: new Date(),
          data: { ...event.data, processingResult }
        })
        .where(eq(webhookEvents.id, savedEvent.id));

      return {
        success: true,
        eventId: event.id,
        eventType: event.type,
        processed: true,
        data: processingResult
      };

    } catch (error) {
      console.error(`Error processing webhook ${event.id}:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const attemptCount = (eventRecord.processingAttempts || 0) + 1;
      
      // Update processing attempts and error
      await db
        .update(webhookEvents)
        .set({
          processingAttempts: attemptCount,
          lastProcessingError: errorMessage
        })
        .where(eq(webhookEvents.stripeEventId, event.id));

      // Send email alert for webhook failure
      try {
        const customerEmail = this.extractCustomerEmail(event);
        await sendWebhookFailureEmail({
          eventId: event.id,
          eventType: event.type,
          customerEmail,
          error: errorMessage,
          attemptCount
        });
      } catch (emailError) {
        console.error('Failed to send webhook failure email:', emailError);
      }

      return {
        success: false,
        eventId: event.id,
        eventType: event.type,
        processed: false,
        error: errorMessage
      };
    }
  }

  /**
   * Handle customer created event
   */
  private static async handleCustomerCreated(event: Stripe.Event): Promise<any> {
    const customer = event.data.object as Stripe.Customer;
    
    // Find user by email and update with Stripe customer ID
    if (customer.email) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, customer.email))
        .limit(1);
        
      if (user) {
        await db
          .update(users)
          .set({ stripeCustomerId: customer.id })
          .where(eq(users.id, user.id));
          
        console.log(`Updated user ${user.id} with Stripe customer ID: ${customer.id}`);
        return { userId: user.id, customerId: customer.id, action: 'customer_linked' };
      }
    }
    
    return { customerId: customer.id, action: 'customer_created', userLinked: false };
  }

  /**
   * Handle customer updated event
   */
  private static async handleCustomerUpdated(event: Stripe.Event): Promise<any> {
    const customer = event.data.object as Stripe.Customer;
    
    // Update user information if needed
    if (customer.email) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.stripeCustomerId, customer.id))
        .limit(1);
        
      if (user && user.email !== customer.email) {
        await db
          .update(users)
          .set({ email: customer.email })
          .where(eq(users.id, user.id));
          
        console.log(`Updated user ${user.id} email to: ${customer.email}`);
      }
    }
    
    return { customerId: customer.id, action: 'customer_updated' };
  }

  /**
   * Handle subscription created event
   */
  private static async handleSubscriptionCreated(event: Stripe.Event): Promise<any> {
    const subscription = event.data.object as Stripe.Subscription;
    
    // Find user by customer ID
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, subscription.customer as string))
      .limit(1);
      
    if (!user) {
      throw new Error(`User not found for customer ID: ${subscription.customer}`);
    }

    // Get plan details
    const planId = subscription.items.data[0]?.price?.id;
    const planName = this.getPlanNameFromPriceId(planId);
    const role = this.getRoleFromPlanName(planName);
    
    // Update user subscription info
    await db
      .update(users)
      .set({
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        role: role as any,
        subscriptionEndsAt: new Date(subscription.current_period_end * 1000)
      })
      .where(eq(users.id, user.id));

    // Create subscription history record
    const historyRecord: InsertSubscriptionHistory = {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status,
      planId,
      planName,
      amount: subscription.items.data[0]?.price?.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0,
      currency: subscription.items.data[0]?.price?.currency || 'usd',
      interval: subscription.items.data[0]?.price?.recurring?.interval,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      metadata: subscription.metadata
    };
    
    await db.insert(subscriptionHistory).values(historyRecord);

    // Send welcome email for new subscription
    try {
      const tierMap: Record<string, string> = {
        'starter': 'starter',
        'pro': 'pro', 
        'vault': 'vault'
      };
      
      const emailTier = tierMap[role.toLowerCase()] || 'starter';
      
      await sendWelcomeEmail({
        recipientEmail: user.email,
        customerName: user.username || user.email.split('@')[0],
        tier: emailTier
      });
      
      console.log(`Welcome email sent to ${user.email} for ${planName} subscription`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't throw - email failure shouldn't break webhook processing
    }

    console.log(`Created subscription for user ${user.id}: ${subscription.id}`);
    return { 
      userId: user.id, 
      subscriptionId: subscription.id, 
      planName, 
      role, 
      action: 'subscription_created' 
    };
  }

  /**
   * Handle subscription updated event
   */
  private static async handleSubscriptionUpdated(event: Stripe.Event): Promise<any> {
    const subscription = event.data.object as Stripe.Subscription;
    
    // Find user by subscription ID
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeSubscriptionId, subscription.id))
      .limit(1);
      
    if (!user) {
      console.log(`User not found for subscription ID: ${subscription.id}`);
      return { subscriptionId: subscription.id, action: 'subscription_updated', userNotFound: true };
    }

    const planId = subscription.items.data[0]?.price?.id;
    const planName = this.getPlanNameFromPriceId(planId);
    const role = this.getRoleFromPlanName(planName);
    
    // Update user subscription info
    await db
      .update(users)
      .set({
        subscriptionStatus: subscription.status,
        role: role as any,
        subscriptionEndsAt: subscription.status === 'canceled' 
          ? new Date(subscription.canceled_at! * 1000)
          : new Date(subscription.current_period_end * 1000)
      })
      .where(eq(users.id, user.id));

    // Create subscription history record
    const historyRecord: InsertSubscriptionHistory = {
      userId: user.id,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      status: subscription.status,
      planId,
      planName,
      amount: subscription.items.data[0]?.price?.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0,
      currency: subscription.items.data[0]?.price?.currency || 'usd',
      interval: subscription.items.data[0]?.price?.recurring?.interval,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
      endedAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
      metadata: subscription.metadata
    };
    
    await db.insert(subscriptionHistory).values(historyRecord);

    console.log(`Updated subscription for user ${user.id}: ${subscription.id} (${subscription.status})`);
    return { 
      userId: user.id, 
      subscriptionId: subscription.id, 
      status: subscription.status,
      planName, 
      role, 
      action: 'subscription_updated' 
    };
  }

  /**
   * Handle subscription deleted event
   */
  private static async handleSubscriptionDeleted(event: Stripe.Event): Promise<any> {
    const subscription = event.data.object as Stripe.Subscription;
    
    // Find user by subscription ID
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeSubscriptionId, subscription.id))
      .limit(1);
      
    if (!user) {
      console.log(`User not found for subscription ID: ${subscription.id}`);
      return { subscriptionId: subscription.id, action: 'subscription_deleted', userNotFound: true };
    }

    // Update user to free tier
    await db
      .update(users)
      .set({
        role: 'free',
        subscriptionStatus: 'canceled',
        subscriptionEndsAt: new Date()
      })
      .where(eq(users.id, user.id));

    console.log(`Downgraded user ${user.id} to free tier after subscription deletion`);
    return { 
      userId: user.id, 
      subscriptionId: subscription.id, 
      action: 'subscription_deleted_user_downgraded' 
    };
  }

  /**
   * Handle invoice paid event
   */
  private static async handleInvoicePaid(event: Stripe.Event): Promise<any> {
    const invoice = event.data.object as Stripe.Invoice;
    
    if (invoice.subscription) {
      // Find user by subscription ID
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.stripeSubscriptionId, invoice.subscription as string))
        .limit(1);
        
      if (user) {
        console.log(`Invoice paid for user ${user.id}: ${invoice.id}`);
        return { 
          userId: user.id, 
          invoiceId: invoice.id, 
          amount: invoice.amount_paid / 100,
          action: 'invoice_paid' 
        };
      }
    }
    
    return { invoiceId: invoice.id, action: 'invoice_paid', userNotFound: true };
  }

  /**
   * Handle invoice payment failed event
   */
  private static async handleInvoicePaymentFailed(event: Stripe.Event): Promise<any> {
    const invoice = event.data.object as Stripe.Invoice;
    
    if (invoice.subscription) {
      // Find user by subscription ID
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.stripeSubscriptionId, invoice.subscription as string))
        .limit(1);
        
      if (user) {
        console.log(`Invoice payment failed for user ${user.id}: ${invoice.id}`);
        // Could implement email notification here
        return { 
          userId: user.id, 
          invoiceId: invoice.id, 
          amount: invoice.amount_due / 100,
          action: 'invoice_payment_failed' 
        };
      }
    }
    
    return { invoiceId: invoice.id, action: 'invoice_payment_failed', userNotFound: true };
  }

  /**
   * Handle trial will end event
   */
  private static async handleTrialWillEnd(event: Stripe.Event): Promise<any> {
    const subscription = event.data.object as Stripe.Subscription;
    
    // Find user by subscription ID
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeSubscriptionId, subscription.id))
      .limit(1);
      
    if (user) {
      console.log(`Trial ending soon for user ${user.id}: ${subscription.id}`);
      // Could implement email notification here
      return { 
        userId: user.id, 
        subscriptionId: subscription.id, 
        trialEnd: new Date(subscription.trial_end! * 1000),
        action: 'trial_will_end' 
      };
    }
    
    return { subscriptionId: subscription.id, action: 'trial_will_end', userNotFound: true };
  }

  /**
   * Get plan name from Stripe price ID
   */
  private static getPlanNameFromPriceId(priceId?: string): string {
    if (!priceId) return 'unknown';
    
    if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter';
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro';
    if (priceId === process.env.STRIPE_VAULT_PRICE_ID) return 'vault';
    
    return 'unknown';
  }

  /**
   * Get user role from plan name
   */
  private static getRoleFromPlanName(planName: string): string {
    switch (planName) {
      case 'starter': return 'starter';
      case 'pro': return 'pro';
      case 'vault': return 'vault';
      default: return 'free';
    }
  }

  /**
   * Extract customer email from webhook event
   */
  private static extractCustomerEmail(event: any): string {
    // Try different paths where customer email might be found
    const emailPaths = [
      event?.data?.object?.customer_email,
      event?.data?.object?.email,
      event?.data?.object?.customer?.email,
      event?.data?.object?.billing_details?.email,
      'unknown'
    ];

    return emailPaths.find(email => email && typeof email === 'string') || 'unknown';
  }

  /**
   * Get webhook events for admin dashboard
   */
  static async getWebhookEvents(limit: number = 50): Promise<WebhookEvent[]> {
    return await db
      .select()
      .from(webhookEvents)
      .orderBy(webhookEvents.createdAt)
      .limit(limit);
  }

  /**
   * Get subscription history for a user
   */
  static async getUserSubscriptionHistory(userId: number): Promise<any[]> {
    return await db
      .select()
      .from(subscriptionHistory)
      .where(eq(subscriptionHistory.userId, userId))
      .orderBy(subscriptionHistory.createdAt);
  }

  /**
   * Retry failed webhook processing
   */
  static async retryFailedWebhook(eventId: string): Promise<WebhookProcessingResult> {
    const [event] = await db
      .select()
      .from(webhookEvents)
      .where(and(
        eq(webhookEvents.stripeEventId, eventId),
        eq(webhookEvents.processed, false)
      ))
      .limit(1);

    if (!event) {
      throw new Error(`Webhook event ${eventId} not found or already processed`);
    }

    const originalAttempts = event.processingAttempts || 0;

    // Retrieve event from Stripe
    const stripeEvent = await stripe.events.retrieve(eventId);
    const result = await this.processWebhookEvent(stripeEvent);

    // If retry was successful, send recovery notification
    if (result.success && originalAttempts > 0) {
      try {
        const customerEmail = this.extractCustomerEmail(stripeEvent);
        await sendWebhookRecoveryEmail({
          eventId: eventId,
          eventType: stripeEvent.type,
          customerEmail,
          originalAttempts
        });
      } catch (emailError) {
        console.error('Failed to send webhook recovery email:', emailError);
      }
    }

    return result;
  }
}