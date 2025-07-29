import { TierTestHelper } from '../utils/tierTestHelper.js';
import { AuthHelper } from '../utils/authHelper.js';

export async function runProTierTest(browser) {
  console.log('⚡ Starting Pro Tier Smoke Test...');
  
  const helper = new TierTestHelper(browser, 'pro');
  const authHelper = new AuthHelper(browser);
  const results = {
    tier: 'pro',
    timestamp: new Date().toISOString(),
    tests: [],
    success: true,
    criticalIssues: []
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    // Test 1: Login with Pro tier account
    console.log('  🔍 Testing Pro tier authentication...');
    const authTest = await authHelper.testLogin(page, {
      email: 'test_pro@onyxnpearls.com',
      password: 'Test1234!',
      expectedTier: 'pro'
    });
    results.tests.push(authTest);

    if (!authTest.passed) {
      results.success = false;
      results.criticalIssues.push({
        title: 'Pro Authentication Failure',
        description: 'Cannot authenticate pro tier user',
        severity: 'critical'
      });
      return results;
    }

    // Test 2: Access pro dashboard
    console.log('  🔍 Testing Pro dashboard access...');
    const dashboardTest = await helper.testDashboardAccess(page, 'pro');
    results.tests.push(dashboardTest);

    // Test 3: Unlimited hook generation
    console.log('  🔍 Testing unlimited hook generation...');
    const hookGenTest = await helper.testHookGeneration(page, {
      niche: 'real estate coaching',
      transformation: 'close 10 deals per month',
      expectedLimit: 'unlimited'
    });
    results.tests.push(hookGenTest);

    // Test 4: AI Council access
    console.log('  🔍 Testing AI Council functionality...');
    const councilTest = await helper.testCouncilAccess(page);
    results.tests.push(councilTest);

    // Test 5: Advanced analytics
    console.log('  🔍 Testing Pro analytics access...');
    const analyticsTest = await helper.testAnalyticsAccess(page, 'pro');
    results.tests.push(analyticsTest);

    // Test 6: Campaign builder
    console.log('  🔍 Testing campaign builder access...');
    const campaignTest = await helper.testCampaignBuilder(page);
    results.tests.push(campaignTest);

    // Test 7: Verify Vault features are restricted
    console.log('  🔍 Testing Vault feature restrictions...');
    const vaultRestrictTest = await helper.testTierRestrictions(page, ['vault']);
    results.tests.push(vaultRestrictTest);

    // Test 8: Usage analytics
    console.log('  🔍 Testing usage analytics...');
    const usageTest = await helper.testUsageAnalytics(page);
    results.tests.push(usageTest);

    // Check for critical issues
    const failedTests = results.tests.filter(test => !test.passed);
    if (failedTests.length > 0) {
      results.success = false;
      
      failedTests.forEach(test => {
        if (test.severity === 'critical') {
          results.criticalIssues.push({
            title: `Pro Tier: ${test.name}`,
            description: test.error || 'Test failed without specific error',
            severity: 'critical'
          });
        }
      });
    }

    // Take screenshot
    await page.screenshot({ 
      path: './results/pro-tier-smoke-test.png',
      fullPage: true 
    });

    await page.close();
    
    const passedTests = results.tests.filter(test => test.passed).length;
    const successRate = ((passedTests / results.tests.length) * 100).toFixed(1);
    
    console.log(`  ✅ Pro Tier Test Complete: ${passedTests}/${results.tests.length} passed (${successRate}%)`);
    
    return results;

  } catch (error) {
    console.error('  ❌ Pro tier test failed:', error.message);
    results.success = false;
    results.criticalIssues.push({
      title: 'Pro Tier Test Failure',
      description: error.message,
      severity: 'critical'
    });
    return results;
  }
}