import { db } from "./db";
import { users, usageLogs, type User, type InsertUsageLog } from "@shared/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

// Plan limits configuration
export const PLAN_LIMITS = {
  free: {
    hookGenerations: 2,
    offerGenerations: 2,
    dailyTokens: 2000,
    softCapWarning: 0.8,
    hasWatermark: true,
    canEdit: false,
    canExport: false
  },
  starter: {
    hookGenerations: 25, // Generous but limited 
    offerGenerations: 25, // Generous but limited
    dailyTokens: 10000,
    softCapWarning: 0.8,
    hasWatermark: false,
    canEdit: true,
    canExport: true
  },
  pro: {
    hookGenerations: -1, // Unlimited (key upgrade incentive)
    offerGenerations: -1, // Unlimited (key upgrade incentive)
    dailyTokens: 25000,
    softCapWarning: 0.8,
    hasWatermark: false,
    canEdit: true,
    canExport: true,
    hasProTools: true
  },
  vault: {
    hookGenerations: -1, // Unlimited
    offerGenerations: -1, // Unlimited
    dailyTokens: 50000,
    softCapWarning: 0.8,
    hasWatermark: false,
    canEdit: true,
    canExport: true,
    hasProTools: true,
    hasVaultTools: true,
    hasSwipeCopyBank: true,
    hasWhiteLabel: true,
    hasCRMExport: true
  }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;
export type ActionType = "hook_generation" | "offer_generation" | "funnel_review" | "vault_access" | "quiz_attempt";

export interface UsageStatus {
  canProceed: boolean;
  remainingOffers: number;
  remainingTokens: number;
  warningMessage?: string;
  upgradeRequired?: boolean;
  planLimits: typeof PLAN_LIMITS[PlanType];
}

export interface ThrottleResult {
  allowed: boolean;
  status: UsageStatus;
  message?: string;
}

export class ThrottlingService {
  
  /**
   * Check if user needs daily usage reset
   */
  private async resetDailyUsageIfNeeded(user: User): Promise<User> {
    const now = new Date();
    const lastReset = new Date(user.lastUsageReset);
    
    // Check if it's a new day (after midnight)
    if (now.getDate() !== lastReset.getDate() || 
        now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
      
      const [updatedUser] = await db
        .update(users)
        .set({
          dailyOfferCount: 0,
          dailyTokenCount: 0,
          lastUsageReset: now,
          updatedAt: now
        })
        .where(eq(users.id, user.id))
        .returning();
      
      return updatedUser;
    }
    
    return user;
  }

  /**
   * Get current usage status for user
   */
  async getUserUsageStatus(userId: number): Promise<UsageStatus> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    if (!user) {
      throw new Error("User not found");
    }

    // Reset daily usage if needed
    const currentUser = await this.resetDailyUsageIfNeeded(user);
    const planLimits = PLAN_LIMITS[currentUser.role as PlanType];
    
    const remainingOffers = Math.max(0, planLimits.dailyOffers - currentUser.dailyOfferCount);
    const remainingTokens = Math.max(0, planLimits.dailyTokens - currentUser.dailyTokenCount);
    
    const offerUsagePercent = currentUser.dailyOfferCount / planLimits.dailyOffers;
    const tokenUsagePercent = currentUser.dailyTokenCount / planLimits.dailyTokens;
    
    let warningMessage: string | undefined;
    let upgradeRequired = false;

    // Check for soft cap warnings
    if (offerUsagePercent >= planLimits.softCapWarning && remainingOffers > 0) {
      warningMessage = `You're nearing your daily limit (${currentUser.dailyOfferCount}/${planLimits.dailyOffers} offers used).`;
    }

    // Check for hard limits
    if (remainingOffers <= 0) {
      upgradeRequired = true;
      warningMessage = `You've reached your daily limit for ${currentUser.role} plan. Upgrade to unlock more offers.`;
    }

    return {
      canProceed: remainingOffers > 0,
      remainingOffers,
      remainingTokens,
      warningMessage,
      upgradeRequired,
      planLimits
    };
  }

  /**
   * Check if action is allowed and return throttle result
   */
  async checkThrottle(userId: number, action: ActionType, estimatedTokens: number = 500): Promise<ThrottleResult> {
    const status = await this.getUserUsageStatus(userId);
    
    // For non-offer actions, only check if user exists and is active
    if (action !== "offer_generation") {
      return {
        allowed: true,
        status
      };
    }

    // For offer generation, check limits
    if (!status.canProceed) {
      return {
        allowed: false,
        status,
        message: status.warningMessage || "Daily limit reached"
      };
    }

    // Check token limits
    if (status.remainingTokens < estimatedTokens) {
      return {
        allowed: false,
        status,
        message: `Insufficient token allowance. Need ${estimatedTokens} tokens, have ${status.remainingTokens} remaining.`
      };
    }

    return {
      allowed: true,
      status
    };
  }

  /**
   * Record usage after successful action
   */
  async recordUsage(
    userId: number, 
    action: ActionType, 
    tokensUsed: number, 
    success: boolean = true,
    metadata?: any
  ): Promise<void> {
    // Log usage
    await db.insert(usageLogs).values({
      userId,
      action,
      tokensUsed,
      success,
      metadata
    });

    // Update user counters only for successful offer generations
    if (action === "offer_generation" && success) {
      const [currentUser] = await db.select().from(users).where(eq(users.id, userId));
      if (currentUser) {
        await db
          .update(users)
          .set({
            dailyOfferCount: currentUser.dailyOfferCount + 1,
            dailyTokenCount: currentUser.dailyTokenCount + tokensUsed,
            usageCount: currentUser.usageCount + 1,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
      }
    }

    // Record vault access timestamp
    if (action === "vault_access" && success) {
      await db
        .update(users)
        .set({
          vaultAccessedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    }
  }

  /**
   * Check if user has accessed vault (for refund protection)
   */
  async hasAccessedVault(userId: number): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user?.vaultAccessedAt !== null;
  }

  /**
   * Get usage statistics for admin dashboard
   */
  async getUsageStats(startDate?: Date, endDate?: Date) {
    const whereClause = startDate && endDate 
      ? and(
          gte(usageLogs.createdAt, startDate.toISOString()),
          lte(usageLogs.createdAt, endDate.toISOString())
        )
      : undefined;

    const logs = await db.select().from(usageLogs).where(whereClause);
    
    const stats = {
      totalActions: logs.length,
      successfulActions: logs.filter(log => log.success).length,
      totalTokensUsed: logs.reduce((sum, log) => sum + log.tokensUsed, 0),
      actionBreakdown: {} as Record<ActionType, number>,
      dailyBreakdown: {} as Record<string, number>
    };

    // Calculate action breakdown
    logs.forEach(log => {
      stats.actionBreakdown[log.action] = (stats.actionBreakdown[log.action] || 0) + 1;
      
      const day = log.createdAt.toISOString().split('T')[0];
      stats.dailyBreakdown[day] = (stats.dailyBreakdown[day] || 0) + 1;
    });

    return stats;
  }

  /**
   * Handle subscription status changes from Stripe
   */
  async updateSubscriptionStatus(
    userId: number, 
    status: string, 
    planType: PlanType,
    subscriptionEndDate?: Date
  ): Promise<void> {
    await db
      .update(users)
      .set({
        subscriptionStatus: status,
        role: planType,
        subscriptionEndsAt: subscriptionEndDate,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  /**
   * Check for expired subscriptions and downgrade users
   */
  async processExpiredSubscriptions(): Promise<void> {
    const now = new Date();
    const expiredUsers = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.subscriptionStatus, "active"),
          lte(users.subscriptionEndsAt, now.toISOString())
        )
      );

    for (const user of expiredUsers) {
      await db
        .update(users)
        .set({
          role: "free",
          subscriptionStatus: "expired",
          updatedAt: now
        })
        .where(eq(users.id, user.id));
    }
  }
}

export const throttlingService = new ThrottlingService();