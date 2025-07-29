# REPLIT SUPPORT TICKET - SUBMIT IMMEDIATELY

## Step 1: Go to https://support-form.replit.app/
## Step 2: Select "I found a bug"
## Step 3: Submit this exact information:

**Bug Title**: Custom Domain 404 Error - Load Balancer Routing Failure

**Bug Description**:
```
PROJECT: onyx-hooks-onyxhooks
AFFECTED DOMAIN: www.onyxnpearls.com
BUG TYPE: Deployment routing failure

SYMPTOMS:
- Custom domain returns 404 "Not Found" 
- SSL certificate working (HTTP/2 responses)
- Domain verification completed successfully
- Application works perfectly on localhost:5000
- DNS CNAME correctly configured: www.onyxnpearls.com → onyx-hooks-onyxhooks.replit.app

ROOT CAUSE: Load balancer routing failure between verified custom domain and running application

REPRODUCTION:
1. Visit https://www.onyxnpearls.com/ 
2. Observe: 404 "Not Found" response
3. Compare: curl localhost:5000 returns full application

EXPECTED: Custom domain should serve the same content as localhost

URGENCY: Production deployment blocked for 3+ days
```

**Additional Context**: This is a confirmed infrastructure issue where domain verification and SSL work correctly, but the load balancer fails to route traffic to the running application.