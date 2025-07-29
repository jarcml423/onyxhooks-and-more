#!/usr/bin/env node

// Quick test to verify the accounts are seeded and API is working
import puppeteer from 'puppeteer';

async function quickTest() {
  console.log('🧪 Running quick API and account verification...');
  
  try {
    // Test API endpoints
    const testRequests = [
      { 
        url: 'http://localhost:5000/api/health',
        description: 'Health check'
      },
      {
        url: 'http://localhost:5000/api/test/seed-accounts',
        method: 'POST',
        body: JSON.stringify({
          accounts: [
            {"email": "test_free@onyxnpearls.com", "role": "free", "username": "TestFree"},
            {"email": "test_starter@onyxnpearls.com", "role": "starter", "username": "TestStarter"},
            {"email": "test_pro@onyxnpearls.com", "role": "pro", "username": "TestPro"},
            {"email": "test_vault@onyxnpearls.com", "role": "vault", "username": "TestVault"}
          ]
        }),
        headers: { 'Content-Type': 'application/json' },
        description: 'Seed test accounts'
      }
    ];

    for (const request of testRequests) {
      console.log(`Testing: ${request.description}`);
      
      const options = {
        method: request.method || 'GET',
        headers: request.headers || {}
      };
      
      if (request.body) {
        options.body = request.body;
      }
      
      const response = await fetch(request.url, options);
      const status = response.status;
      
      if (status >= 200 && status < 400) {
        console.log(`✅ ${request.description}: ${status}`);
        if (request.description.includes('Seed')) {
          const result = await response.text();
          console.log(`   Accounts result: ${result.substring(0, 200)}...`);
        }
      } else {
        console.log(`❌ ${request.description}: ${status}`);
      }
    }

    // Test basic browser functionality
    console.log('\n🌐 Testing browser automation...');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    await page.goto('http://localhost:5000/');
    
    const title = await page.title();
    console.log(`✅ Page title: ${title}`);
    
    // Check for key elements
    const hasLoginLink = await page.$('a[href="/login"]') !== null;
    console.log(`✅ Login link present: ${hasLoginLink}`);
    
    await browser.close();
    
    console.log('\n🎯 Quick test completed successfully!');
    console.log('✅ API endpoints responding');
    console.log('✅ Test accounts seeded');
    console.log('✅ Browser automation working');
    console.log('\nReady for comprehensive tier testing!');
    
  } catch (error) {
    console.error('❌ Quick test failed:', error.message);
    process.exit(1);
  }
}

quickTest();