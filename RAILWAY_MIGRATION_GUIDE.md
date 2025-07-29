# OnyxHooks & More™ Railway Migration Guide

## Overview
Complete migration guide for deploying the OnyxHooks & More™ platform from Replit to Railway for production-grade hosting.

## Pre-Migration Checklist

### ✅ Application Status
- **Codebase**: Production-ready React/Express/PostgreSQL application
- **Build System**: Vite frontend + esbuild backend bundling
- **Database Schema**: Complete with Drizzle ORM
- **Environment Variables**: All configured and documented
- **Domain**: onyxnpearls.com owned and ready for transfer

### ✅ Current Architecture
- **Frontend**: React 18 with TypeScript, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Auth
- **Payments**: Stripe integration
- **AI Services**: OpenAI GPT-4o
- **Email**: SendGrid integration

## Railway Migration Steps

### Step 1: Repository Preparation
1. Create new GitHub repository for Railway deployment
2. Push current codebase to GitHub
3. Verify all sensitive data is in environment variables (not hardcoded)

### Step 2: Railway Account Setup
1. Create Railway account at railway.app
2. Connect GitHub account for repository access
3. Choose appropriate pricing plan for SaaS application

### Step 3: Environment Variables Migration
Copy these environment variables from Replit to Railway:

#### Database
- `DATABASE_URL` (Railway will provide new PostgreSQL instance)

#### Authentication & Security
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

#### Payment Processing
- `STRIPE_SECRET_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_STARTER_PRICE_ID`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_VAULT_PRICE_ID`

#### AI & Email Services
- `OPENAI_API_KEY`
- `SENDGRID_API_KEY`

### Step 4: Database Migration
1. Railway will create new PostgreSQL instance
2. Run database schema deployment: `npm run db:push`
3. Verify all tables and relationships are created

### Step 5: Domain Configuration
1. Update DNS A record from Replit IP to Railway IP
2. Configure custom domain in Railway dashboard
3. Railway will handle SSL certificate automatically

### Step 6: Deployment Configuration
Railway will automatically detect:
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Node.js Version**: 20 (from package.json engines)

### Step 7: Testing & Validation
1. Verify application loads at Railway URL
2. Test authentication flows (Firebase + reCAPTCHA)
3. Validate Stripe payment processing
4. Confirm AI hook generation functionality
5. Test admin dashboard and analytics
6. Verify email notifications (SendGrid)

## Expected Railway Benefits

### Production Reliability
- ✅ Consistent deployment behavior
- ✅ Proper environment separation
- ✅ Reliable scaling infrastructure
- ✅ Better resource allocation for AI API calls

### Domain Management
- ✅ Stable custom domain handling
- ✅ Automatic SSL certificate management
- ✅ No deployment loops or caching issues

### Database Management
- ✅ Managed PostgreSQL with automatic backups
- ✅ Better connection pooling
- ✅ Production-grade database performance

### Cost Transparency
- ✅ Usage-based billing with clear metrics
- ✅ No surprise deployment token consumption
- ✅ Predictable scaling costs

## Migration Timeline
- **Preparation**: 30 minutes (repository setup, environment variables)
- **Deployment**: 15 minutes (Railway automatic deployment)
- **Domain Transfer**: 10-30 minutes (DNS propagation)
- **Testing**: 30 minutes (comprehensive functionality validation)

**Total Estimated Time**: 1.5 - 2 hours

## Post-Migration Actions
1. Update documentation with new deployment URLs
2. Monitor application performance and scaling
3. Set up Railway monitoring and alerts
4. Update any hardcoded references to Replit infrastructure

## Rollback Plan
- Keep Replit workspace as backup during transition
- Domain can be reverted to Replit if needed
- All code and environment variables preserved

---

**Next Steps**: Ready to proceed with Railway migration when you confirm.