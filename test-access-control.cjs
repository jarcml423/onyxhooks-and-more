#!/usr/bin/env node

/**
 * OfferForge Access Control Testing Suite
 * Tests that paid tier features are properly gated based on subscription status
 */

const API_BASE = process.env.API_BASE || 'http://localhost:5000';

// Test user scenarios
const testScenarios = [
  {
    name: 'Free User',
    userType: 'free',
    subscriptionStatus: 'inactive',
    accessGranted: false,
    expectedAccess: {
      starterHooks: false,
      proTools: false,
      vaultFeatures: false,
      swipeCopy: false,
      eliteCoaching: false
    }
  },
  {
    name: 'Starter - Active',
    userType: 'starter',
    subscriptionStatus: 'active',
    accessGranted: true,
    expectedAccess: {
      starterHooks: true,
      proTools: false,
      vaultFeatures: false,
      swipeCopy: false,
      eliteCoaching: false
    }
  },
  {
    name: 'Starter - Canceled',
    userType: 'starter',
    subscriptionStatus: 'canceled',
    accessGranted: false,
    expectedAccess: {
      starterHooks: false,
      proTools: false,
      vaultFeatures: false,
      swipeCopy: false,
      eliteCoaching: false
    }
  },
  {
    name: 'Pro - Active',
    userType: 'pro',
    subscriptionStatus: 'active',
    accessGranted: true,
    expectedAccess: {
      starterHooks: true,
      proTools: true,
      vaultFeatures: false,
      swipeCopy: false,
      eliteCoaching: false
    }
  },
  {
    name: 'Pro - Past Due',
    userType: 'pro',
    subscriptionStatus: 'past_due',
    accessGranted: false,
    expectedAccess: {
      starterHooks: false,
      proTools: false,
      vaultFeatures: false,
      swipeCopy: false,
      eliteCoaching: false
    }
  },
  {
    name: 'Vault - Active',
    userType: 'vault',
    subscriptionStatus: 'active',
    accessGranted: true,
    expectedAccess: {
      starterHooks: true,
      proTools: true,
      vaultFeatures: true,
      swipeCopy: true,
      eliteCoaching: true
    }
  },
  {
    name: 'Vault - Canceled',
    userType: 'vault',
    subscriptionStatus: 'canceled',
    accessGranted: false,
    expectedAccess: {
      starterHooks: false,
      proTools: false,
      vaultFeatures: false,
      swipeCopy: false,
      eliteCoaching: false
    }
  }
];

// API endpoints to test
const protectedEndpoints = [
  {
    name: 'Starter Hook Generation',
    endpoint: '/api/generate-hooks',
    method: 'POST',
    requiredTier: 'starter',
    body: { content: 'test hook', contentType: 'hook' }
  },
  {
    name: 'Pro Tools - Pricing Justification',
    endpoint: '/api/pro-tools/pricing-justification',
    method: 'POST',
    requiredTier: 'pro',
    body: { offer: 'test offer', price: 197 }
  },
  {
    name: 'Pro Tools - Build Upsells',
    endpoint: '/api/pro-tools/build-upsells',
    method: 'POST',
    requiredTier: 'pro',
    body: { mainOffer: 'test offer' }
  },
  {
    name: 'Vault Tools - Council Analysis',
    endpoint: '/api/council/analyze',
    method: 'POST',
    requiredTier: 'vault',
    body: { content: 'test content', contentType: 'hook' }
  },
  {
    name: 'Swipe Copy Bank',
    endpoint: '/api/swipe-copy',
    method: 'GET',
    requiredTier: 'vault'
  },
  {
    name: 'Elite Coaching',
    endpoint: '/api/elite/generate-content',
    method: 'POST',
    requiredTier: 'vault',
    body: { industry: 'fitness', content: 'test content' }
  }
];

