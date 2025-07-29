import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || process.env.MAILGUN_API_KEY || "default_key");

export interface QuizResultEmail {
  email: string;
  score: number;
  feedback: string;
  recommendations: string[];
  tier: string;
  improvement?: string;
}

export interface WelcomeEmail {
  email: string;
  username: string;
}

export interface UpgradeConfirmationEmail {
  email: string;
  username: string;
  plan: string;
  amount: string;
}

export async function sendQuizResultEmail(data: QuizResultEmail): Promise<void> {
  try {
    await resend.emails.send({
      from: 'OnyxHooks & More™ <noreply@onyxnpearls.com>',
      to: data.email,
      subject: `Your Offer Strength Score: ${data.score}/100 (${data.tier})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">OnyxHooks & More™</h1>
            <p style="color: #E0E7FF; margin: 10px 0 0 0;">Your Offer Analysis Results</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; background: #F3F4F6; border-radius: 50%; width: 100px; height: 100px; line-height: 100px; font-size: 32px; font-weight: bold; color: #6366F1;">
                ${data.score}
              </div>
              <h2 style="color: #1F2937; margin: 15px 0 5px 0;">Offer Strength: ${data.tier}</h2>
              <p style="color: #6B7280; margin: 0;">Out of 100 points</p>
            </div>
            
            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1F2937; margin: 0 0 15px 0;">Personalized Feedback</h3>
              <p style="color: #4B5563; line-height: 1.6; margin: 0;">${data.feedback}</p>
            </div>
            
            <h3 style="color: #1F2937; margin: 0 0 15px 0;">Key Recommendations</h3>
            <ul style="color: #4B5563; line-height: 1.6; padding-left: 20px;">
              ${data.recommendations.map(rec => `<li style="margin-bottom: 8px;">${rec}</li>`).join('')}
            </ul>
            
            ${data.improvement ? `
              <div style="background: #EFF6FF; border-left: 4px solid #6366F1; padding: 20px; margin: 25px 0;">
                <h3 style="color: #1E40AF; margin: 0 0 15px 0;">AI-Powered Improvement Suggestions</h3>
                <p style="color: #1E3A8A; line-height: 1.6; margin: 0;">${data.improvement}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'https://offerforge.ai'}/offer-generator" 
                 style="background: #6366F1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Try OnyxHooks & More™ Free
              </a>
            </div>
          </div>
          
          <div style="background: #F3F4F6; padding: 20px; text-align: center; color: #6B7280; font-size: 14px;">
            <p>Thanks for using OnyxHooks & More™! Ready to optimize your offers?</p>
            <p style="margin: 5px 0 0 0;">© 2024 OnyxHooks & More™. All rights reserved.</p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send quiz result email:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendWelcomeEmail(data: WelcomeEmail): Promise<void> {
  try {
    await resend.emails.send({
      from: 'OnyxHooks & More™ <welcome@onyxnpearls.com>',
      to: data.email,
      subject: 'Welcome to OfferForge AI - Let\'s Optimize Your Offers!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to OfferForge AI!</h1>
            <p style="color: #E0E7FF; margin: 10px 0 0 0;">Transform your offers with AI-powered optimization</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #1F2937; margin: 0 0 20px 0;">Hi ${data.username},</h2>
            <p style="color: #4B5563; line-height: 1.6;">Welcome to OfferForge AI! You're now part of a community of 2,000+ creators who are optimizing their offers and scaling their businesses.</p>
            
            <h3 style="color: #1F2937; margin: 25px 0 15px 0;">Here's what you can do right now:</h3>
            <ul style="color: #4B5563; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Generate 2 free optimized offers with our AI</li>
              <li style="margin-bottom: 8px;">Take the comprehensive Offer Strength Quiz</li>
              <li style="margin-bottom: 8px;">Access our free offer templates and frameworks</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://offerforge.ai'}/offer-generator" 
                 style="background: #6366F1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin: 0 10px 10px 0;">
                Generate Your First Offer
              </a>
              <a href="${process.env.FRONTEND_URL || 'https://offerforge.ai'}/quiz" 
                 style="border: 2px solid #6366F1; color: #6366F1; padding: 13px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Take the Quiz
              </a>
            </div>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendUpgradeConfirmationEmail(data: UpgradeConfirmationEmail): Promise<void> {
  try {
    await resend.emails.send({
      from: 'OfferForge AI <billing@offerforge.ai>',
      to: data.email,
      subject: `Welcome to OfferForge AI ${data.plan} - Your Account is Active!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Upgrade Successful!</h1>
            <p style="color: #D1FAE5; margin: 10px 0 0 0;">Welcome to OfferForge AI ${data.plan}</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #1F2937; margin: 0 0 20px 0;">Hi ${data.username},</h2>
            <p style="color: #4B5563; line-height: 1.6;">Your upgrade to OfferForge AI ${data.plan} is now active! You now have access to premium features that will supercharge your offer optimization.</p>
            
            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #166534; margin: 0 0 10px 0;">Billing Summary</h3>
              <p style="color: #15803D; margin: 0;"><strong>Plan:</strong> ${data.plan}</p>
              <p style="color: #15803D; margin: 5px 0 0 0;"><strong>Amount:</strong> ${data.amount}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://offerforge.ai'}/dashboard" 
                 style="background: #6366F1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Access Your Dashboard
              </a>
            </div>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('Failed to send upgrade confirmation email:', error);
  }
}
