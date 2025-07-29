import { TierTestHelper } from '../utils/tierTestHelper.js';
import { AuthHelper } from '../utils/authHelper.js';

export async function runStarterTierTest(browser) {
  console.log('⭐ Starting Starter Tier Smoke Test...');
  
  const helper = new TierTestHelper(browser, 'starter');
  const authHelper = new AuthHelper(browser);
  const results = {
    tier: 'starter',
    timestamp: new Date().toISOString(),
    tests: [],
    success: true,
    criticalIssues: []
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    // Test 1: Login with Starter tier account
    console.log('  🔍 Testing Starter tier authentication...');
    const authTest = await authHelper.testLogin(page, {
      email: 'test_starter@onyxnpearls.com',
      password: 'Test1234!',
      expectedTier: 'starter'
    });
    results.tests.push(authTest);

    if (!authTest.passed) {
      results.success = false;
      results.criticalIssues.push({
        title: 'Starter Authentication Failure',
        description: 'Cannot authenticate starter tier user',
        severity: 'critical'
      });
      return results;
    }

    // Test 2: Access starter dashboard
    console.log('  🔍 Testing Starter dashboard access...');
    const dashboardTest = await helper.testDashboardAccess(page, 'starter');
    results.tests.push(dashboardTest);

    // Test 3: Hook generation with starter limits
    console.log('  🔍 Testing Starter hook generation limits...');
    const hookGenTest = await helper.testHookGeneration(page, {
      niche: 'business coaching',
      transformation: 'double revenue in 6 months',
      expectedLimit: 25
    });
    results.tests.push(hookGenTest);

    // Test 4: CSV export functionality
    console.log('  🔍 Testing CSV export access...');
    const csvTest = await helper.testCSVExport(page);
    results.tests.push(csvTest);

    // Test 5: Verify Pro features are restricted
    console.log('  🔍 Testing Pro feature restrictions...');
    const proRestrictTest = await helper.testTierRestrictions(page, ['pro', 'vault']);
    results.tests.push(proRestrictTest);

    // Test 6: Subscription management
    console.log('  🔍 Testing subscription management...');
    const subTest = await helper.testSubscriptionManagement(page, 'starter');
    results.tests.push(subTest);

    // Check for critical issues
    const failedTests = results.tests.filter(test => !test.passed);
    if (failedTests.length > 0) {
      results.success = false;
      
      failedTests.forEach(test => {
        if (test.severity === 'critical') {
          results.criticalIssues.push({
            title: `Starter Tier: ${test.name}`,
            description: test.error || 'Test failed without specific error',
            severity: 'critical'
          });
        }
      });
    }

    // Take screenshot
    await page.screenshot({ 
      path: './results/starter-tier-smoke-test.png',
      fullPage: true 
    });

    await page.close();
    
    const passedTests = results.tests.filter(test => test.passed).length;
    const successRate = ((passedTests / results.tests.length) * 100).toFixed(1);
    
    console.log(`  ✅ Starter Tier Test Complete: ${passedTests}/${results.tests.length} passed (${successRate}%)`);
    
    return results;

  } catch (error) {
    console.error('  ❌ Starter tier test failed:', error.message);
    results.success = false;
    results.criticalIssues.push({
      title: 'Starter Tier Test Failure',
      description: error.message,
      severity: 'critical'
    });
    return results;
  }
}