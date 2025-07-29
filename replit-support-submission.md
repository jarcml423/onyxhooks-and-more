# IMMEDIATE REPLIT SUPPORT SUBMISSION

## Support Form Details
**URL**: https://replit.com/support
**Priority**: Critical Deployment Issue
**Category**: Account/Billing/Technical Support

## Ticket Information to Submit:

**Subject**: Custom Domain 404 Error - Production Deployment Blocked (3+ Days)

**Description**:
Project: onyx-hooks-onyxhooks
Custom Domain: www.onyxnpearls.com
Issue: Domain verified with SSL working but returns 404 "Not Found"

TECHNICAL DETAILS:
- DNS CNAME: www.onyxnpearls.com → onyx-hooks-onyxhooks.replit.app ✅
- SSL Certificate: Issued and working (HTTP/2 responses) ✅ 
- Domain Verification: Completed in deployment settings ✅
- Application: Working locally on port 5000 ✅
- Issue: Load balancer routing failure ❌

This appears to be infrastructure-level routing where custom domain terminates SSL correctly but doesn't route to the running application. Production deployment has been blocked for 3+ days.

**Request**: Immediate investigation of deployment routing configuration for www.onyxnpearls.com

**Account**: Premium/Core tier requiring urgent resolution