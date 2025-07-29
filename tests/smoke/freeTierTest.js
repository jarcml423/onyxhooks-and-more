import { TierTestHelper } from '../utils/tierTestHelper.js';

export async function runFreeTierTest(browser) {
  console.log('🆓 Starting Free Tier Smoke Test...');
  
  const helper = new TierTestHelper(browser, 'free');
  const results = {
    tier: 'free',
    timestamp: new Date().toISOString(),
    tests: [],
    success: true,
    criticalIssues: []
  };

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    // Test 1: Landing page loads
    console.log('  🔍 Testing landing page access...');
    const landingTest = await helper.testPageLoad(page, '/', 'Landing Page');
    results.tests.push(landingTest);

    // Test 2: Free hook generation access
    console.log('  🔍 Testing free hook generation...');
    const hookGenTest = await helper.testHookGeneration(page, {
      niche: 'fitness coaching',
      transformation: 'lose 20 pounds',
      expectedLimit: 2
    });
    results.tests.push(hookGenTest);

    // Test 3: Verify premium features are blocked
    console.log('  🔍 Testing premium feature restrictions...');
    const restrictionTest = await helper.testPremiumRestrictions(page);
    results.tests.push(restrictionTest);

    // Test 4: Signup flow accessibility
    console.log('  🔍 Testing signup accessibility...');
    const signupTest = await helper.testSignupFlow(page);
    results.tests.push(signupTest);

    // Test 5: Quiz access
    console.log('  🔍 Testing quiz functionality...');
    const quizTest = await helper.testQuizAccess(page);
    results.tests.push(quizTest);

    // Check for critical issues
    const failedTests = results.tests.filter(test => !test.passed);
    if (failedTests.length > 0) {
      results.success = false;
      
      failedTests.forEach(test => {
        if (test.severity === 'critical') {
          results.criticalIssues.push({
            title: `Free Tier: ${test.name}`,
            description: test.error || 'Test failed without specific error',
            severity: 'critical'
          });
        }
      });
    }

    // Take screenshot
    await page.screenshot({ 
      path: './results/free-tier-smoke-test.png',
      fullPage: true 
    });

    await page.close();
    
    const passedTests = results.tests.filter(test => test.passed).length;
    const successRate = ((passedTests / results.tests.length) * 100).toFixed(1);
    
    console.log(`  ✅ Free Tier Test Complete: ${passedTests}/${results.tests.length} passed (${successRate}%)`);
    
    return results;

  } catch (error) {
    console.error('  ❌ Free tier test failed:', error.message);
    results.success = false;
    results.criticalIssues.push({
      title: 'Free Tier Test Failure',
      description: error.message,
      severity: 'critical'
    });
    return results;
  }
}