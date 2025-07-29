import { db } from './db';
import { users, securityEvents, deviceFingerprints } from '@shared/schema';
import { eq, and, gte, count, desc } from 'drizzle-orm';

export interface DeviceFingerprint {
  visitorId: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  webgl: boolean;
  canvas: string;
}

export interface SecurityFlags {
  isDisposableEmail: boolean;
  isDuplicateFingerprint: boolean;
  isHighRiskIP: boolean;
  isSuspiciousPattern: boolean;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityEvent {
  type: 'signup_attempt' | 'duplicate_fingerprint' | 'ip_abuse' | 'disposable_email' | 'manual_flag';
  severity: 'info' | 'warning' | 'critical';
  userId?: number;
  fingerprint?: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  timestamp: Date;
}

// Disposable email domains (top abused services)
const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'tempmail.org', '10minutemail.com', 'guerrillamail.com',
  'yopmail.com', 'fakeinbox.com', 'throwaway.email', 'temp-mail.org',
  'getnada.com', 'maildrop.cc', 'sharklasers.com', 'anonymail.org',
  'tempinbox.com', 'trashmail.com', 'dispostable.com', 'mailcatch.com',
  'emailondeck.com', 'spamgourmet.com', 'mohmal.com', 'jetable.org'
];

// Common suspicious email patterns
const SUSPICIOUS_PATTERNS = [
  /^[a-zA-Z0-9]{8,}@/, // Long random strings
  /\d{4,}/, // Multiple consecutive numbers
  /^test\d*@/, // Test accounts
  /^user\d*@/, // Generic user accounts
  /^admin\d*@/, // Admin impersonation
  /^\w{1,3}@/, // Very short usernames
];

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

export function hasSuspiciousEmailPattern(email: string): boolean {
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(email.toLowerCase()));
}

export async function checkDeviceFingerprint(fingerprint: DeviceFingerprint): Promise<{
  isDuplicate: boolean;
  existingUserId?: number;
  accountCount: number;
}> {
  try {
    const existing = await db
      .select()
      .from(deviceFingerprints)
      .where(eq(deviceFingerprints.visitorId, fingerprint.visitorId))
      .limit(1);

    if (existing.length > 0) {
      // Count how many accounts use this fingerprint
      const accountCount = await db
        .select({ count: count() })
        .from(deviceFingerprints)
        .where(eq(deviceFingerprints.visitorId, fingerprint.visitorId));

      return {
        isDuplicate: true,
        existingUserId: existing[0].userId,
        accountCount: accountCount[0].count
      };
    }

    return { isDuplicate: false, accountCount: 0 };
  } catch (error) {
    console.error('Error checking device fingerprint:', error);
    return { isDuplicate: false, accountCount: 0 };
  }
}

export async function checkIPRisk(ipAddress: string): Promise<{
  isHighRisk: boolean;
  recentSignups: number;
  blockedAttempts: number;
}> {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Check recent signups from this IP
    const recentSignups = await db
      .select({ count: count() })
      .from(users)
      .where(and(
        eq(users.ipAddress, ipAddress),
        gte(users.createdAt, twentyFourHoursAgo)
      ));

    // Check blocked attempts
    const blockedAttempts = await db
      .select({ count: count() })
      .from(securityEvents)
      .where(and(
        eq(securityEvents.ipAddress, ipAddress),
        eq(securityEvents.type, 'ip_abuse'),
        gte(securityEvents.createdAt, twentyFourHoursAgo)
      ));

    const signupCount = recentSignups[0].count;
    const blockedCount = blockedAttempts[0].count;

    return {
      isHighRisk: signupCount >= 3 || blockedCount >= 5,
      recentSignups: signupCount,
      blockedAttempts: blockedCount
    };
  } catch (error) {
    console.error('Error checking IP risk:', error);
    return { isHighRisk: false, recentSignups: 0, blockedAttempts: 0 };
  }
}

export function calculateRiskScore(flags: Partial<SecurityFlags>): { score: number; level: SecurityFlags['riskLevel'] } {
  let score = 0;

  if (flags.isDisposableEmail) score += 30;
  if (flags.isDuplicateFingerprint) score += 40;
  if (flags.isHighRiskIP) score += 25;
  if (flags.isSuspiciousPattern) score += 20;

  let level: SecurityFlags['riskLevel'];
  if (score >= 80) level = 'critical';
  else if (score >= 60) level = 'high';
  else if (score >= 30) level = 'medium';
  else level = 'low';

  return { score, level };
}

export async function performSecurityCheck(
  email: string,
  fingerprint: DeviceFingerprint,
  ipAddress: string,
  userAgent: string
): Promise<SecurityFlags> {
  const disposableEmail = isDisposableEmail(email);
  const suspiciousPattern = hasSuspiciousEmailPattern(email);
  const fingerprintCheck = await checkDeviceFingerprint(fingerprint);
  const ipRisk = await checkIPRisk(ipAddress);

  const partialFlags = {
    isDisposableEmail: disposableEmail,
    isDuplicateFingerprint: fingerprintCheck.isDuplicate,
    isHighRiskIP: ipRisk.isHighRisk,
    isSuspiciousPattern: suspiciousPattern
  };

  const { score, level } = calculateRiskScore(partialFlags);

  return {
    ...partialFlags,
    riskScore: score,
    riskLevel: level
  };
}

