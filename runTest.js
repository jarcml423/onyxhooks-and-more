#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test configuration
const config = JSON.parse(fs.readFileSync('./config/tiers.json', 'utf8'));

class TierAccessBot {
  constructor() {
    this.browser = null;
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        errors: []
      },
      tierResults: {}
    };
  }

  async init() {
    console.log('🤖 Initializing OnyxHooks Tier Access Bot...');
    this.browser = await puppeteer.launch({
      headless: config.testSettings.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    console.log('✅ Browser initialized');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🔄 Browser cleanup complete');
    }
  }

  async testTierAccess(tier) {
    console.log(`\n🔍 Testing ${tier.tier.toUpperCase()} tier access...`);
    
    const page = await this.browser.newPage();
    await page.setViewport(config.testSettings.viewport);
    
    const tierResult = {
      tier: tier.tier,
      email: tier.email,
      timestamp: new Date().toISOString(),
      routeTests: [],
      apiTests: [],
      featureTests: [],
      status: 'passed',
      errors: []
    };

    try {
      // Test login process
      console.log(`  🔐 Testing login for ${tier.email}...`);
      await page.goto(`${config.testSettings.baseUrl}/login`);
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });
      
      // Fill login form
      await page.type('input[type="email"]', tier.email);
      await page.type('input[type="password"]', tier.password);
      await page.click('button[type="submit"]');
      
      // Wait for potential redirect after login
      await page.waitForTimeout(3000);
      
      // Test allowed routes
      for (const route of tier.expectedAccess.routes) {
        console.log(`    📍 Testing route: ${route.path}`);
        const routeResult = await this.testRoute(page, route, true);
        tierResult.routeTests.push(routeResult);
        this.results.summary.totalTests++;
        if (routeResult.passed) this.results.summary.passed++;
        else this.results.summary.failed++;
      }

      // Test restricted routes  
      for (const route of tier.expectedAccess.restrictedRoutes) {
        console.log(`    🚫 Testing restricted route: ${route.path}`);
        const routeResult = await this.testRoute(page, route, false);
        tierResult.routeTests.push(routeResult);
        this.results.summary.totalTests++;
        if (routeResult.passed) this.results.summary.passed++;
        else this.results.summary.failed++;
      }

      // Test API endpoints
      for (const endpoint of tier.expectedAccess.apiEndpoints) {
        console.log(`    🔌 Testing API: ${endpoint.path}`);
        const apiResult = await this.testApiEndpoint(page, endpoint, true);
        tierResult.apiTests.push(apiResult);
        this.results.summary.totalTests++;
        if (apiResult.passed) this.results.summary.passed++;
        else this.results.summary.failed++;
      }

      // Test restricted API endpoints
      for (const endpoint of tier.expectedAccess.restrictedApiEndpoints) {
        console.log(`    ⛔ Testing restricted API: ${endpoint.path}`);
        const apiResult = await this.testApiEndpoint(page, endpoint, false);
        tierResult.apiTests.push(apiResult);
        this.results.summary.totalTests++;
        if (apiResult.passed) this.results.summary.passed++;
        else this.results.summary.failed++;
      }

      // Test UI features
      for (const feature of tier.expectedAccess.features) {
        console.log(`    🎯 Testing feature: ${feature.description}`);
        const featureResult = await this.testFeature(page, feature);
        tierResult.featureTests.push(featureResult);
        this.results.summary.totalTests++;
        if (featureResult.passed) this.results.summary.passed++;
        else this.results.summary.failed++;
      }

    } catch (error) {
      console.error(`❌ Error testing ${tier.tier}: ${error.message}`);
      tierResult.status = 'error';
      tierResult.errors.push(error.message);
      this.results.summary.errors.push(`${tier.tier}: ${error.message}`);
    }

    await page.close();
    this.results.tierResults[tier.tier] = tierResult;
    
    const passedTests = tierResult.routeTests.filter(t => t.passed).length + 
                       tierResult.apiTests.filter(t => t.passed).length +
                       tierResult.featureTests.filter(t => t.passed).length;
    const totalTests = tierResult.routeTests.length + tierResult.apiTests.length + tierResult.featureTests.length;
    
    console.log(`  ✅ ${tier.tier.toUpperCase()} tier: ${passedTests}/${totalTests} tests passed`);
  }

  async testRoute(page, route, shouldSucceed) {
    const result = {
      path: route.path,
      expectedStatus: route.status,
      description: route.description,
      shouldSucceed,
      actualStatus: null,
      passed: false,
      error: null,
      responseTime: null
    };

    try {
      const startTime = Date.now();
      const response = await page.goto(`${config.testSettings.baseUrl}${route.path}`, {
        waitUntil: 'networkidle0',
        timeout: config.testSettings.timeout
      });
      result.responseTime = Date.now() - startTime;
      result.actualStatus = response.status();

      if (shouldSucceed) {
        result.passed = (result.actualStatus >= 200 && result.actualStatus < 400);
      } else {
        // For restricted routes, we expect redirect (302) or forbidden (403)
        result.passed = (result.actualStatus === 302 || result.actualStatus === 403);
      }

    } catch (error) {
      result.error = error.message;
      result.passed = false;
    }

    return result;
  }

  async testApiEndpoint(page, endpoint, shouldSucceed) {
    const result = {
      path: endpoint.path,
      method: endpoint.method,
      expectedStatus: endpoint.status,
      description: endpoint.description,
      shouldSucceed,
      actualStatus: null,
      passed: false,
      error: null,
      responseTime: null
    };

    try {
      const startTime = Date.now();
      
      // Make API call using page.evaluate to run in browser context
      const response = await page.evaluate(async (url, method) => {
        const options = {
          method: method,
          headers: {
            'Content-Type': 'application/json'
          }
        };

        // Add test data for POST requests
        if (method === 'POST') {
          if (url.includes('/hooks/generate')) {
            options.body = JSON.stringify({
              niche: 'fitness coaching',
              transformation: 'lose 20 pounds'
            });
          } else if (url.includes('/quiz/score')) {
            options.body = JSON.stringify({
              answers: [3, 4, 3, 2, 4, 3]
            });
          } else if (url.includes('/council/analyze')) {
            options.body = JSON.stringify({
              content: 'Transform your body in 90 days',
              contentType: 'hook'
            });
          }
        }

        const response = await fetch(url, options);
        return {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText
        };
      }, `${config.testSettings.baseUrl}${endpoint.path}`, endpoint.method);

      result.responseTime = Date.now() - startTime;
      result.actualStatus = response.status;

      if (shouldSucceed) {
        result.passed = (result.actualStatus >= 200 && result.actualStatus < 400);
      } else {
        result.passed = (result.actualStatus === 401 || result.actualStatus === 403);
      }

    } catch (error) {
      result.error = error.message;
      result.passed = false;
    }

    return result;
  }

  async testFeature(page, feature) {
    const result = {
      selector: feature.selector,
      description: feature.description,
      found: false,
      passed: false,
      error: null
    };

    try {
      const element = await page.$(feature.selector);
      result.found = !!element;
      result.passed = result.found;
      
      if (element) {
        // Additional checks could be added here (visibility, text content, etc.)
        const isVisible = await element.isIntersectingViewport();
        result.passed = isVisible;
      }

    } catch (error) {
      result.error = error.message;
      result.passed = false;
    }

    return result;
  }

  async generateReport() {
    const reportPath = './results/smoke-report.md';
    
    // Ensure results directory exists
    if (!fs.existsSync('./results')) {
      fs.mkdirSync('./results');
    }

    let report = `# OnyxHooks & More™ - Tier Access Smoke Test Report

## Summary
- **Test Run**: ${this.results.timestamp}
- **Total Tests**: ${this.results.summary.totalTests}
- **Passed**: ${this.results.summary.passed} ✅
- **Failed**: ${this.results.summary.failed} ❌
- **Success Rate**: ${((this.results.summary.passed / this.results.summary.totalTests) * 100).toFixed(1)}%

`;

    if (this.results.summary.errors.length > 0) {
      report += `## Critical Errors\n`;
      this.results.summary.errors.forEach(error => {
        report += `- ❌ ${error}\n`;
      });
      report += `\n`;
    }

    // Tier-specific results
    for (const [tierName, tierResult] of Object.entries(this.results.tierResults)) {
      const totalTierTests = tierResult.routeTests.length + tierResult.apiTests.length + tierResult.featureTests.length;
      const passedTierTests = tierResult.routeTests.filter(t => t.passed).length + 
                             tierResult.apiTests.filter(t => t.passed).length +
                             tierResult.featureTests.filter(t => t.passed).length;

      report += `## ${tierName.toUpperCase()} Tier Results\n`;
      report += `- **Account**: ${tierResult.email}\n`;
      report += `- **Status**: ${tierResult.status === 'passed' ? '✅ PASSED' : '❌ FAILED'}\n`;
      report += `- **Tests**: ${passedTierTests}/${totalTierTests} passed\n\n`;

      // Route tests
      if (tierResult.routeTests.length > 0) {
        report += `### Route Access Tests\n`;
        tierResult.routeTests.forEach(test => {
          const status = test.passed ? '✅' : '❌';
          const timing = test.responseTime ? ` (${test.responseTime}ms)` : '';
          report += `- ${status} \`${test.path}\` - ${test.description}${timing}\n`;
          if (!test.passed && test.error) {
            report += `  - Error: ${test.error}\n`;
          }
        });
        report += `\n`;
      }

      // API tests
      if (tierResult.apiTests.length > 0) {
        report += `### API Endpoint Tests\n`;
        tierResult.apiTests.forEach(test => {
          const status = test.passed ? '✅' : '❌';
          const timing = test.responseTime ? ` (${test.responseTime}ms)` : '';
          report += `- ${status} \`${test.method} ${test.path}\` - ${test.description}${timing}\n`;
          if (!test.passed && test.error) {
            report += `  - Error: ${test.error}\n`;
          }
        });
        report += `\n`;
      }

      // Feature tests
      if (tierResult.featureTests.length > 0) {
        report += `### UI Feature Tests\n`;
        tierResult.featureTests.forEach(test => {
          const status = test.passed ? '✅' : '❌';
          report += `- ${status} \`${test.selector}\` - ${test.description}\n`;
          if (!test.passed && test.error) {
            report += `  - Error: ${test.error}\n`;
          }
        });
        report += `\n`;
      }
    }

    report += `## Test Configuration
- **Base URL**: ${config.testSettings.baseUrl}
- **Timeout**: ${config.testSettings.timeout}ms
- **Viewport**: ${config.testSettings.viewport.width}x${config.testSettings.viewport.height}
- **Headless**: ${config.testSettings.headless}

---
*Generated by OnyxHooks Automated Tier Access Bot*
`;

    fs.writeFileSync(reportPath, report);
    console.log(`\n📊 Test report generated: ${reportPath}`);
    
    // Also save JSON results for programmatic access
    fs.writeFileSync('./results/smoke-results.json', JSON.stringify(this.results, null, 2));
  }

  async run() {
    try {
      await this.init();
      
      console.log(`🚀 Starting comprehensive tier access testing...`);
      console.log(`📋 Testing ${config.testAccounts.length} tier accounts`);
      
      // Test each tier account
      for (const tierAccount of config.testAccounts) {
        await this.testTierAccess(tierAccount);
      }

      // Generate comprehensive report
      await this.generateReport();

      console.log(`\n🎯 TESTING COMPLETE`);
      console.log(`📊 Results: ${this.results.summary.passed}/${this.results.summary.totalTests} tests passed`);
      console.log(`🏆 Success Rate: ${((this.results.summary.passed / this.results.summary.totalTests) * 100).toFixed(1)}%`);

      if (this.results.summary.failed > 0) {
        console.log(`⚠️  ${this.results.summary.failed} tests failed - check report for details`);
        process.exit(1);
      }

    } catch (error) {
      console.error('💥 Critical testing error:', error);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }
}

// Run the bot if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const bot = new TierAccessBot();
  bot.run().catch(console.error);
}

export default TierAccessBot;