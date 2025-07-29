import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  firebaseUid: text("firebase_uid").notNull().unique(),
  role: text("role", { enum: ["free", "starter", "pro", "vault", "agency", "admin"] }).notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  usageCount: integer("usage_count").notNull().default(0),
  dailyOfferCount: integer("daily_offer_count").notNull().default(0),
  dailyTokenCount: integer("daily_token_count").notNull().default(0),
  lastUsageReset: timestamp("last_usage_reset").notNull().defaultNow(),
  vaultAccessedAt: timestamp("vault_accessed_at"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  // UTM Attribution fields
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmTerm: text("utm_term"),
  utmContent: text("utm_content"),
  attributionData: jsonb("attribution_data"),
  // Coaching system fields
  industry: text("industry"),
  coachType: text("coach_type"),
  painPoint: text("pain_point"),
  transformationDelivered: text("transformation_delivered"),
  currentOffer: text("current_offer"),
  primaryHook: text("primary_hook"),
  summaryFrequency: text("summary_frequency", { enum: ["none", "weekly", "monthly"] }).default("none"),
  lastSummarySent: timestamp("last_summary_sent"),
  // Security fields
  ipAddress: text("ip_address"),
  riskScore: integer("risk_score").default(0),
  riskLevel: text("risk_level", { enum: ["low", "medium", "high", "critical"] }).default("low"),
  securityFlags: jsonb("security_flags"),
  accountStatus: text("account_status", { enum: ["active", "throttled", "review", "suspended"] }).default("active"),
  lastSecurityCheck: timestamp("last_security_check"),
  // NOS 9-Second Challenge fields
  isAdmin: boolean("is_admin").default(false),
  nosFXEnabled: boolean("nos_fx_enabled").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  niche: text("niche").notNull(),
  transformation: text("transformation").notNull(),
  priceRange: text("price_range"),
  headlines: jsonb("headlines").$type<string[]>(),
  benefits: jsonb("benefits").$type<string[]>(),
  generatedData: jsonb("generated_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const funnelReviews = pgTable("funnel_reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  url: text("url"),
  content: text("content"),
  critique: text("critique").notNull(),
  score: integer("score"),
  recommendations: jsonb("recommendations").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const roiSimulations = pgTable("roi_simulations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  traffic: integer("traffic").notNull(),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  adSpend: decimal("ad_spend", { precision: 10, scale: 2 }),
  results: jsonb("results"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  email: text("email").notNull(),
  score: integer("score").notNull(),
  answers: jsonb("answers").$type<Record<string, any>>(),
  feedback: text("feedback"),
  recommendations: jsonb("recommendations").$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => users.id),
  referredId: integer("referred_id").references(() => users.id),
  referredEmail: text("referred_email").notNull(),
  status: text("status", { enum: ["pending", "converted", "paid"] }).notNull().default("pending"),
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const agencyClients = pgTable("agency_clients", {
  id: serial("id").primaryKey(),
  agencyUserId: integer("agency_user_id").notNull().references(() => users.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  brandName: text("brand_name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usageLogs = pgTable("usage_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action", { enum: ["offer_generation", "funnel_review", "vault_access", "quiz_attempt"] }).notNull(),
  tokensUsed: integer("tokens_used").notNull().default(0),
  success: boolean("success").notNull().default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const platinumLotteryApplications = pgTable("platinum_lottery_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  fullName: text("full_name").notNull(),
  businessWebsite: text("business_website").notNull(),
  annualRevenueBracket: text("annual_revenue_bracket", { 
    enum: ["0-100k", "100k-500k", "500k-1m", "1m+"] 
  }).notNull(),
  whyYouWant: text("why_you_want").notNull(),
  whatYouBuilding: text("what_you_building").notNull(),
  dreamOutcome: text("dream_outcome").notNull(),
  status: text("status", { 
    enum: ["pending", "selected", "rejected", "paid"] 
  }).notNull().default("pending"),
  selectedAt: timestamp("selected_at"),
  paymentDeadline: timestamp("payment_deadline"),
  paidAt: timestamp("paid_at"),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  offers: many(offers),
  funnelReviews: many(funnelReviews),
  roiSimulations: many(roiSimulations),
  quizResults: many(quizResults),
  referrals: many(referrals),
  agencyClients: many(agencyClients),
  usageLogs: many(usageLogs),
  platinumLotteryApplications: many(platinumLotteryApplications),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  user: one(users, {
    fields: [offers.userId],
    references: [users.id],
  }),
}));

export const funnelReviewsRelations = relations(funnelReviews, ({ one }) => ({
  user: one(users, {
    fields: [funnelReviews.userId],
    references: [users.id],
  }),
}));

export const roiSimulationsRelations = relations(roiSimulations, ({ one }) => ({
  user: one(users, {
    fields: [roiSimulations.userId],
    references: [users.id],
  }),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
  }),
}));

export const agencyClientsRelations = relations(agencyClients, ({ one }) => ({
  agencyUser: one(users, {
    fields: [agencyClients.agencyUserId],
    references: [users.id],
  }),
}));

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  user: one(users, {
    fields: [usageLogs.userId],
    references: [users.id],
  }),
}));

