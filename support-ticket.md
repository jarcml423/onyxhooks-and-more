# Replit Support Ticket - Custom Domain 404 Error

## Issue Summary
- **Domain**: www.onyxnpearls.com
- **Deployment Type**: Autoscale
- **Issue**: Custom domain shows 404 "Not Found" despite proper DNS configuration
- **Duration**: 3+ days of troubleshooting

## Technical Details
- ✅ DNS CNAME properly configured: www.onyxnpearls.com → onyx-hooks-onyxhooks.replit.app
- ✅ Global DNS propagation verified across 15+ international locations
- ✅ SSL certificates issued and working (HTTP/2 responses)
- ✅ Domain verification completed in Replit deployment settings
- ✅ Production build generated successfully
- ✅ Application serves correctly on localhost:5000
- ❌ Custom domain returns 404 "Not Found"

## Error Pattern
- Local server: HTTP 200 with full application content
- Custom domain: HTTP/2 404 with "Not Found" text
- Direct .replit.app domain: Works correctly

## Configuration
- Build command: `npm run build`
- Start command: `npm run start`
- Port: 5000 (configured in .replit)
- Environment: Production ready

## Request
This appears to be a load balancer routing issue where the custom domain SSL terminates correctly but doesn't route to the running application. Please investigate the deployment routing configuration for this custom domain.

**Priority**: High (production deployment blocked for 3+ days)
**Account**: Premium/Core tier requiring immediate resolution