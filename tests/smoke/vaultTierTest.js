import { TierTestHelper } from '../utils/tierTestHelper.js';
import { AuthHelper } from '../utils/authHelper.js';

export async function runVaultTierTest(browser) {
  console.log('👑 Starting Vault Tier Smoke Test...');
  
  const helper = new TierTestHelper(browser, 'vault');
  const authHelper = new AuthHelper(browser);
  const results = {
    tier: 'vault',
    timestamp: new Date().toISOString(),
    tests: [],
    success: true,
    criticalIssues: []
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    // Test 1: Login with Vault tier account
    console.log('  🔍 Testing Vault tier authentication...');
    const authTest = await authHelper.testLogin(page, {
      email: 'test_vault@onyxnpearls.com',
      password: 'Test1234!',
      expectedTier: 'vault'
    });
    results.tests.push(authTest);

    if (!authTest.passed) {
      results.success = false;
      results.criticalIssues.push({
        title: 'Vault Authentication Failure',
        description: 'Cannot authenticate vault tier user',
        severity: 'critical'
      });
      return results;
    }

    // Test 2: Access vault dashboard
    console.log('  🔍 Testing Vault dashboard access...');
    const dashboardTest = await helper.testDashboardAccess(page, 'vault');
    results.tests.push(dashboardTest);

    // Test 3: Vault Supreme hook generation
    console.log('  🔍 Testing Vault Supreme hook generation...');
    const hookGenTest = await helper.testVaultHookGeneration(page, {
      niche: 'high-ticket consulting',
      transformation: 'build 7-figure business',
      expectedFeatures: ['gladiator names', 'neuro triggers', 'psychology frameworks']
    });
    results.tests.push(hookGenTest);

    // Test 4: Monthly swipe copy access
    console.log('  🔍 Testing monthly swipe copy access...');
    const swipeTest = await helper.testSwipeCopyAccess(page);
    results.tests.push(swipeTest);

    // Test 5: Admin dashboard access
    console.log('  🔍 Testing admin dashboard access...');
    const adminTest = await helper.testAdminAccess(page);
    results.tests.push(adminTest);

    // Test 6: Vault analytics and insights
    console.log('  🔍 Testing Vault analytics...');
    const analyticsTest = await helper.testVaultAnalytics(page);
    results.tests.push(analyticsTest);

    // Test 7: Campaign intelligence
    console.log('  🔍 Testing campaign intelligence...');
    const campaignIntelTest = await helper.testCampaignIntelligence(page);
    results.tests.push(campaignIntelTest);

    // Test 8: Security dashboard
    console.log('  🔍 Testing security dashboard...');
    const securityTest = await helper.testSecurityDashboard(page);
    results.tests.push(securityTest);

    // Test 9: UTM analytics
    console.log('  🔍 Testing UTM analytics...');
    const utmTest = await helper.testUTMAnalytics(page);
    results.tests.push(utmTest);

    // Test 10: Vault export capabilities
    console.log('  🔍 Testing Vault export functionality...');
    const exportTest = await helper.testVaultExport(page);
    results.tests.push(exportTest);

    // Check for critical issues
    const failedTests = results.tests.filter(test => !test.passed);
    if (failedTests.length > 0) {
      results.success = false;
      
      failedTests.forEach(test => {
        if (test.severity === 'critical') {
          results.criticalIssues.push({
            title: `Vault Tier: ${test.name}`,
            description: test.error || 'Test failed without specific error',
            severity: 'critical'
          });
        }
      });
    }

    // Take screenshot
    await page.screenshot({ 
      path: './results/vault-tier-smoke-test.png',
      fullPage: true 
    });

    await page.close();
    
    const passedTests = results.tests.filter(test => test.passed).length;
    const successRate = ((passedTests / results.tests.length) * 100).toFixed(1);
    
    console.log(`  ✅ Vault Tier Test Complete: ${passedTests}/${results.tests.length} passed (${successRate}%)`);
    
    return results;

  } catch (error) {
    console.error('  ❌ Vault tier test failed:', error.message);
    results.success = false;
    results.criticalIssues.push({
      title: 'Vault Tier Test Failure',
      description: error.message,
      severity: 'critical'
    });
    return results;
  }
}