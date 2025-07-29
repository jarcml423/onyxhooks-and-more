#!/usr/bin/env node

// Enterprise E2E Testing Environment Setup for Replit
// This creates a comprehensive testing environment without browser dependencies

const fs = require('fs');
const path = require('path');

class E2ETestEnvironment {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.testResults = {
      timestamp: new Date().toISOString(),
      environment: 'development',
      summary: { totalTests: 0, passed: 0, failed: 0, blocked: 0 },
      categories: {},
      defects: [],
      recommendations: []
    };
  }

  async setupTestEnvironment() {
    console.log('🏗️  Setting up Enterprise E2E Test Environment...\n');

    // Verify test accounts are seeded
    await this.seedTestAccounts();
    
    // Validate core infrastructure
    await this.validateInfrastructure();
    
    // Test tier authentication and authorization
    await this.testTierSecurity();
    
    // Validate API endpoints
    await this.validateAPIEndpoints();
    
    // Test business logic
    await this.testBusinessLogic();
    
    // Generate comprehensive defect report
    await this.generateDefectReport();
  }

  async makeRequest(url, options = {}) {
    const https = require('https');
    const http = require('http');
    const client = url.startsWith('https://') ? https : http;
    
    return new Promise((resolve, reject) => {
      const req = client.request(url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({
              statusCode: res.statusCode,
              data: res.headers['content-type']?.includes('application/json') ? JSON.parse(data) : data,
              headers: res.headers
            });
          } catch (e) {
            resolve({ statusCode: res.statusCode, data, headers: res.headers });
          }
        });
      });

      req.on('error', reject);
      if (options.body) req.write(JSON.stringify(options.body));
      req.end();
    });
  }

  async testEndpoint(category, name, path, options = {}) {
    const testResult = {
      category,
      name,
      path,
      method: options.method || 'GET',
      expectedStatus: options.expectedStatus || 200,
      actualStatus: null,
      passed: false,
      error: null,
      responseTime: null,
      defectSeverity: null
    };

    console.log(`🔍 Testing: ${name}`);

    try {
      const startTime = Date.now();
      const response = await this.makeRequest(`${this.baseUrl}${path}`, options);
      testResult.responseTime = Date.now() - startTime;
      testResult.actualStatus = response.statusCode;

      // Determine if test passed
      if (options.shouldFail) {
        testResult.passed = response.statusCode >= 400;
      } else {
        testResult.passed = response.statusCode === testResult.expectedStatus;
      }

      // Additional validation
      if (options.validateResponse && testResult.passed) {
        const validationResult = options.validateResponse(response.data);
        if (!validationResult.valid) {
          testResult.passed = false;
          testResult.error = validationResult.error;
          testResult.defectSeverity = validationResult.severity || 'medium';
        }
      }

      const status = testResult.passed ? '✅' : '❌';
      const timing = testResult.responseTime ? ` (${testResult.responseTime}ms)` : '';
      console.log(`  ${status} ${name}: ${response.statusCode}${timing}`);

      if (!testResult.passed) {
        const defect = {
          id: `DEF-${Date.now()}`,
          category,
          name,
          severity: testResult.defectSeverity || this.determineSeverity(category, name),
          description: testResult.error || `Expected ${testResult.expectedStatus}, got ${testResult.actualStatus}`,
          path,
          method: testResult.method,
          reproductionSteps: this.generateReproductionSteps(category, name, options)
        };
        this.testResults.defects.push(defect);
      }

    } catch (error) {
      testResult.error = error.message;
      testResult.passed = false;
      console.log(`  ❌ ${name}: ${error.message}`);
    }

    // Track results
    if (!this.testResults.categories[category]) {
      this.testResults.categories[category] = { passed: 0, failed: 0, blocked: 0, total: 0 };
    }
    
    this.testResults.categories[category].total++;
    this.testResults.summary.totalTests++;

    if (testResult.passed) {
      this.testResults.categories[category].passed++;
      this.testResults.summary.passed++;
    } else {
      this.testResults.categories[category].failed++;
      this.testResults.summary.failed++;
    }

    return testResult;
  }

  async seedTestAccounts() {
    console.log('👥 SEEDING TEST ACCOUNTS');
    
    await this.testEndpoint('Setup', 'Seed Test Accounts', '/api/test/seed-accounts', {
      method: 'POST',
      body: {
        accounts: [
          {"email": "test_free@onyxnpearls.com", "role": "free", "username": "TestFree"},
          {"email": "test_starter@onyxnpearls.com", "role": "starter", "username": "TestStarter"},
          {"email": "test_pro@onyxnpearls.com", "role": "pro", "username": "TestPro"},
          {"email": "test_vault@onyxnpearls.com", "role": "vault", "username": "TestVault"}
        ]
      },
      validateResponse: (data) => {
        if (typeof data === 'string') return { valid: false, error: 'Expected JSON response', severity: 'high' };
        if (!data.success) return { valid: false, error: 'Account seeding failed', severity: 'critical' };
        return { valid: true };
      }
    });
  }

  async validateInfrastructure() {
    console.log('\n📡 INFRASTRUCTURE VALIDATION');
    
    await this.testEndpoint('Infrastructure', 'Server Health Check', '/api/health');
    await this.testEndpoint('Infrastructure', 'Landing Page Load', '/');
    await this.testEndpoint('Infrastructure', 'Login Page Access', '/login');
    await this.testEndpoint('Infrastructure', 'Signup Page Access', '/signup');
  }

  async testTierSecurity() {
    console.log('\n🔐 TIER SECURITY & AUTHORIZATION TESTING');
    
    // Test protected endpoints without authentication - these SHOULD fail
    await this.testEndpoint('Security', 'Protected Council API (Unauthorized)', '/api/council/analyze', {
      method: 'POST',
      body: { content: 'test hook', contentType: 'hook' },
      shouldFail: true,
      expectedStatus: 401,
      validateResponse: (data) => {
        // This endpoint should return 401 or redirect, not 400
        return { valid: false, error: 'Endpoint not properly protected - allows unauthorized access', severity: 'critical' };
      }
    });

    await this.testEndpoint('Security', 'Protected Vault Swipe Copy (Unauthorized)', '/api/swipe-copy/vault', {
      shouldFail: true,
      expectedStatus: 401,
      validateResponse: (data) => {
        return { valid: false, error: 'Vault endpoint accessible without authentication', severity: 'critical' };
      }
    });

    await this.testEndpoint('Security', 'Protected Admin Analytics (Unauthorized)', '/api/admin/marketing-insights', {
      shouldFail: true,
      expectedStatus: 401,
      validateResponse: (data) => {
        return { valid: false, error: 'Admin endpoint accessible without authentication', severity: 'critical' };
      }
    });
  }

  async validateAPIEndpoints() {
    console.log('\n🎯 API ENDPOINT VALIDATION');
    
    await this.testEndpoint('API', 'Hook Generation', '/api/hooks/generate', {
      method: 'POST',
      body: { niche: 'fitness coaching', transformation: 'lose 20 pounds' },
      validateResponse: (data) => {
        if (typeof data === 'string') return { valid: false, error: 'Expected JSON response', severity: 'high' };
        if (!data.hooks || !Array.isArray(data.hooks)) return { valid: false, error: 'Invalid hooks response format', severity: 'medium' };
        return { valid: true };
      }
    });

    await this.testEndpoint('API', 'Quiz Scoring', '/api/quiz/score', {
      method: 'POST',
      body: { answers: [3, 4, 3, 2, 4, 3] },
      validateResponse: (data) => {
        if (typeof data === 'string') return { valid: false, error: 'Expected JSON response', severity: 'high' };
        if (typeof data.score !== 'number') return { valid: false, error: 'Invalid quiz score format', severity: 'medium' };
        return { valid: true };
      }
    });
  }

  async testBusinessLogic() {
    console.log('\n💼 BUSINESS LOGIC VALIDATION');
    
    // Test Stripe integration for each tier
    const tiers = ['starter', 'pro', 'vault'];
    for (const tier of tiers) {
      await this.testEndpoint('Business Logic', `Stripe ${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier`, '/api/test/stripe-ping', {
        method: 'POST',
        body: { tier, customerName: `Test ${tier} User`, email: `test${tier}@example.com` },
        validateResponse: (data) => {
          if (typeof data === 'string') return { valid: false, error: 'Expected JSON response', severity: 'high' };
          if (!data.success) return { valid: false, error: `Stripe ${tier} tier validation failed`, severity: 'high' };
          return { valid: true };
        }
      });
    }
  }

  determineSeverity(category, testName) {
    if (category === 'Security') return 'critical';
    if (testName.includes('Protected') || testName.includes('Auth')) return 'critical';
    if (category === 'Infrastructure') return 'high';
    if (category === 'Business Logic') return 'high';
    return 'medium';
  }

  generateReproductionSteps(category, name, options) {
    const steps = [
      `1. Navigate to ${this.baseUrl}${options.path || '/'}`,
      `2. Send ${options.method || 'GET'} request`
    ];
    
    if (options.body) {
      steps.push(`3. Include request body: ${JSON.stringify(options.body, null, 2)}`);
    }
    
    steps.push('4. Observe the response status and data');
    return steps;
  }

  async generateDefectReport() {
    console.log('\n📊 GENERATING ENTERPRISE DEFECT REPORT...');
    
    const reportPath = './results/e2e-defect-report.md';
    const successRate = ((this.testResults.summary.passed / this.testResults.summary.totalTests) * 100).toFixed(1);
    
    let report = `# OnyxHooks & More™ - Enterprise E2E Test Report

## Executive Summary
- **Environment**: Development (Replit)
- **Test Run**: ${this.testResults.timestamp}
- **Total Tests**: ${this.testResults.summary.totalTests}
- **Passed**: ${this.testResults.summary.passed} ✅
- **Failed**: ${this.testResults.summary.failed} ❌
- **Success Rate**: ${successRate}%
- **Production Readiness**: ${successRate >= 95 ? '🟢 READY' : successRate >= 85 ? '🟡 NEEDS FIXES' : '🔴 BLOCKED'}

## Test Categories Breakdown
`;

    for (const [category, results] of Object.entries(this.testResults.categories)) {
      const categoryRate = ((results.passed / results.total) * 100).toFixed(1);
      report += `
### ${category}
- **Passed**: ${results.passed}/${results.total} (${categoryRate}%)
- **Status**: ${categoryRate >= 95 ? '🟢 Pass' : categoryRate >= 85 ? '🟡 Warning' : '🔴 Fail'}
`;
    }

    report += `
## Critical Defects (Must Fix Before Production)
`;

    const criticalDefects = this.testResults.defects.filter(d => d.severity === 'critical');
    const highDefects = this.testResults.defects.filter(d => d.severity === 'high');
    const mediumDefects = this.testResults.defects.filter(d => d.severity === 'medium');

    if (criticalDefects.length === 0) {
      report += '\n✅ **No critical defects found**\n';
    } else {
      criticalDefects.forEach(defect => {
        report += `
### ${defect.id}: ${defect.name}
- **Severity**: 🔴 CRITICAL
- **Category**: ${defect.category}
- **Description**: ${defect.description}
- **Endpoint**: ${defect.method} \`${defect.path}\`
- **Reproduction Steps**:
${defect.reproductionSteps.map(step => `  ${step}`).join('\n')}
`;
      });
    }

    if (highDefects.length > 0) {
      report += `\n## High Priority Defects\n`;
      highDefects.forEach(defect => {
        report += `
### ${defect.id}: ${defect.name}
- **Severity**: 🟡 HIGH
- **Description**: ${defect.description}
- **Endpoint**: ${defect.method} \`${defect.path}\`
`;
      });
    }

    report += `
## Production Deployment Checklist
- [ ] All critical defects resolved
- [ ] Security endpoints properly protected
- [ ] API responses return valid JSON
- [ ] Stripe integration validated for all tiers
- [ ] Authentication/authorization working correctly
- [ ] Success rate >= 95%

## Recommendations for Production Deployment
1. **Fix Authentication Protection**: Ensure protected endpoints return 401 for unauthorized access
2. **API Response Standardization**: All API endpoints should return JSON responses
3. **Security Hardening**: Implement proper tier-based access controls
4. **Comprehensive Integration Testing**: Test with real user authentication flows

---
*Generated by OnyxHooks Enterprise E2E Testing Environment*
*Development testing complete - ${criticalDefects.length === 0 ? 'Ready for production deployment after fixes' : 'BLOCKED for production until critical defects resolved'}*
`;

    if (!fs.existsSync('./results')) fs.mkdirSync('./results');
    fs.writeFileSync(reportPath, report);
    fs.writeFileSync('./results/e2e-test-results.json', JSON.stringify(this.testResults, null, 2));
    
    console.log(`\n📋 Enterprise Test Report: ${reportPath}`);
    console.log(`🎯 Test Results: ${this.testResults.summary.passed}/${this.testResults.summary.totalTests} passed (${successRate}%)`);
    
    if (criticalDefects.length > 0) {
      console.log(`🔴 PRODUCTION BLOCKED: ${criticalDefects.length} critical defects must be resolved`);
      console.log('\nCritical Issues:');
      criticalDefects.forEach(defect => {
        console.log(`  - ${defect.name}: ${defect.description}`);
      });
    } else {
      console.log(`🟢 PRODUCTION STATUS: ${successRate >= 95 ? 'READY' : 'NEEDS ATTENTION'}`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  const testEnv = new E2ETestEnvironment();
  testEnv.setupTestEnvironment().catch(console.error);
}

module.exports = E2ETestEnvironment;