export async function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): Promise<void> {
  try {
    await db.insert(securityEvents).values({
      ...event,
      details: JSON.stringify(event.details),
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

export async function storeDeviceFingerprint(
  userId: number,
  fingerprint: DeviceFingerprint
): Promise<void> {
  try {
    await db.insert(deviceFingerprints).values({
      userId,
      visitorId: fingerprint.visitorId,
      userAgent: fingerprint.userAgent,
      screenResolution: fingerprint.screenResolution,
      timezone: fingerprint.timezone,
      language: fingerprint.language,
      platform: fingerprint.platform,
      capabilities: JSON.stringify({
        cookiesEnabled: fingerprint.cookiesEnabled,
        localStorage: fingerprint.localStorage,
        sessionStorage: fingerprint.sessionStorage,
        indexedDB: fingerprint.indexedDB,
        webgl: fingerprint.webgl
      }),
      canvasFingerprint: fingerprint.canvas,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error storing device fingerprint:', error);
  }
}

export async function getSecurityDashboardData(): Promise<{
  recentEvents: SecurityEvent[];
  riskStats: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  flaggedPatterns: {
    duplicateFingerprints: number;
    disposableEmails: number;
    highRiskIPs: number;
    suspiciousPatterns: number;
  };
}> {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get recent security events
    const recentEvents = await db
      .select()
      .from(securityEvents)
      .where(gte(securityEvents.createdAt, twentyFourHoursAgo))
      .orderBy(desc(securityEvents.createdAt))
      .limit(50);

    // Calculate risk stats (mock data for demo)
    const riskStats = {
      total: 147,
      critical: 3,
      high: 12,
      medium: 28,
      low: 104
    };

    // Calculate flagged patterns
    const flaggedPatterns = {
      duplicateFingerprints: 8,
      disposableEmails: 23,
      highRiskIPs: 5,
      suspiciousPatterns: 15
    };

    return {
      recentEvents: recentEvents.map(event => ({
        ...event,
        details: JSON.parse(event.details),
        timestamp: event.createdAt
      })),
      riskStats,
      flaggedPatterns
    };
  } catch (error) {
    console.error('Error getting security dashboard data:', error);
    return {
      recentEvents: [],
      riskStats: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
      flaggedPatterns: { duplicateFingerprints: 0, disposableEmails: 0, highRiskIPs: 0, suspiciousPatterns: 0 }
    };
  }
}

export async function enforceSecurityPolicy(
  securityFlags: SecurityFlags,
  userId?: number
): Promise<{
  action: 'allow' | 'throttle' | 'block' | 'manual_review';
  message?: string;
  restrictions?: string[];
}> {
  const { riskLevel, riskScore } = securityFlags;

  if (riskLevel === 'critical' || riskScore >= 80) {
    if (userId) {
      await logSecurityEvent({
        type: 'manual_flag',
        severity: 'critical',
        userId,
        ipAddress: 'unknown',
        userAgent: 'unknown',
        details: { riskScore, flags: securityFlags }
      });
    }

    return {
      action: 'block',
      message: 'Account creation blocked due to security policy violations. Please contact support.',
      restrictions: ['Account creation denied', 'All platform access suspended']
    };
  }

  if (riskLevel === 'high' || riskScore >= 60) {
    return {
      action: 'manual_review',
      message: 'Account flagged for manual review. Limited access granted pending verification.',
      restrictions: [
        'Hook generation limited to 1 per day',
        'CAPTCHA required for all actions',
        'Email verification required within 24 hours'
      ]
    };
  }

  if (riskLevel === 'medium' || riskScore >= 30) {
    return {
      action: 'throttle',
      message: 'Enhanced security measures applied to your account.',
      restrictions: [
        'Hook generation delayed by 15 minutes',
        'Limited to 1 hook per 12 hours initially',
        'Progressive access unlocked over 7 days'
      ]
    };
  }

  return { action: 'allow' };
}

export interface HookAccessControl {
  canGenerate: boolean;
  delayMinutes?: number;
  dailyLimit?: number;
  message?: string;
  nextAvailable?: Date;
}

export async function checkHookAccess(
  userId: number,
  securityFlags: SecurityFlags
): Promise<HookAccessControl> {
  const policy = await enforceSecurityPolicy(securityFlags, userId);

  if (policy.action === 'block') {
    return {
      canGenerate: false,
      message: 'Access suspended due to security policy violations.'
    };
  }

  if (policy.action === 'manual_review') {
    return {
      canGenerate: true,
      dailyLimit: 1,
      delayMinutes: 0,
      message: 'Account under review - limited access granted.'
    };
  }

  if (policy.action === 'throttle') {
    const nextAvailable = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    return {
      canGenerate: true,
      delayMinutes: 15,
      dailyLimit: 2,
      nextAvailable,
      message: 'Enhanced security active - delayed access applied.'
    };
  }

  return { canGenerate: true };
}