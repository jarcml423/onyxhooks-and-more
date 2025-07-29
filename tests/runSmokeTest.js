import puppeteer from 'puppeteer';
import { runFreeTierTest } from './smoke/freeTierTest.js';
import { runStarterTierTest } from './smoke/starterTierTest.js';
import { runProTierTest } from './smoke/proTierTest.js';
import { runVaultTierTest } from './smoke/vaultTierTest.js';
import { generateTestReport } from '../utils/reportGenerator.js';

class SmokeTestRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      environment: 'Replit Development',
      summary: { total: 0, passed: 0, failed: 0, blocked: 0 },
      testResults: [],
      criticalIssues: []
    };
  }

  async initBrowser() {
    console.log('🌐 Initializing Puppeteer browser...');
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    console.log('✅ Browser initialized successfully');
  }

  async runAllTests() {
    console.log('🚀 Starting OnyxHooks & More™ Full Smoke Test Suite...\n');
    
    try {
      await this.initBrowser();

      // Run tier-specific tests
      const testResults = await Promise.allSettled([
        runFreeTierTest(this.browser),
        runStarterTierTest(this.browser),
        runProTierTest(this.browser),
        runVaultTierTest(this.browser)
      ]);

      // Process results
      testResults.forEach((result, index) => {
        const tierNames = ['Free', 'Starter', 'Pro', 'Vault'];
        const tierName = tierNames[index];
        
        if (result.status === 'fulfilled') {
          this.results.testResults.push({
            tier: tierName,
            status: 'completed',
            results: result.value
          });
          
          // Count passed/failed tests
          if (result.value.success) {
            this.results.summary.passed++;
          } else {
            this.results.summary.failed++;
            if (result.value.criticalIssues) {
              this.results.criticalIssues.push(...result.value.criticalIssues);
            }
          }
        } else {
          this.results.testResults.push({
            tier: tierName,
            status: 'failed',
            error: result.reason.message
          });
          this.results.summary.failed++;
        }
        
        this.results.summary.total++;
      });

      await this.browser.close();
      
      // Generate comprehensive report
      await generateTestReport(this.results);
      
      const successRate = ((this.results.summary.passed / this.results.summary.total) * 100).toFixed(1);
      
      console.log('\n📊 SMOKE TEST RESULTS:');
      console.log(`Total Tests: ${this.results.summary.total}`);
      console.log(`Passed: ${this.results.summary.passed} ✅`);
      console.log(`Failed: ${this.results.summary.failed} ❌`);
      console.log(`Success Rate: ${successRate}%`);
      
      if (this.results.criticalIssues.length > 0) {
        console.log(`\n🔴 CRITICAL ISSUES: ${this.results.criticalIssues.length}`);
        this.results.criticalIssues.forEach(issue => {
          console.log(`  - ${issue.title}: ${issue.description}`);
        });
      }
      
      console.log('\n✅ Full Smoke Test Suite Complete.');
      console.log('📋 Check /results folder for detailed reports and screenshots.');
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Smoke test runner failed:', error);
      if (this.browser) {
        await this.browser.close();
      }
      throw error;
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const runner = new SmokeTestRunner();
  runner.runAllTests().catch(console.error);
}

export { SmokeTestRunner };