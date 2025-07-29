# Email Setup Instructions

## Required Environment Variables

To enable welcome email automation, add these environment variables to your Replit project:

```bash
ZOHO_EMAIL_USER=your-email@onyxnpearls.com
ZOHO_EMAIL_PASS=your-app-password
ALERT_EMAIL=admin@onyxnpearls.com
```

## How to Get Zoho Mail App Password

1. **Login to Zoho Mail** at https://mail.zoho.com
2. **Go to Settings** > Security > App Passwords
3. **Generate a new app password** for "OnyxHooks Platform"
4. **Copy the generated password** (not your regular login password)
5. **Add it as ZOHO_EMAIL_PASS** in Replit Secrets

## Testing Email Delivery

Once credentials are added, test the system:

```bash
# Test welcome email
curl -X POST /api/test/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{"tier": "starter", "email": "your-test-email@gmail.com", "customerName": "Test User"}'

# Test email connection
curl -X POST /api/test/email-connection
```

## Email Templates Available

The system includes tier-specific welcome emails:
- **Starter Tier**: Unlimited hook generation features
- **Pro Tier**: Advanced Council analysis tools  
- **Vault Tier**: Elite strategy development access

All emails include:
- OnyxHooks branding and styling
- Direct dashboard access links
- Tier-specific feature highlights
- Mobile-responsive design
- Support contact information

## Current Status

✅ **Stripe Integration**: Fully operational  
✅ **Webhook Processing**: Real-time subscription updates working  
✅ **Email Templates**: All tier-specific templates ready  
⏳ **Email Delivery**: Waiting for SMTP credentials  

Once SMTP is configured, the complete subscription flow will work:
Payment → Webhook → User Role Update → Welcome Email → Dashboard Access