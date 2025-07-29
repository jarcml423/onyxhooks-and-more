#!/usr/bin/env node

// Quick Tier Access Testing for Replit Environment
// Alternative to Puppeteer when browser dependencies are unavailable

const https = require('https');
const http = require('http');
const fs = require('fs');

class QuickTierTester {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = {
      timestamp: new Date().toISOString(),
      environment: 'Replit Development (No Browser)',
      totalTests: 0,
      passed: 0,
      failed: 0,
      tests: [],
      criticalIssues: []
    };
  }

  async makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${path}`;
      const client = url.startsWith('https://') ? https : http;
      
      const req = client.request(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'OnyxHooks-Testing-Bot/1.0',
          ...options.headers
        },
        timeout: 10000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
            isJson: res.headers['content-type']?.includes('application/json')
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
      
      if (options.body) {
        req.write(JSON.stringify(options.body));
      }
      
      req.end();
    });
  }

  logTest(name, passed, details = {}) {
    const test = {
      name,
      passed,
      timestamp: new Date().toISOString(),
      ...details
    };
    
    this.results.tests.push(test);
    this.results.totalTests++;
    
    if (passed) {
      this.results.passed++;
      console.log(`✅ ${name}`);
    } else {
      this.results.failed++;
      console.log(`❌ ${name}: ${details.error || 'Failed'}`);
      
      if (details.severity === 'critical') {
        this.results.criticalIssues.push({
          test: name,
          error: details.error,
          impact: details.impact || 'Critical system vulnerability'
        });
      }
    }
  }

  async testInfrastructure() {
    console.log('\n🏗️ INFRASTRUCTURE TESTING');
    
    // Test 1: Server Health
    try {
      const response = await this.makeRequest('/api/health');
      this.logTest('Server Health Check', response.statusCode === 200, {
        statusCode: response.statusCode,
        severity: response.statusCode !== 200 ? 'critical' : 'none'
      });
    } catch (error) {
      this.logTest('Server Health Check', false, {
        error: error.message,
        severity: 'critical',
        impact: 'Platform completely down'
      });
    }

    // Test 2: Landing Page
    try {
      const response = await this.makeRequest('/');
      this.logTest('Landing Page Access', response.statusCode === 200, {
        statusCode: response.statusCode
      });
    } catch (error) {
      this.logTest('Landing Page Access', false, { error: error.message });
    }

    // Test 3: Login Page
    try {
      const response = await this.makeRequest('/login');
      this.logTest('Login Page Access', response.statusCode === 200, {
        statusCode: response.statusCode
      });
    } catch (error) {
      this.logTest('Login Page Access', false, { error: error.message });
    }
  }

  async testAuthentication() {
    console.log('\n🔐 AUTHENTICATION & AUTHORIZATION TESTING');
    
    // Test 1: Protected Vault Endpoint (Should return 401)
    try {
      const response = await this.makeRequest('/api/swipe-copy/vault');
      const shouldBeProtected = response.statusCode === 401 || response.statusCode === 403;
      this.logTest('Vault Endpoint Protection', shouldBeProtected, {
        statusCode: response.statusCode,
        expected: '401 or 403',
        severity: shouldBeProtected ? 'none' : 'critical',
        impact: shouldBeProtected ? null : 'Unauthorized access to premium features',
        error: shouldBeProtected ? null : `Expected 401/403, got ${response.statusCode}`
      });
    } catch (error) {
      this.logTest('Vault Endpoint Protection', false, { error: error.message, severity: 'high' });
    }

    // Test 2: Protected Admin Endpoint (Should return 401)
    try {
      const response = await this.makeRequest('/api/admin/marketing-insights');
      const shouldBeProtected = response.statusCode === 401 || response.statusCode === 403;
      this.logTest('Admin Endpoint Protection', shouldBeProtected, {
        statusCode: response.statusCode,
        expected: '401 or 403',
        severity: shouldBeProtected ? 'none' : 'critical',
        impact: shouldBeProtected ? null : 'Unauthorized access to admin features',
        error: shouldBeProtected ? null : `Expected 401/403, got ${response.statusCode}`
      });
    } catch (error) {
      this.logTest('Admin Endpoint Protection', false, { error: error.message, severity: 'high' });
    }

    // Test 3: Protected Council Endpoint (Should return 401)
    try {
      const response = await this.makeRequest('/api/council/analyze', {
        method: 'POST',
        body: { content: 'test hook', contentType: 'hook' }
      });
      const shouldBeProtected = response.statusCode === 401 || response.statusCode === 403;
      this.logTest('Council Endpoint Protection', shouldBeProtected, {
        statusCode: response.statusCode,
        expected: '401 or 403',
        severity: shouldBeProtected ? 'none' : 'critical',
        impact: shouldBeProtected ? null : 'Unauthorized access to AI Council',
        error: shouldBeProtected ? null : `Expected 401/403, got ${response.statusCode}`
      });
    } catch (error) {
      this.logTest('Council Endpoint Protection', false, { error: error.message, severity: 'high' });
    }
  }

  async testAPIEndpoints() {
    console.log('\n🎯 API ENDPOINT VALIDATION');
    
    // Test 1: Hook Generation API
    try {
      const response = await this.makeRequest('/api/hooks/generate', {
        method: 'POST',
        body: { niche: 'fitness coaching', transformation: 'lose 20 pounds' }
      });
      
      let validResponse = response.statusCode === 200;
      let parsedData = null;
      
      if (response.isJson) {
        try {
          parsedData = JSON.parse(response.data);
          validResponse = validResponse && parsedData.hooks && Array.isArray(parsedData.hooks);
        } catch (e) {
          validResponse = false;
        }
      } else {
        validResponse = false;
      }
      
      this.logTest('Hook Generation API', validResponse, {
        statusCode: response.statusCode,
        isJson: response.isJson,
        hasHooks: parsedData?.hooks ? 'Yes' : 'No',
        error: validResponse ? null : 'Invalid response format or missing hooks array'
      });
    } catch (error) {
      this.logTest('Hook Generation API', false, { error: error.message });
    }

    // Test 2: Quiz Scoring API
    try {
      const response = await this.makeRequest('/api/quiz/score', {
        method: 'POST',
        body: { answers: [3, 4, 3, 2, 4, 3] }
      });
      
      let validResponse = response.statusCode === 200;
      let parsedData = null;
      
      if (response.isJson) {
        try {
          parsedData = JSON.parse(response.data);
          validResponse = validResponse && typeof parsedData.score === 'number';
        } catch (e) {
          validResponse = false;
        }
      } else {
        validResponse = false;
      }
      
      this.logTest('Quiz Scoring API', validResponse, {
        statusCode: response.statusCode,
        isJson: response.isJson,
        hasScore: parsedData?.score !== undefined ? 'Yes' : 'No',
        error: validResponse ? null : 'Invalid response format or missing score'
      });
    } catch (error) {
      this.logTest('Quiz Scoring API', false, { error: error.message });
    }
  }

  async testBusinessLogic() {
    console.log('\n💼 BUSINESS LOGIC VALIDATION');
    
    // Test Stripe integration for each tier
    const tiers = [
      { name: 'Starter', tier: 'starter' },
      { name: 'Pro', tier: 'pro' },
      { name: 'Vault', tier: 'vault' }
    ];

    for (const { name, tier } of tiers) {
      try {
        const response = await this.makeRequest('/api/test/stripe-ping', {
          method: 'POST',
          body: { 
            tier, 
            customerName: `Test ${name} User`, 
            email: `test${tier}@example.com` 
          }
        });
        
        let validResponse = response.statusCode === 200;
        let parsedData = null;
        
        if (response.isJson) {
          try {
            parsedData = JSON.parse(response.data);
            validResponse = validResponse && parsedData.success === true;
          } catch (e) {
            validResponse = false;
          }
        }
        
        this.logTest(`Stripe ${name} Tier Integration`, validResponse, {
          statusCode: response.statusCode,
          isJson: response.isJson,
          success: parsedData?.success ? 'Yes' : 'No',
          tier: tier,
          error: validResponse ? null : 'Stripe integration failed'
        });
      } catch (error) {
        this.logTest(`Stripe ${name} Tier Integration`, false, { 
          error: error.message,
          tier: tier,
          severity: 'high'
        });
      }
    }
  }

  async generateReport() {
    console.log('\n📊 GENERATING TEST REPORT...');
    
    const successRate = this.results.totalTests > 0 ? 
      ((this.results.passed / this.results.totalTests) * 100).toFixed(1) : 0;
    
    const reportContent = `# OnyxHooks & More™ - Quick Tier Test Report

