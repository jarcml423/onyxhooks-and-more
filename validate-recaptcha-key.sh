#!/bin/bash

echo "🔐 reCAPTCHA Secret Key Validator"
echo "================================="
echo ""

if [ -z "$1" ]; then
    echo "Usage: ./validate-recaptcha-key.sh 6L...your_secret_key_here"
    echo ""
    echo "This script validates your reCAPTCHA secret key and tests connectivity."
    exit 1
fi

SECRET_KEY="$1"

# Validate format - reCAPTCHA secret keys typically start with 6L
if [[ ! "$SECRET_KEY" =~ ^6L ]]; then
    echo "❌ Invalid format: reCAPTCHA secret key should start with '6L'"
    exit 1
fi

if [ ${#SECRET_KEY} -lt 30 ]; then
    echo "❌ Invalid length: reCAPTCHA secret key should be at least 30 characters"
    exit 1
fi

echo "✅ Format validation passed"
echo ""

# Test the key with Google's reCAPTCHA API
echo "🔍 Testing key with Google reCAPTCHA API..."
RESPONSE=$(curl -s -X POST \
  -d "secret=$SECRET_KEY&response=test" \
  https://www.google.com/recaptcha/api/siteverify)

echo "API Response: $RESPONSE"

# Check if the response contains success field
if echo "$RESPONSE" | grep -q '"success"'; then
    echo "✅ reCAPTCHA API connectivity test successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to Replit → Tools → Secrets"
    echo "2. Find 'RECAPTCHA_SECRET_KEY'"
    echo "3. Update the value with: $SECRET_KEY"
    echo "4. Click 'Save'"
    echo ""
    echo "Your reCAPTCHA integration is ready!"
else
    echo "❌ reCAPTCHA API test failed"
    echo "Response details: $RESPONSE"
fi
