import { Request, Response, NextFunction } from "express";

/**
 * Verify reCAPTCHA token with Google's API
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  console.log('=== RECAPTCHA VERIFICATION START ===');
  console.log('Token received:', token ? token.substring(0, 20) + '...' : '[MISSING]');
  
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.log('RECAPTCHA_SECRET_KEY not configured');
    throw new Error("RECAPTCHA_SECRET_KEY is not configured");
  }

  console.log('Secret key configured:', process.env.RECAPTCHA_SECRET_KEY.substring(0, 10) + '...');

  try {
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify`;
    console.log('Making request to:', verifyURL);
    
    const requestBody = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    });
    
    console.log('Request body params:', {
      secret: process.env.RECAPTCHA_SECRET_KEY.substring(0, 10) + '...',
      response: token.substring(0, 20) + '...'
    });

    const response = await fetch(verifyURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    console.log('Google API response status:', response.status);
    const data = await response.json();
    console.log('Google API response data:', data);
    
    if (data.success === true) {
      console.log('reCAPTCHA verification: SUCCESS');
      return true;
    } else {
      console.log('reCAPTCHA verification: FAILED');
      console.log('Error codes:', data['error-codes']);
      return false;
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    console.log('=== RECAPTCHA VERIFICATION END (ERROR) ===');
    return false;
  }
}

/**
 * Middleware to verify reCAPTCHA token from request body
 */
export async function requireRecaptcha(req: Request, res: Response, next: NextFunction) {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ 
      message: "reCAPTCHA verification required" 
    });
  }

  // Handle development bypass token
  if (captchaToken === 'dev-bypass-token') {
    console.log('Development bypass token detected, allowing request');
    return next();
  }

  try {
    const isValid = await verifyRecaptcha(captchaToken);
    
    if (!isValid) {
      return res.status(403).json({ 
        message: "reCAPTCHA verification failed. Please try again." 
      });
    }

    // reCAPTCHA verified, continue to next middleware
    next();
  } catch (error) {
    console.error('reCAPTCHA middleware error:', error);
    return res.status(500).json({ 
      message: "reCAPTCHA verification service unavailable" 
    });
  }
}