## Executive Summary
- **Environment**: ${this.results.environment}
- **Test Run**: ${this.results.timestamp}
- **Total Tests**: ${this.results.totalTests}
- **Passed**: ${this.results.passed} ✅
- **Failed**: ${this.results.failed} ❌
- **Success Rate**: ${successRate}%
- **Critical Issues**: ${this.results.criticalIssues.length}

## Production Readiness
${successRate >= 95 ? '🟢 **READY FOR PRODUCTION**' : 
  successRate >= 85 ? '🟡 **NEEDS ATTENTION**' : '🔴 **CRITICAL ISSUES - BLOCKED**'}

${this.results.criticalIssues.length > 0 ? `
## Critical Issues Requiring Immediate Attention
${this.results.criticalIssues.map((issue, index) => `
### ${index + 1}. ${issue.test}
- **Error**: ${issue.error}
- **Impact**: ${issue.impact}
`).join('')}` : ''}

## Test Results Detail
${this.results.tests.map(test => `
### ${test.name}
- **Status**: ${test.passed ? '✅ PASSED' : '❌ FAILED'}
- **Timestamp**: ${test.timestamp}
${test.statusCode ? `- **Status Code**: ${test.statusCode}` : ''}
${test.error ? `- **Error**: ${test.error}` : ''}
${test.expected ? `- **Expected**: ${test.expected}` : ''}
`).join('')}

