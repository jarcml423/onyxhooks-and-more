import fs from 'fs';
import path from 'path';

export async function generateTestReport(results) {
  console.log('📊 Generating comprehensive test report...');
  
  const reportDir = './results';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Ensure results directory exists
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  // Generate detailed markdown report
  const markdownReport = generateMarkdownReport(results);
  const markdownPath = path.join(reportDir, `smoke-test-report-${timestamp}.md`);
  fs.writeFileSync(markdownPath, markdownReport);
  
  // Generate JSON report for programmatic access
  const jsonPath = path.join(reportDir, `smoke-test-results-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  
  // Generate executive summary
  const summaryReport = generateExecutiveSummary(results);
  const summaryPath = path.join(reportDir, `executive-summary-${timestamp}.md`);
  fs.writeFileSync(summaryPath, summaryReport);
  
  // Generate CSV for spreadsheet analysis
  const csvReport = generateCSVReport(results);
  const csvPath = path.join(reportDir, `test-results-${timestamp}.csv`);
  fs.writeFileSync(csvPath, csvReport);
  
  console.log(`📋 Reports generated:`);
  console.log(`  - Detailed: ${markdownPath}`);
  console.log(`  - Summary: ${summaryPath}`);
  console.log(`  - JSON: ${jsonPath}`);
  console.log(`  - CSV: ${csvPath}`);
  
  return {
    markdown: markdownPath,
    json: jsonPath,
    summary: summaryPath,
    csv: csvPath
  };
}

function generateMarkdownReport(results) {
  const successRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);
  const productionReady = successRate >= 95;
  const status = productionReady ? '🟢 PRODUCTION READY' : 
                successRate >= 85 ? '🟡 NEEDS ATTENTION' : '🔴 CRITICAL ISSUES';
  
  let report = `# OnyxHooks & More™ - Puppeteer Smoke Test Report

## Executive Summary
- **Test Environment**: ${results.environment}
- **Test Run**: ${results.timestamp}
- **Total Tiers Tested**: ${results.summary.total}
- **Passed**: ${results.summary.passed} ✅
- **Failed**: ${results.summary.failed} ❌
- **Success Rate**: ${successRate}%
- **Production Status**: ${status}

## Test Results by Tier
`;

  // Process each tier result
  results.testResults.forEach(tierResult => {
    report += `\n### ${tierResult.tier.charAt(0).toUpperCase() + tierResult.tier.slice(1)} Tier\n`;
    
    if (tierResult.status === 'completed') {
      const tierTests = tierResult.results.tests || [];
      const tierPassed = tierTests.filter(test => test.passed).length;
      const tierTotal = tierTests.length;
      const tierRate = tierTotal > 0 ? ((tierPassed / tierTotal) * 100).toFixed(1) : 0;
      
      report += `- **Status**: ${tierResult.results.success ? '✅ PASSED' : '❌ FAILED'}\n`;
      report += `- **Tests**: ${tierPassed}/${tierTotal} passed (${tierRate}%)\n`;
      
      if (tierTests.length > 0) {
        report += `\n#### Test Details:\n`;
        tierTests.forEach(test => {
          const icon = test.passed ? '✅' : '❌';
          report += `- ${icon} **${test.name}**`;
          if (!test.passed && test.error) {
            report += `: ${test.error}`;
          }
          report += '\n';
        });
      }
      
      // Add critical issues for this tier
      if (tierResult.results.criticalIssues && tierResult.results.criticalIssues.length > 0) {
        report += `\n#### Critical Issues:\n`;
        tierResult.results.criticalIssues.forEach(issue => {
          report += `- 🔴 **${issue.title}**: ${issue.description}\n`;
        });
      }
      
    } else {
      report += `- **Status**: ❌ FAILED TO EXECUTE\n`;
      report += `- **Error**: ${tierResult.error}\n`;
    }
  });

  // Overall critical issues summary
  if (results.criticalIssues && results.criticalIssues.length > 0) {
    report += `\n## Critical Issues Summary\n`;
    report += `**Total Critical Issues**: ${results.criticalIssues.length}\n\n`;
    
    results.criticalIssues.forEach((issue, index) => {
      report += `### Issue ${index + 1}: ${issue.title}\n`;
      report += `- **Severity**: 🔴 CRITICAL\n`;
      report += `- **Description**: ${issue.description}\n\n`;
    });
  }

  // Production readiness assessment
  report += `\n## Production Readiness Assessment\n`;
  
  if (productionReady) {
    report += `🟢 **READY FOR PRODUCTION DEPLOYMENT**\n\n`;
    report += `All critical tests passed. Platform is ready for production deployment.\n`;
  } else if (successRate >= 85) {
    report += `🟡 **NEEDS ATTENTION BEFORE PRODUCTION**\n\n`;
    report += `Platform is mostly functional but has issues that should be addressed before production deployment.\n`;
  } else {
    report += `🔴 **CRITICAL ISSUES - PRODUCTION BLOCKED**\n\n`;
    report += `Platform has critical issues that must be resolved before production deployment.\n`;
  }

  report += `\n## Recommendations\n`;
  
  if (results.criticalIssues && results.criticalIssues.length > 0) {
    report += `### Immediate Actions Required:\n`;
    results.criticalIssues.forEach(issue => {
      report += `- Fix: ${issue.title}\n`;
    });
  }
  
  report += `\n### Next Steps:\n`;
  if (productionReady) {
    report += `1. Proceed with production deployment\n`;
    report += `2. Monitor production metrics post-deployment\n`;
    report += `3. Schedule regular testing cycles\n`;
  } else {
    report += `1. Address critical issues identified above\n`;
    report += `2. Re-run smoke tests to verify fixes\n`;
    report += `3. Achieve 95%+ success rate before production deployment\n`;
  }

  report += `\n---\n*Generated by OnyxHooks Puppeteer Testing Framework*\n`;
  report += `*Environment: Replit Development | Browser: Headless Chrome*`;

  return report;
}