export const platinumLotteryApplicationsRelations = relations(platinumLotteryApplications, ({ one }) => ({
  user: one(users, {
    fields: [platinumLotteryApplications.userId],
    references: [users.id],
  }),
}));

export const utmTracking = pgTable("utm_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmTerm: text("utm_term"),
  utmContent: text("utm_content"),
  page: text("page").notNull(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  ipAddress: text("ip_address"),
  conversionEvent: text("conversion_event"), // signup, upgrade, purchase
  conversionValue: decimal("conversion_value", { precision: 10, scale: 2 }),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const utmTrackingRelations = relations(utmTracking, ({ one }) => ({
  user: one(users, {
    fields: [utmTracking.userId],
    references: [users.id],
  }),
}));

// NOS Challenge attempts tracking (separate from hook generation)
export const challengeAttempts = pgTable("challenge_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  cycle: text("cycle").notNull(), // Q1-2025, Q2-2025, etc.
  attemptNumber: integer("attempt_number").notNull(),
  timeToGenerate: integer("time_to_generate"), // milliseconds
  niche: text("niche"),
  transformation: text("transformation"),
  generatedHook: text("generated_hook"),
  generatedOffer: text("generated_offer"),
  generatedContent: text("generated_content"),
  rank: integer("rank"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const challengeAttemptsRelations = relations(challengeAttempts, ({ one }) => ({
  user: one(users, {
    fields: [challengeAttempts.userId],
    references: [users.id],
  }),
}));

export const webhookEvents = pgTable("webhook_events", {
  id: serial("id").primaryKey(),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  processed: boolean("processed").default(false),
  processingAttempts: integer("processing_attempts").default(0),
  lastProcessingError: text("last_processing_error"),
  data: jsonb("data"),
  userId: integer("user_id").references(() => users.id),
  customerId: text("customer_id"),
  subscriptionId: text("subscription_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const subscriptionHistory = pgTable("subscription_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  status: text("status").notNull(),
  planId: text("plan_id"),
  planName: text("plan_name"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  currency: text("currency").default("usd"),
  interval: text("interval"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  canceledAt: timestamp("canceled_at"),
  endedAt: timestamp("ended_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const webhookEventsRelations = relations(webhookEvents, ({ one }) => ({
  user: one(users, {
    fields: [webhookEvents.userId],
    references: [users.id],
  }),
}));

export const subscriptionHistoryRelations = relations(subscriptionHistory, ({ one }) => ({
  user: one(users, {
    fields: [subscriptionHistory.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  createdAt: true,
});

export const insertFunnelReviewSchema = createInsertSchema(funnelReviews).omit({
  id: true,
  createdAt: true,
});

export const insertRoiSimulationSchema = createInsertSchema(roiSimulations).omit({
  id: true,
  createdAt: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  createdAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export const insertAgencyClientSchema = createInsertSchema(agencyClients).omit({
  id: true,
  createdAt: true,
});

export const insertUsageLogSchema = createInsertSchema(usageLogs).omit({
  id: true,
  createdAt: true,
});

export const insertPlatinumLotteryApplicationSchema = createInsertSchema(platinumLotteryApplications).omit({
  id: true,
  createdAt: true,
});

export const insertUtmTrackingSchema = createInsertSchema(utmTracking).omit({
  id: true,
  timestamp: true,
});

export const insertWebhookEventSchema = createInsertSchema(webhookEvents).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionHistorySchema = createInsertSchema(subscriptionHistory).omit({
  id: true,
  createdAt: true,
});



// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type FunnelReview = typeof funnelReviews.$inferSelect;
export type InsertFunnelReview = z.infer<typeof insertFunnelReviewSchema>;
export type RoiSimulation = typeof roiSimulations.$inferSelect;
export type InsertRoiSimulation = z.infer<typeof insertRoiSimulationSchema>;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type AgencyClient = typeof agencyClients.$inferSelect;
export type InsertAgencyClient = z.infer<typeof insertAgencyClientSchema>;
export type UsageLog = typeof usageLogs.$inferSelect;
export type InsertUsageLog = z.infer<typeof insertUsageLogSchema>;
export type PlatinumLotteryApplication = typeof platinumLotteryApplications.$inferSelect;
export type InsertPlatinumLotteryApplication = z.infer<typeof insertPlatinumLotteryApplicationSchema>;
export type UtmTracking = typeof utmTracking.$inferSelect;
export type InsertUtmTracking = z.infer<typeof insertUtmTrackingSchema>;
export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type InsertWebhookEvent = z.infer<typeof insertWebhookEventSchema>;
export type SubscriptionHistory = typeof subscriptionHistory.$inferSelect;
export type InsertSubscriptionHistory = z.infer<typeof insertSubscriptionHistorySchema>;
export type EmailUnsubscribe = typeof emailUnsubscribes.$inferSelect;
export type InsertEmailUnsubscribe = z.infer<typeof insertEmailUnsubscribeSchema>;
export type SwipeCopyItem = typeof swipeCopyItems.$inferSelect;
export type InsertSwipeCopyItem = z.infer<typeof insertSwipeCopyItemSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;

// Security System Tables
export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  type: text("type", { enum: ["signup_attempt", "duplicate_fingerprint", "ip_abuse", "disposable_email", "manual_flag"] }).notNull(),
  severity: text("severity", { enum: ["info", "warning", "critical"] }).notNull(),
  userId: integer("user_id").references(() => users.id),
  fingerprint: text("fingerprint"),
  ipAddress: text("ip_address").notNull(),
  userAgent: text("user_agent").notNull(),
  details: text("details").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const deviceFingerprints = pgTable("device_fingerprints", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  visitorId: text("visitor_id").notNull(),
  userAgent: text("user_agent").notNull(),
  screenResolution: text("screen_resolution").notNull(),
  timezone: text("timezone").notNull(),
  language: text("language").notNull(),
  platform: text("platform").notNull(),
  capabilities: text("capabilities").notNull(), // JSON string
  canvasFingerprint: text("canvas_fingerprint"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations for security tables
export const securityEventsRelations = relations(securityEvents, ({ one }) => ({
  user: one(users, {
    fields: [securityEvents.userId],
    references: [users.id],
  }),
}));

export const deviceFingerprintsRelations = relations(deviceFingerprints, ({ one }) => ({
  user: one(users, {
    fields: [deviceFingerprints.userId],
    references: [users.id],
  }),
}));

// Schemas for security tables
export const insertSecurityEventSchema = createInsertSchema(securityEvents);
export const insertDeviceFingerprintSchema = createInsertSchema(deviceFingerprints);

export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;
export type DeviceFingerprint = typeof deviceFingerprints.$inferSelect;
export type InsertDeviceFingerprint = z.infer<typeof insertDeviceFingerprintSchema>;

// Swipe Copy Bank Tables
// Email unsubscribe tracking
export const emailUnsubscribes = pgTable('email_unsubscribes', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  unsubscribeToken: text('unsubscribe_token').notNull().unique(),
  emailType: text('email_type', { enum: ['all', 'marketing', 'updates', 'vault_notifications'] }).notNull().default('all'),
  unsubscribedAt: timestamp('unsubscribed_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});

export const swipeCopyItems = pgTable("swipe_copy_items", {
  id: serial("id").primaryKey(),
  category: text("category", { enum: ["hooks", "ctas", "closers", "objections", "urgency"] }).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Changed from 'copy' to 'content' to match scheduler
  useCase: text("use_case").notNull(),
  industry: text("industry"),
  monthAdded: text("month_added"), // Changed to match scheduler field name
  performanceData: jsonb("performance_data"), // CTR, conversion rates, etc.
  psychologyTriggers: text("psychology_triggers").array().default(['general']),
  isMonthlyUpdate: boolean("is_monthly_update").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// NOS 9-Second Challenge Tables
export const challengeEntries = pgTable("challenge_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  displayName: text("display_name").notNull(),
  timeToGenerate: integer("time_to_generate").notNull(), // in milliseconds
  challengeCycle: text("challenge_cycle").notNull(), // e.g., "Q3-2025"
  generatedHook: text("generated_hook"),
  generatedOffer: text("generated_offer"),
  attemptNumber: integer("attempt_number").notNull().default(1), // 1 or 2 (max 2 attempts per cycle)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appConfig = pgTable("app_config", {
  id: serial("id").primaryKey(),
  challengeActive: boolean("challenge_active").notNull().default(false),
  currentChallengeCycle: text("current_challenge_cycle").notNull().default("Q4-2025"),
  challengeStartDate: timestamp("challenge_start_date"),
  challengeEndDate: timestamp("challenge_end_date"),
  maxAttemptsPerCycle: integer("max_attempts_per_cycle").notNull().default(2),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations for challenge tables
export const challengeEntriesRelations = relations(challengeEntries, ({ one }) => ({
  user: one(users, {
    fields: [challengeEntries.userId],
    references: [users.id],
  }),
}));

// Schemas for challenge tables
export const insertChallengeEntrySchema = createInsertSchema(challengeEntries).omit({
  id: true,
  createdAt: true,
});

export const insertAppConfigSchema = createInsertSchema(appConfig).omit({
  id: true,
  updatedAt: true,
});

export const insertEmailUnsubscribeSchema = createInsertSchema(emailUnsubscribes).omit({
  id: true,
  unsubscribedAt: true,
});

export const insertSwipeCopyItemSchema = createInsertSchema(swipeCopyItems).omit({
  id: true,
  createdAt: true,
});

// Support ticket system
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  category: text("category").notNull(), // 'technical', 'billing', 'feature_request', 'bug_report', 'general'
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default('open'), // 'open', 'in_progress', 'resolved', 'closed'
  priority: text("priority").notNull().default('medium'), // 'low', 'medium', 'high', 'urgent'
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  adminNotes: text("admin_notes"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  isUnsubscribedUser: boolean("is_unsubscribed_user").default(false)
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  submittedAt: true,
});

// Types for challenge tables
export type ChallengeEntry = typeof challengeEntries.$inferSelect;
export type InsertChallengeEntry = z.infer<typeof insertChallengeEntrySchema>;
export type AppConfig = typeof appConfig.$inferSelect;
export type InsertAppConfig = z.infer<typeof insertAppConfigSchema>;
