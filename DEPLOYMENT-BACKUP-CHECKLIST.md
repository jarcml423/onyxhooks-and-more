# OnyxHooks & More™ Deployment Backup Checklist
Generated: July 14, 2025

## ✅ BACKUP COMPLETION STATUS

### 1. Complete Codebase Backup
- [x] Full project archive created: `OnyxHooks-Complete-Backup-[timestamp].tar.gz`
- [x] Excludes: node_modules, .git, dist, results (non-essential folders)
- [x] Includes: All source code, configurations, documentation

### 2. Environment Variables Backup
- [x] App secrets backup folder created: `app-secrets-backup/`
- [x] Masked .env file: `app-secrets-backup/app-secrets.env`
- [x] Configuration summary: `app-secrets-backup/config-summary.json`
- [x] Setup instructions: `app-secrets-backup/setup-instructions.md`

### 3. Critical Environment Variables (Manual Verification Required)
Please verify these are documented in your local backup:

**Authentication & Security:**
- VITE_RECAPTCHA_SITE_KEY
- RECAPTCHA_SECRET_KEY

**Database:**
- DATABASE_URL

**AI Services:**
- OPENAI_API_KEY

**Payment Processing:**
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_STARTER_PRICE_ID
- STRIPE_PRO_PRICE_ID
- STRIPE_VAULT_PRICE_ID

**Email Services:**
- SENDGRID_API_KEY
- ZOHO_EMAIL_USER
- ZOHO_EMAIL_PASS
- ALERT_EMAIL

**Firebase Configuration:**
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

## 🔄 DEPLOYMENT RESET PROCEDURE

### Phase 1: Pre-Deletion Verification
1. Confirm all backups downloaded locally
2. Verify environment variables are documented
3. Note current deployment URL: `onyxhooks-onyxhooks.replit.app`
4. Confirm DNS CNAME: `www.onyxnpearls.com → onyxhooks-onyxhooks.replit.app`

### Phase 2: Safe Deletion Process
1. Go to Replit Deployments → Overview
2. Click ⋮ (More Options) → Delete Deployment
3. Confirm deletion

### Phase 3: Fresh Deployment
1. Click Deploy button immediately after deletion
2. Replit will create new deployment with same URL structure
3. Domain should match existing CNAME record

### Phase 4: Domain Re-verification
1. Go to Deployments → Domains
2. Re-add `www.onyxnpearls.com`
3. Wait for verification and SSL certificate issuance

## 🚨 ROLLBACK PLAN (If Needed)
If deployment fails:
1. Extract backup: `tar -xzf OnyxHooks-Complete-Backup-[timestamp].tar.gz`
2. Restore environment variables from backup
3. Restart development server: `npm run dev`
4. Contact support if domain issues persist

## 📋 POST-DEPLOYMENT VERIFICATION
- [ ] Application loads at development URL
- [ ] Domain verification completes
- [ ] SSL certificate issued
- [ ] All authentication flows working
- [ ] Database connections active
- [ ] Email services operational
- [ ] Payment processing functional

## 🔐 SECURITY NOTES
- Keep backup files secure and private
- Do not share environment variable values
- Verify all secrets are properly configured post-deployment
- Test critical functions before going live

---
**Status**: Ready for deployment reset
**Contact**: support@onyxnpearls.com
**Platform**: OnyxHooks & More™