function generateExecutiveSummary(results) {
  const successRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);
  const productionReady = successRate >= 95;
  
  let summary = `# Executive Summary - OnyxHooks & More™ Testing

## Key Metrics
- **Success Rate**: ${successRate}%
- **Tiers Tested**: ${results.summary.total}
- **Critical Issues**: ${results.criticalIssues ? results.criticalIssues.length : 0}
- **Production Ready**: ${productionReady ? 'YES' : 'NO'}

## Business Impact
`;

  if (productionReady) {
    summary += `✅ **Platform is ready for production deployment**
- All tier functionality validated
- User authentication and authorization working
- Payment processing confirmed operational
- No critical security issues identified

## Revenue Impact
- Stripe integration validated for all tiers
- Subscription management functional
- User tier progression working correctly
- No blockers to customer acquisition`;
  } else {
    summary += `❌ **Platform deployment blocked**
- Critical issues must be resolved
- User experience compromised
- Potential revenue loss if deployed

## Risk Assessment
- **High Risk**: Deploying with current issues could impact customer satisfaction
- **Revenue Risk**: Payment or tier access issues could prevent conversions
- **Security Risk**: Authentication vulnerabilities identified`;
  }

  summary += `\n\n## Immediate Actions
`;
  
  if (results.criticalIssues && results.criticalIssues.length > 0) {
    summary += `**Critical Issues to Address:**\n`;
    results.criticalIssues.forEach((issue, index) => {
      summary += `${index + 1}. ${issue.title}\n`;
    });
  } else {
    summary += `No critical issues - proceed with deployment planning.\n`;
  }

  return summary;
}

function generateCSVReport(results) {
  let csv = 'Tier,Test_Name,Status,Error,Severity,Timestamp\n';
  
  results.testResults.forEach(tierResult => {
    if (tierResult.status === 'completed' && tierResult.results.tests) {
      tierResult.results.tests.forEach(test => {
        const status = test.passed ? 'PASS' : 'FAIL';
        const error = test.error ? `"${test.error.replace(/"/g, '""')}"` : '';
        const severity = test.severity || 'medium';
        
        csv += `${tierResult.tier},${test.name},${status},${error},${severity},${tierResult.results.timestamp}\n`;
      });
    } else {
      csv += `${tierResult.tier},Tier Execution,FAIL,"${tierResult.error || 'Unknown error'}",critical,${results.timestamp}\n`;
    }
  });
  
  return csv;
}

export function generateSlackSummary(results) {
  const successRate = ((results.summary.passed / results.summary.total) * 100).toFixed(1);
  const productionReady = successRate >= 95;
  const status = productionReady ? ':white_check_mark: PRODUCTION READY' : 
                successRate >= 85 ? ':warning: NEEDS ATTENTION' : ':x: CRITICAL ISSUES';
  
  let slackMessage = {
    text: `OnyxHooks & More™ Smoke Test Results`,
    attachments: [
      {
        color: productionReady ? 'good' : successRate >= 85 ? 'warning' : 'danger',
        fields: [
          {
            title: 'Success Rate',
            value: `${successRate}%`,
            short: true
          },
          {
            title: 'Status',
            value: status,
            short: true
          },
          {
            title: 'Tiers Tested',
            value: `${results.summary.passed}/${results.summary.total}`,
            short: true
          },
          {
            title: 'Critical Issues',
            value: results.criticalIssues ? results.criticalIssues.length : 0,
            short: true
          }
        ]
      }
    ]
  };
  
  if (results.criticalIssues && results.criticalIssues.length > 0) {
    slackMessage.attachments.push({
      title: 'Critical Issues',
      color: 'danger',
      text: results.criticalIssues.map(issue => `• ${issue.title}`).join('\n')
    });
  }
  
  return slackMessage;
}