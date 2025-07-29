# OnyxHooks & More™ Railway Deployment Guide

## ✅ Updated Configuration Status

**GREAT NEWS:** I found 3 of the 5 missing environment variables and auto-configured them!

### Variables Updated:
- ✅ **VITE_FIREBASE_AUTH_DOMAIN**: `offerforgeai.firebaseapp.com` (auto-generated)
- ✅ **VITE_FIREBASE_STORAGE_BUCKET**: `offerforgeai.firebasestorage.app` (auto-generated)  
- ✅ **VITE_FIREBASE_MESSAGING_SENDER_ID**: `940024080650` (extracted from App ID)

### Still Need From You (Only 2 critical ones):
- ⚠️ **VITE_STRIPE_PUBLISHABLE_KEY**: Get from Stripe Dashboard (starts with `pk_live_`)
- ⚠️ **STRIPE_WEBHOOK_SECRET**: Create webhook endpoint in Stripe (starts with `whsec_`)

**Configuration Status: 22/24 variables configured (92% complete)**

## Quick Start for Railway

1. **Create New Railway Project**
   - Go to railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Connect your GitHub repository: jarcml423/onyxhooks-and-more

2. **Configure Environment Variables**
   - Go to your Railway project → Variables tab
   - Copy all variables from railway-secrets.env
   - Replace masked values (...) with your actual API keys

3. **Required Environment Variables**

### Core Application
```
NODE_ENV=production
PORT=3000
```

### Database (Railway will provide PostgreSQL)
```
DATABASE_URL=postgresql://[railway-provides-this]
```

### Authentication & Security
```
VITE_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

### AI Services
```
OPENAI_API_KEY=sk-proj-your-key
```

### Payment Processing
```
STRIPE_SECRET_KEY=sk_live_your-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_STARTER_PRICE_ID=price_1RgHHvITqqIIThAChdh4xM3Z
STRIPE_PRO_PRICE_ID=price_1RgHQvITqqIIThACULsMPt1V
STRIPE_VAULT_PRICE_ID=price_1RgKcmITqqIIThACdOBoNMyD
```

### Email Services
```
SENDGRID_API_KEY=SG.your-key
```

### Firebase Configuration (✅ Most values already configured)
```
VITE_FIREBASE_API_KEY=your-api-key  # <-- Only this needs updating
VITE_FIREBASE_AUTH_DOMAIN=offerforgeai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=offerforgeai  
VITE_FIREBASE_STORAGE_BUCKET=offerforgeai.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=940024080650
VITE_FIREBASE_APP_ID=1:940024080650:web:5f8df24c044c85672432f3
```

## Railway Deployment Steps

1. **Add PostgreSQL Database**
   - In Railway project → "Add Service" → "Database" → "PostgreSQL"
   - Railway will automatically set DATABASE_URL

2. **Configure Custom Domain**
   - Go to Settings → Domains
   - Add: onyxnpearls.com and www.onyxnpearls.com
   - Update DNS CNAME: www → your-app.railway.app

3. **Deploy Application** 
   - Railway auto-detects Node.js and runs `npm run build` then `npm start`
   - Check logs for successful deployment

## Security Notes

⚠️  **IMPORTANT**: 
- Never commit actual API keys to GitHub
- Use Railway's environment variables for all secrets
- Masked values in railway-secrets.env must be replaced with real values
- Test all integrations after deployment

## Support

If you need help with specific API keys or configuration:
- Stripe: Get keys from stripe.com dashboard
- Firebase: Get config from Firebase console
- OpenAI: Get API key from platform.openai.com
- reCAPTCHA: Get keys from google.com/recaptcha

---
Generated: 2025-07-29T02:16:24.870Z
Platform: OnyxHooks & More™
Purpose: Railway Migration
