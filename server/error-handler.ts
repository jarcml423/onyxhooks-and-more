import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export class OnyxHooksError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    this.name = 'OnyxHooksError';

    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error types for common scenarios
export class ValidationError extends OnyxHooksError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends OnyxHooksError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends OnyxHooksError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends OnyxHooksError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends OnyxHooksError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

export class QuotaExceededError extends OnyxHooksError {
  constructor(message: string = 'Usage quota exceeded') {
    super(message, 402, 'QUOTA_EXCEEDED');
    this.name = 'QuotaExceededError';
  }
}

export class AIServiceError extends OnyxHooksError {
  constructor(message: string = 'AI service temporarily unavailable') {
    super(message, 503, 'AI_SERVICE_ERROR');
    this.name = 'AIServiceError';
  }
}

export class DatabaseError extends OnyxHooksError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

// Error response formatter
export function formatErrorResponse(error: AppError, tier: string) {
  const baseResponse = {
    success: false,
    error: {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message,
      statusCode: error.statusCode || 500
    }
  };

  // Add tier-specific guidance
  switch (tier) {
    case 'free':
      return {
        ...baseResponse,
        guidance: getFreeUserGuidance(error),
        upgradePrompt: getUpgradePrompt(error)
      };
    case 'starter':
      return {
        ...baseResponse,
        guidance: getStarterUserGuidance(error),
        supportInfo: 'Need help? Contact support@offerforge.ai'
      };
    case 'pro':
      return {
        ...baseResponse,
        guidance: getProUserGuidance(error),
        supportInfo: 'Priority support available - contact support@offerforge.ai'
      };
    case 'vault':
      return {
        ...baseResponse,
        guidance: getVaultUserGuidance(error),
        supportInfo: 'VIP support - Call +1-555-VAULT or support@offerforge.ai'
      };
    default:
      return baseResponse;
  }
}

function getFreeUserGuidance(error: AppError): string {
  switch (error.code) {
    case 'QUOTA_EXCEEDED':
      return 'You\'ve used your 2 free generations today. Upgrade to Starter for unlimited generations!';
    case 'AI_SERVICE_ERROR':
      return 'Our AI is temporarily busy. Free users may experience delays during peak times.';
    case 'RATE_LIMIT_ERROR':
      return 'Slow down a bit! Free users have a 30-second cooldown between generations.';
    case 'VALIDATION_ERROR':
      return 'Check your input - make sure to fill in both niche and transformation fields.';
    default:
      return 'Something went wrong. Free users get basic support - consider upgrading for priority help!';
  }
}

function getStarterUserGuidance(error: AppError): string {
  switch (error.code) {
    case 'AI_SERVICE_ERROR':
      return 'AI service hiccup detected. Starter users get faster recovery times than free users.';
    case 'RATE_LIMIT_ERROR':
      return 'You\'re generating fast! Starter users have reduced cooldowns compared to free users.';
    case 'VALIDATION_ERROR':
      return 'Input validation failed. Double-check your niche and transformation details.';
    default:
      return 'Error detected. As a Starter user, you have email support access for assistance.';
  }
}

function getProUserGuidance(error: AppError): string {
  switch (error.code) {
    case 'AI_SERVICE_ERROR':
      return 'AI service interruption. Pro users get priority queue access - retrying automatically.';
    case 'VALIDATION_ERROR':
      return 'Input validation issue. Pro users can access advanced validation tools for better results.';
    default:
      return 'Pro-level error handling activated. You have priority support access for quick resolution.';
  }
}

function getVaultUserGuidance(error: AppError): string {
  switch (error.code) {
    case 'AI_SERVICE_ERROR':
      return 'VIP AI service recovery initiated. Vault users get dedicated infrastructure priority.';
    case 'VALIDATION_ERROR':
      return 'Advanced validation available. Vault users can access premium input optimization tools.';
    default:
      return 'Vault-level error recovery active. VIP support team has been automatically notified.';
  }
}

function getUpgradePrompt(error: AppError): string | null {
  switch (error.code) {
    case 'QUOTA_EXCEEDED':
      return 'Upgrade to Starter ($47 one-time) for unlimited generations and no daily limits!';
    case 'RATE_LIMIT_ERROR':
      return 'Upgrade to Starter for faster generation speeds and reduced cooldowns!';
    case 'AI_SERVICE_ERROR':
      return 'Upgrade to Pro ($197/month) for priority AI access and 99.9% uptime!';
    default:
      return null;
  }
}

// Express error handler middleware
export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  const appError = error as AppError;
  const userTier = (req as any).userTier || 'free';
  
  // Log error for monitoring
  console.error(`[${new Date().toISOString()}] Error in ${req.method} ${req.path}:`, {
    message: error.message,
    stack: error.stack,
    user: (req as any).user?.id,
    tier: userTier
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const statusCode = appError.statusCode || 500;
  
  if (isDevelopment) {
    const response = formatErrorResponse(appError, userTier);
    response.error.stack = error.stack;
    return res.status(statusCode).json(response);
  }

  // Production error response
  if (appError.isOperational) {
    return res.status(statusCode).json(formatErrorResponse(appError, userTier));
  }

  // Unknown error - don't leak details
  const unknownError = new OnyxHooksError('Something went wrong on our end', 500, 'INTERNAL_ERROR');
  return res.status(500).json(formatErrorResponse(unknownError, userTier));
}

// Async error wrapper for route handlers
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}