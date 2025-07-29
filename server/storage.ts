import { 
  users, offers, funnelReviews, roiSimulations, quizResults, referrals, agencyClients, usageLogs,
  type User, type InsertUser, type Offer, type InsertOffer, type FunnelReview, type InsertFunnelReview,
  type RoiSimulation, type InsertRoiSimulation, type QuizResult, type InsertQuizResult,
  type Referral, type InsertReferral, type AgencyClient, type InsertAgencyClient, type UsageLog, type InsertUsageLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  updateUserStripeInfo(id: number, customerId: string, subscriptionId?: string): Promise<User>;
  updateUserSubscription(id: number, updates: { 
    subscriptionStatus?: 'active' | 'canceled' | 'past_due';
    accessGranted?: boolean;
    role?: 'free' | 'starter' | 'pro' | 'vault' | 'agency';
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
  }): Promise<User>;
  
  // Offers
  createOffer(offer: InsertOffer): Promise<Offer>;
  getUserOffers(userId: number): Promise<Offer[]>;
  getOffer(id: number): Promise<Offer | undefined>;
  
  // Funnel Reviews
  createFunnelReview(review: InsertFunnelReview): Promise<FunnelReview>;
  getUserFunnelReviews(userId: number): Promise<FunnelReview[]>;
  
  // ROI Simulations
  createRoiSimulation(simulation: InsertRoiSimulation): Promise<RoiSimulation>;
  getUserRoiSimulations(userId: number): Promise<RoiSimulation[]>;
  
  // Quiz Results
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResult(id: number): Promise<QuizResult | undefined>;
  
  // Referrals
  createReferral(referral: InsertReferral): Promise<Referral>;
  getUserReferrals(userId: number): Promise<Referral[]>;
  getReferralByEmail(email: string, referrerId: number): Promise<Referral | undefined>;
  updateReferralStatus(id: number, status: "pending" | "converted" | "paid", commissionAmount?: string): Promise<Referral>;
  
  // Agency Clients
  createAgencyClient(client: InsertAgencyClient): Promise<AgencyClient>;
  getUserAgencyClients(userId: number): Promise<AgencyClient[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users);
    return allUsers;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set({
      ...updates,
      updatedAt: new Date()
    }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserStripeInfo(id: number, customerId: string, subscriptionId?: string): Promise<User> {
    const [user] = await db.update(users).set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date()
    }).where(eq(users.id, id)).returning();
    return user;
  }

  async updateUserSubscription(id: number, updates: { 
    subscriptionStatus?: 'active' | 'canceled' | 'past_due';
    accessGranted?: boolean;
    role?: 'free' | 'starter' | 'pro' | 'vault' | 'agency';
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
  }): Promise<User> {
    const updateData: any = {
      updatedAt: new Date()
    };

    if (updates.subscriptionStatus !== undefined) {
      updateData.subscriptionStatus = updates.subscriptionStatus;
    }
    if (updates.accessGranted !== undefined) {
      updateData.accessGranted = updates.accessGranted;
    }
    if (updates.role !== undefined) {
      updateData.role = updates.role;
    }
    if (updates.stripeSubscriptionId !== undefined) {
      updateData.stripeSubscriptionId = updates.stripeSubscriptionId;
    }
    if (updates.stripeCustomerId !== undefined) {
      updateData.stripeCustomerId = updates.stripeCustomerId;
    }

    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  async createOffer(insertOffer: InsertOffer): Promise<Offer> {
    const [offer] = await db.insert(offers).values(insertOffer).returning();
    return offer;
  }

  async getUserOffers(userId: number): Promise<Offer[]> {
    return await db.select().from(offers).where(eq(offers.userId, userId)).orderBy(desc(offers.createdAt));
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer || undefined;
  }

  async createFunnelReview(insertReview: InsertFunnelReview): Promise<FunnelReview> {
    const [review] = await db.insert(funnelReviews).values(insertReview).returning();
    return review;
  }

  async getUserFunnelReviews(userId: number): Promise<FunnelReview[]> {
    return await db.select().from(funnelReviews).where(eq(funnelReviews.userId, userId)).orderBy(desc(funnelReviews.createdAt));
  }

  async createRoiSimulation(insertSimulation: InsertRoiSimulation): Promise<RoiSimulation> {
    const [simulation] = await db.insert(roiSimulations).values(insertSimulation).returning();
    return simulation;
  }

  async getUserRoiSimulations(userId: number): Promise<RoiSimulation[]> {
    return await db.select().from(roiSimulations).where(eq(roiSimulations.userId, userId)).orderBy(desc(roiSimulations.createdAt));
  }

  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const [result] = await db.insert(quizResults).values(insertResult).returning();
    return result;
  }

  async getQuizResult(id: number): Promise<QuizResult | undefined> {
    const [result] = await db.select().from(quizResults).where(eq(quizResults.id, id));
    return result || undefined;
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const [referral] = await db.insert(referrals).values(insertReferral).returning();
    return referral;
  }

  async getUserReferrals(userId: number): Promise<Referral[]> {
    return await db.select().from(referrals).where(eq(referrals.referrerId, userId)).orderBy(desc(referrals.createdAt));
  }

  async getReferralByEmail(email: string, referrerId: number): Promise<Referral | undefined> {
    const [referral] = await db.select().from(referrals).where(
      and(eq(referrals.referredEmail, email), eq(referrals.referrerId, referrerId))
    );
    return referral || undefined;
  }

  async updateReferralStatus(id: number, status: "pending" | "converted" | "paid", commissionAmount?: string): Promise<Referral> {
    const [referral] = await db.update(referrals).set({
      status,
      commissionAmount
    }).where(eq(referrals.id, id)).returning();
    return referral;
  }

  async createAgencyClient(insertClient: InsertAgencyClient): Promise<AgencyClient> {
    const [client] = await db.insert(agencyClients).values(insertClient).returning();
    return client;
  }

  async getUserAgencyClients(userId: number): Promise<AgencyClient[]> {
    return await db.select().from(agencyClients).where(
      and(eq(agencyClients.agencyUserId, userId), eq(agencyClients.isActive, true))
    ).orderBy(desc(agencyClients.createdAt));
  }

  // UTM tracking methods
  async createUTMRecord(data: any): Promise<any> {
    // Implementation placeholder - would need UTM table in schema
    return { id: 1, ...data };
  }

  async getUserUTMData(userId: number): Promise<any[]> {
    // Implementation placeholder - would need UTM table in schema  
    return [];
  }

  // Campaign methods
  async getUserCampaigns(userId: number): Promise<any[]> {
    // Implementation placeholder - would need campaigns table in schema
    return [];
  }

  // Security methods
  async getSecurityEvents(): Promise<any[]> {
    // Implementation placeholder - would need security events table in schema
    return [];
  }
}

export const storage = new DatabaseStorage();
