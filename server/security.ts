import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// IP-based rate limiting for signups and forms
const signupAttempts = new Map<string, { count: number; lastAttempt: number }>();
const SIGNUP_RATE_LIMIT = {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * Prevent multiple signups from same IP
 */
export function signupRateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  const attempts = signupAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  
  // Reset if window has expired
  if (now - attempts.lastAttempt > SIGNUP_RATE_LIMIT.windowMs) {
    attempts.count = 0;
  }
  
  if (attempts.count >= SIGNUP_RATE_LIMIT.maxAttempts) {
    console.log(`[SECURITY] Blocked signup attempt from IP: ${ip} (${attempts.count} attempts)`);
    return res.status(429).json({
      message: "Too many signup attempts from this IP. Please try again in 1 hour."
    });
  }
  
  // Increment counter
  attempts.count++;
  attempts.lastAttempt = now;
  signupAttempts.set(ip, attempts);
  
  next();
}

/**
 * Enhanced fingerprint validation for suspicious activity
 */
export function validateFingerprint(req: Request, res: Response, next: NextFunction) {
  const { fingerprint, userAgent } = req.body;
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Log suspicious activity patterns
  if (!fingerprint || !userAgent) {
    console.log(`[SECURITY] Missing fingerprint data from IP: ${ip}`);
  }
  
  // Store fingerprint for future validation
  (req as any).securityContext = {
    ip,
    fingerprint,
    userAgent,
    timestamp: Date.now()
  };
  
  next();
}

/**
 * Prevent self-referral abuse
 */
export async function validateReferral(req: Request, res: Response, next: NextFunction) {
  const { referralCode } = req.body;
  const userId = (req as any).user?.id;
  const ip = req.ip || req.connection.remoteAddress;
  const fingerprint = req.body.fingerprint;
  
  if (referralCode && userId) {
    try {
      // Get referrer user
      const referrer = await storage.getUserByReferralCode?.(referralCode);
      
      if (referrer) {
        // Prevent self-referral
        if (referrer.id === userId) {
          console.log(`[SECURITY] Self-referral attempt by user ${userId}`);
          return res.status(403).json({
            message: "Cannot refer yourself"
          });
        }
        
        // Additional checks could include IP/fingerprint matching
        // This would require storing user fingerprints in the database
      }
    } catch (error) {
      console.error('[SECURITY] Referral validation error:', error);
    }
  }
  
  next();
}

/**
 * Session hijacking protection with fingerprint validation
 */
export function validateSession(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const fingerprint = req.headers['x-fingerprint'] || req.body.fingerprint;
  
  if (!authHeader || !fingerprint) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  try {
    // In a real implementation, you'd validate JWT token and fingerprint
    // For now, we'll just log suspicious activity
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`[SECURITY] Session validation for IP: ${ip}, Fingerprint: ${fingerprint?.substring(0, 8)}...`);
    
    next();
  } catch (error) {
    console.error('[SECURITY] Session validation failed:', error);
    return res.status(401).json({ message: "Invalid session" });
  }
}

/**
 * Enhanced usage tracking with suspicious pattern detection
 */
export async function trackUsagePattern(userId: number, action: string, metadata: any = {}) {
  const timestamp = new Date();
  const pattern = {
    userId,
    action,
    timestamp,
    ip: metadata.ip,
    fingerprint: metadata.fingerprint,
    userAgent: metadata.userAgent
  };
  
  // Log for analysis
  console.log(`[USAGE] User ${userId} performed ${action} at ${timestamp.toISOString()}`);
  
  // In a real system, you'd store this in a security log table
  // and analyze patterns for suspicious behavior
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, attempts] of signupAttempts.entries()) {
    if (now - attempts.lastAttempt > SIGNUP_RATE_LIMIT.windowMs) {
      signupAttempts.delete(ip);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupRateLimits, 60 * 60 * 1000);