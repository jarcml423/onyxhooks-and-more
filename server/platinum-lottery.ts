import { db } from "./db";
import { platinumLotteryApplications, users } from "@shared/schema";
import { eq, and, count } from "drizzle-orm";
import type { InsertPlatinumLotteryApplication, PlatinumLotteryApplication } from "@shared/schema";

export interface PlatinumLotteryStats {
  totalApplications: number;
  pendingApplications: number;
  selectedApplications: number;
  availableSlots: number;
  isLotteryClosed: boolean;
  currentYear: number;
}

export interface LotteryEligibility {
  canApply: boolean;
  reason?: string;
  hasExistingApplication?: boolean;
}

/**
 * Check if a user is eligible to apply for the Platinum Lottery
 */
export async function checkLotteryEligibility(userId: number): Promise<LotteryEligibility> {
  const currentYear = new Date().getFullYear();
  
  // Check if user is Vault tier
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user[0] || (user[0].role !== "vault" && user[0].role !== "agency")) {
    return {
      canApply: false,
      reason: "Only Vault tier users can apply for the Ultimate Platinum Lottery"
    };
  }

  // Check if user already has an application this year
  const existingApplication = await db
    .select()
    .from(platinumLotteryApplications)
    .where(
      and(
        eq(platinumLotteryApplications.userId, userId),
        eq(platinumLotteryApplications.year, currentYear)
      )
    )
    .limit(1);

  if (existingApplication.length > 0) {
    return {
      canApply: false,
      reason: "You have already submitted an application for this year",
      hasExistingApplication: true
    };
  }

  // Check if lottery is still open (max 5 selected per year)
  const [selectedCount] = await db
    .select({ count: count() })
    .from(platinumLotteryApplications)
    .where(
      and(
        eq(platinumLotteryApplications.year, currentYear),
        eq(platinumLotteryApplications.status, "selected")
      )
    );

  if (selectedCount.count >= 5) {
    return {
      canApply: false,
      reason: "Lottery entries are closed for this year. Only 5 winners are selected annually."
    };
  }

  return { canApply: true };
}

/**
 * Get current lottery statistics
 */
export async function getLotteryStats(): Promise<PlatinumLotteryStats> {
  const currentYear = new Date().getFullYear();

  const [totalApps] = await db
    .select({ count: count() })
    .from(platinumLotteryApplications)
    .where(eq(platinumLotteryApplications.year, currentYear));

  const [pendingApps] = await db
    .select({ count: count() })
    .from(platinumLotteryApplications)
    .where(
      and(
        eq(platinumLotteryApplications.year, currentYear),
        eq(platinumLotteryApplications.status, "pending")
      )
    );

  const [selectedApps] = await db
    .select({ count: count() })
    .from(platinumLotteryApplications)
    .where(
      and(
        eq(platinumLotteryApplications.year, currentYear),
        eq(platinumLotteryApplications.status, "selected")
      )
    );

  const availableSlots = Math.max(0, 5 - selectedApps.count);
  const isLotteryClosed = selectedApps.count >= 5;

  return {
    totalApplications: totalApps.count,
    pendingApplications: pendingApps.count,
    selectedApplications: selectedApps.count,
    availableSlots,
    isLotteryClosed,
    currentYear
  };
}

/**
 * Submit a new Platinum Lottery application
 */
export async function submitLotteryApplication(
  applicationData: Omit<InsertPlatinumLotteryApplication, "year">
): Promise<PlatinumLotteryApplication> {
  const currentYear = new Date().getFullYear();

  // Verify eligibility before submission
  const eligibility = await checkLotteryEligibility(applicationData.userId);
  if (!eligibility.canApply) {
    throw new Error(eligibility.reason || "Not eligible to apply");
  }

  const [application] = await db
    .insert(platinumLotteryApplications)
    .values({
      ...applicationData,
      year: currentYear,
      status: "pending"
    })
    .returning();

  return application;
}

/**
 * Get user's application for current year
 */
export async function getUserApplication(userId: number): Promise<PlatinumLotteryApplication | null> {
  const currentYear = new Date().getFullYear();

  const [application] = await db
    .select()
    .from(platinumLotteryApplications)
    .where(
      and(
        eq(platinumLotteryApplications.userId, userId),
        eq(platinumLotteryApplications.year, currentYear)
      )
    )
    .limit(1);

  return application || null;
}

/**
 * Admin function: Select a winner and set payment deadline
 */
export async function selectWinner(applicationId: number): Promise<PlatinumLotteryApplication> {
  const paymentDeadline = new Date();
  paymentDeadline.setHours(paymentDeadline.getHours() + 48); // 48 hours to pay

  const [updatedApplication] = await db
    .update(platinumLotteryApplications)
    .set({
      status: "selected",
      selectedAt: new Date(),
      paymentDeadline
    })
    .where(eq(platinumLotteryApplications.id, applicationId))
    .returning();

  return updatedApplication;
}

/**
 * Admin function: Mark application as paid
 */
export async function markApplicationPaid(applicationId: number): Promise<PlatinumLotteryApplication> {
  const [updatedApplication] = await db
    .update(platinumLotteryApplications)
    .set({
      status: "paid",
      paidAt: new Date()
    })
    .where(eq(platinumLotteryApplications.id, applicationId))
    .returning();

  return updatedApplication;
}

/**
 * Admin function: Get all applications for review
 */
export async function getAllApplications(year?: number): Promise<PlatinumLotteryApplication[]> {
  const targetYear = year || new Date().getFullYear();
  
  return await db
    .select()
    .from(platinumLotteryApplications)
    .where(eq(platinumLotteryApplications.year, targetYear))
    .orderBy(platinumLotteryApplications.createdAt);
}

/**
 * Check if payment deadline has passed for selected applications
 */
export async function checkExpiredPayments(): Promise<void> {
  const now = new Date();
  
  // Find selected applications with expired payment deadlines
  const expiredApplications = await db
    .select()
    .from(platinumLotteryApplications)
    .where(
      and(
        eq(platinumLotteryApplications.status, "selected"),
        // paymentDeadline < now (payment deadline has passed)
      )
    );

  // Mark expired applications as rejected to free up slots
  for (const app of expiredApplications) {
    if (app.paymentDeadline && app.paymentDeadline < now) {
      await db
        .update(platinumLotteryApplications)
        .set({ status: "rejected" })
        .where(eq(platinumLotteryApplications.id, app.id));
    }
  }
}