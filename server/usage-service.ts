import { db } from "./db";
import { users, type User } from "@shared/schema";
import { eq } from "drizzle-orm";

// Plan limits configuration
export const PLAN_LIMITS = {
  free: { dailyOffers: 2, dailyTokens: 2000 },
  pro: { dailyOffers: 10, dailyTokens: 10000 },
  vault: { dailyOffers: 25, dailyTokens: 25000 },
  agency: { dailyOffers: 100, dailyTokens: 50000 }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export interface UsageStatus {
  canProceed: boolean;
  remainingOffers: number;
  dailyOfferCount: number;
  planLimits: typeof PLAN_LIMITS[PlanType];
  warningMessage?: string;
  upgradeRequired?: boolean;
}

class UsageService {
  
  /**
   * Reset daily usage if it's a new day
   */
  private async resetDailyUsageIfNeeded(user: User): Promise<User> {
    const now = new Date();
    const lastReset = new Date(user.lastUsageReset);
    
    // Check if it's a new day
    const isNewDay = now.getDate() !== lastReset.getDate() || 
                     now.getMonth() !== lastReset.getMonth() || 
                     now.getFullYear() !== lastReset.getFullYear();
    
    if (isNewDay) {
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
    const planLimits = PLAN_LIMITS[currentUser.role as PlanType] || PLAN_LIMITS.free;
    
    const remainingOffers = Math.max(0, planLimits.dailyOffers - currentUser.dailyOfferCount);
    const offerUsagePercent = currentUser.dailyOfferCount / planLimits.dailyOffers;
    
    let warningMessage: string | undefined;
    let upgradeRequired = false;

    // Check for soft cap warnings (80%)
    if (offerUsagePercent >= 0.8 && remainingOffers > 0) {
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
      dailyOfferCount: currentUser.dailyOfferCount,
      planLimits,
      warningMessage,
      upgradeRequired
    };
  }

  /**
   * Check if user can perform an action
   */
  async canUserProceed(userId: number): Promise<{ allowed: boolean; status: UsageStatus; message?: string }> {
    const status = await this.getUserUsageStatus(userId);
    
    if (!status.canProceed) {
      return {
        allowed: false,
        status,
        message: status.warningMessage || "Daily limit reached"
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
  async recordOfferGeneration(userId: number, tokensUsed: number = 500): Promise<void> {
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

  /**
   * Record vault access for refund protection
   */
  async recordVaultAccess(userId: number): Promise<void> {
    await db
      .update(users)
      .set({
        vaultAccessedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  /**
   * Check if user has accessed vault (for refund protection)
   */
  async hasAccessedVault(userId: number): Promise<boolean> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user?.vaultAccessedAt !== null;
  }

  /**
   * Update user plan and subscription status
   */
  async updateUserPlan(userId: number, plan: PlanType, subscriptionStatus: string = "active"): Promise<void> {
    await db
      .update(users)
      .set({
        role: plan,
        subscriptionStatus,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }
}

export const usageService = new UsageService();