class AccessControlTester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  async makeRequest(endpoint, method = 'GET', body = null, userContext = {}) {
    const url = `${API_BASE}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Simulate user context
        'x-test-user-role': userContext.userType || 'free',
        'x-test-subscription-status': userContext.subscriptionStatus || 'inactive',
        'x-test-access-granted': userContext.accessGranted || false
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      return {
        status: response.status,
        ok: response.ok,
        data: response.ok ? await response.json() : null,
        error: !response.ok ? await response.text() : null
      };
    } catch (error) {
      return {
        status: 0,
        ok: false,
        error: error.message
      };
    }
  }

  shouldHaveAccess(userType, subscriptionStatus, accessGranted, requiredTier) {
    // User must have active subscription and access granted
    if (!accessGranted || subscriptionStatus !== 'active') {
      return false;
    }

    // Check tier hierarchy: free < starter < pro < vault
    const tierLevels = { free: 0, starter: 1, pro: 2, vault: 3 };
    const userLevel = tierLevels[userType] || 0;
    const requiredLevel = tierLevels[requiredTier] || 0;

    return userLevel >= requiredLevel;
  }

  async testEndpointAccess(scenario, endpoint) {
    const { userType, subscriptionStatus, accessGranted } = scenario;
    const { name, endpoint: url, method, requiredTier, body } = endpoint;

    const shouldAccess = this.shouldHaveAccess(userType, subscriptionStatus, accessGranted, requiredTier);
    
    const result = await this.makeRequest(url, method, body, scenario);
    
    const testPassed = shouldAccess ? result.ok : (result.status === 401 || result.status === 403);

    const testResult = {
      scenario: scenario.name,
      endpoint: name,
      requiredTier,
      userType,
      subscriptionStatus,
      accessGranted,
      shouldAccess,
      actualStatus: result.status,
      passed: testPassed,
      error: result.error
    };

    this.results.push(testResult);
    
    if (testPassed) {
      this.passed++;
      console.log(`✅ ${scenario.name} -> ${name}: ${shouldAccess ? 'ACCESS GRANTED' : 'ACCESS DENIED'} (${result.status})`);
    } else {
      this.failed++;
      console.log(`❌ ${scenario.name} -> ${name}: Expected ${shouldAccess ? 'access' : 'denial'}, got ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }

    return testResult;
  }

  async runAllTests() {
    console.log('🔒 Starting OfferForge Access Control Tests\n');
    
    for (const scenario of testScenarios) {
      console.log(`\n📋 Testing: ${scenario.name}`);
      console.log(`   Role: ${scenario.userType}, Status: ${scenario.subscriptionStatus}, Access: ${scenario.accessGranted}`);
      
      for (const endpoint of protectedEndpoints) {
        await this.testEndpointAccess(scenario, endpoint);
      }
    }

    this.printSummary();
    return this.results;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ACCESS CONTROL TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${this.passed + this.failed}`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);

    if (this.failed > 0) {
      console.log('\n🚨 FAILED TESTS:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`   ${r.scenario} -> ${r.endpoint}: Expected ${r.shouldAccess ? 'access' : 'denial'}, got ${r.actualStatus}`);
        });
    }

    console.log('\n💡 RECOMMENDATIONS:');
    if (this.failed === 0) {
      console.log('   ✅ All access controls are working correctly!');
    } else {
      console.log('   🔧 Review failed tests and update access control logic');
      console.log('   🔧 Ensure TierLock components are properly implemented');
      console.log('   🔧 Verify subscription status checking in API endpoints');
    }
  }

  generateTestReport() {
    const timestamp = new Date().toISOString();
    const report = {
      timestamp,
      summary: {
        total: this.passed + this.failed,
        passed: this.passed,
        failed: this.failed,
        successRate: ((this.passed / (this.passed + this.failed)) * 100).toFixed(1) + '%'
      },
      scenarios: testScenarios.length,
      endpoints: protectedEndpoints.length,
      results: this.results
    };

    return JSON.stringify(report, null, 2);
  }
}

// CLI execution
if (require.main === module) {
  const tester = new AccessControlTester();
  
  tester.runAllTests()
    .then(results => {
      // Save report to file
      const fs = require('fs');
      const report = tester.generateTestReport();
      fs.writeFileSync('access-control-test-report.json', report);
      console.log('\n📄 Test report saved to: access-control-test-report.json');
      
      // Exit with appropriate code
      process.exit(tester.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = AccessControlTester;