## Recommendations
${successRate >= 95 ? 
  '- Proceed with production deployment\n- Monitor production metrics\n- Schedule regular testing' :
  '- Fix critical authentication and authorization issues\n- Re-run tests after fixes\n- Achieve 95%+ success rate before production'
}

---
*Generated by OnyxHooks Quick Tier Testing Framework*
*Alternative testing method for Replit environment limitations*
`;

    if (!fs.existsSync('./results')) {
      fs.mkdirSync('./results', { recursive: true });
    }

    const reportPath = './results/quick-tier-test-report.md';
    fs.writeFileSync(reportPath, reportContent);
    
    const jsonPath = './results/quick-tier-test-results.json';
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));

    console.log(`📋 Reports generated:`);
    console.log(`  - Summary: ${reportPath}`);
    console.log(`  - Data: ${jsonPath}`);
    
    return { success: successRate >= 95, successRate, criticalIssues: this.results.criticalIssues.length };
  }

  async runAllTests() {
    console.log('🚀 Starting OnyxHooks Quick Tier Testing...\n');
    console.log('📝 Note: Browser-free testing due to Replit Chrome dependencies\n');

    await this.testInfrastructure();
    await this.testAuthentication();
    await this.testAPIEndpoints();
    await this.testBusinessLogic();
    
    const summary = await this.generateReport();
    
    console.log('\n🎯 FINAL SUMMARY:');
    console.log(`Success Rate: ${summary.successRate}%`);
    console.log(`Critical Issues: ${summary.criticalIssues}`);
    console.log(`Production Ready: ${summary.success ? 'YES' : 'NO'}`);
    
    if (!summary.success) {
      console.log('\n🔴 Production deployment blocked until critical issues are resolved.');
    }
    
    return summary;
  }
}

// Run if called directly
if (require.main === module) {
  const tester = new QuickTierTester();
  tester.runAllTests().catch(console.error);
}

module.exports = QuickTierTester;