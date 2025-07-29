#!/bin/bash

echo "🔐 Stripe Secret Key Validator"
echo "=============================="
echo ""

if [ -z "$1" ]; then
    echo "Usage: ./validate-stripe-key.sh YOUR_STRIPE_KEY"
    echo ""
    echo "This script validates your Stripe secret key format and tests connectivity."
    exit 1
fi

KEY="$1"

# Validate format
if [[ ! "$KEY" =~ ^sk_(live|test)_ ]]; then
    echo "❌ Invalid format: Key must start with 'sk_live_' or 'sk_test_'"
    exit 1
fi

if [ ${#KEY} -lt 50 ]; then
    echo "❌ Invalid length: Key must be at least 50 characters"
    exit 1
fi

echo "✅ Format validation passed"
echo ""

# Test the key with curl
echo "🔍 Testing key with Stripe API..."
RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/stripe_test.json \
  -u "$KEY:" \
  -H "Content-Type: application/json" \
  https://api.stripe.com/v1/accounts)

HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Stripe API test successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to Replit → Tools → Secrets"
    echo "2. Find 'STRIPE_SECRET_KEY'"
    echo "3. Update the value with: $KEY"
    echo "4. Click 'Save'"
    echo ""
    echo "Your production Stripe integration is ready!"
else
    echo "❌ Stripe API test failed (HTTP $HTTP_CODE)"
    if [ -f /tmp/stripe_test.json ]; then
        echo "Error details:"
        cat /tmp/stripe_test.json
    fi
fi

rm -f /tmp/stripe_test.json
