export class TierTestHelper {
  constructor(browser, tierLevel) {
    this.browser = browser;
    this.tierLevel = tierLevel;
    this.baseUrl = 'http://localhost:5000';
  }

  async testPageLoad(page, path, testName) {
    const test = { name: testName, passed: false, error: null, severity: 'medium' };
    
    try {
      const response = await page.goto(`${this.baseUrl}${path}`, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      if (response.status() === 200) {
        test.passed = true;
        await page.waitForSelector('body', { timeout: 5000 });
      } else {
        test.error = `Page returned status ${response.status()}`;
        test.severity = 'high';
      }
    } catch (error) {
      test.error = error.message;
      test.severity = 'critical';
    }
    
    return test;
  }

  async testHookGeneration(page, options) {
    const test = { name: 'Hook Generation', passed: false, error: null, severity: 'high' };
    
    try {
      // Navigate to hook generation page
      await page.goto(`${this.baseUrl}/hooks`, { waitUntil: 'networkidle0' });
      
      // Fill in the form
      await page.waitForSelector('input[name="niche"]', { timeout: 5000 });
      await page.type('input[name="niche"]', options.niche);
      await page.type('input[name="transformation"]', options.transformation);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for results
      await page.waitForSelector('.hook-results', { timeout: 10000 });
      
      // Check if usage limit is displayed correctly
      if (options.expectedLimit !== 'unlimited') {
        const usageText = await page.$eval('.usage-counter', el => el.textContent);
        if (usageText.includes(options.expectedLimit.toString())) {
          test.passed = true;
        } else {
          test.error = `Expected limit ${options.expectedLimit}, found different usage counter`;
        }
      } else {
        test.passed = true;
      }
      
    } catch (error) {
      test.error = error.message;
      test.severity = 'critical';
    }
    
    return test;
  }

  async testDashboardAccess(page, expectedTier) {
    const test = { name: 'Dashboard Access', passed: false, error: null, severity: 'critical' };
    
    try {
      await page.goto(`${this.baseUrl}/dashboard`, { waitUntil: 'networkidle0' });
      
      // Check for tier-specific dashboard elements
      const tierElements = {
        free: '.free-tier-dashboard',
        starter: '.starter-tier-dashboard', 
        pro: '.pro-tier-dashboard',
        vault: '.vault-tier-dashboard'
      };
      
      const expectedSelector = tierElements[expectedTier];
      if (expectedSelector) {
        await page.waitForSelector(expectedSelector, { timeout: 5000 });
        test.passed = true;
      } else {
        test.error = `Unknown tier: ${expectedTier}`;
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testPremiumRestrictions(page) {
    const test = { name: 'Premium Restrictions', passed: false, error: null, severity: 'critical' };
    
    try {
      // Try to access premium features that should be blocked
      const restrictedPaths = ['/council', '/vault', '/admin'];
      let restrictionsWorking = true;
      
      for (const path of restrictedPaths) {
        const response = await page.goto(`${this.baseUrl}${path}`, { waitUntil: 'networkidle0' });
        
        // Should either redirect to login/upgrade or show access denied
        if (response.status() === 200) {
          const content = await page.content();
          if (!content.includes('upgrade') && !content.includes('access denied') && !content.includes('login')) {
            restrictionsWorking = false;
            test.error = `Unrestricted access to ${path}`;
            break;
          }
        }
      }
      
      test.passed = restrictionsWorking;
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testTierRestrictions(page, restrictedTiers) {
    const test = { name: 'Tier Restrictions', passed: false, error: null, severity: 'high' };
    
    try {
      let restrictionsWorking = true;
      
      for (const tier of restrictedTiers) {
        // Test tier-specific endpoints
        const response = await fetch(`${this.baseUrl}/api/${tier}/features`);
        if (response.status === 200) {
          restrictionsWorking = false;
          test.error = `Unauthorized access to ${tier} features`;
          break;
        }
      }
      
      test.passed = restrictionsWorking;
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testSignupFlow(page) {
    const test = { name: 'Signup Flow', passed: false, error: null, severity: 'medium' };
    
    try {
      await page.goto(`${this.baseUrl}/signup`, { waitUntil: 'networkidle0' });
      
      // Check if signup form is accessible
      await page.waitForSelector('form', { timeout: 5000 });
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      await page.waitForSelector('input[type="password"]', { timeout: 5000 });
      
      test.passed = true;
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testQuizAccess(page) {
    const test = { name: 'Quiz Access', passed: false, error: null, severity: 'medium' };
    
    try {
      await page.goto(`${this.baseUrl}/quiz`, { waitUntil: 'networkidle0' });
      
      // Check if quiz is accessible
      const hasQuizContent = await page.$('.quiz-container') || await page.$('.quiz-questions');
      if (hasQuizContent) {
        test.passed = true;
      } else {
        test.error = 'Quiz content not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testCSVExport(page) {
    const test = { name: 'CSV Export', passed: false, error: null, severity: 'medium' };
    
    try {
      // Look for CSV export button
      const exportButton = await page.$('button[data-testid="csv-export"]') || 
                          await page.$('button:contains("Export")') ||
                          await page.$('.export-csv');
      
      if (exportButton) {
        test.passed = true;
      } else {
        test.error = 'CSV export functionality not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testCouncilAccess(page) {
    const test = { name: 'Council Access', passed: false, error: null, severity: 'high' };
    
    try {
      await page.goto(`${this.baseUrl}/council`, { waitUntil: 'networkidle0' });
      
      // Check for council interface
      const councilInterface = await page.$('.council-interface') || 
                              await page.$('.ai-council') ||
                              await page.$('[data-testid="council"]');
      
      if (councilInterface) {
        test.passed = true;
      } else {
        test.error = 'Council interface not accessible';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testAnalyticsAccess(page, tierLevel) {
    const test = { name: 'Analytics Access', passed: false, error: null, severity: 'medium' };
    
    try {
      await page.goto(`${this.baseUrl}/analytics`, { waitUntil: 'networkidle0' });
      
      // Check for analytics dashboard
      const analyticsContent = await page.$('.analytics-dashboard') ||
                              await page.$('.usage-analytics') ||
                              await page.$('[data-testid="analytics"]');
      
      if (analyticsContent) {
        test.passed = true;
      } else {
        test.error = 'Analytics dashboard not accessible';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testSubscriptionManagement(page, tierLevel) {
    const test = { name: 'Subscription Management', passed: false, error: null, severity: 'medium' };
    
    try {
      // Look for billing/subscription section
      const billingSection = await page.$('.billing-section') ||
                            await page.$('.subscription-management') ||
                            await page.$('[data-testid="billing"]');
      
      if (billingSection) {
        test.passed = true;
      } else {
        test.error = 'Subscription management not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  // Additional methods for advanced tier testing
  async testCampaignBuilder(page) {
    const test = { name: 'Campaign Builder', passed: false, error: null, severity: 'medium' };
    
    try {
      const campaignBuilder = await page.$('.campaign-builder') ||
                             await page.$('[data-testid="campaign-builder"]');
      
      if (campaignBuilder) {
        test.passed = true;
      } else {
        test.error = 'Campaign builder not accessible';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testUsageAnalytics(page) {
    const test = { name: 'Usage Analytics', passed: false, error: null, severity: 'medium' };
    
    try {
      const usageAnalytics = await page.$('.usage-analytics') ||
                            await page.$('[data-testid="usage-analytics"]');
      
      if (usageAnalytics) {
        test.passed = true;
      } else {
        test.error = 'Usage analytics not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  // Vault-specific test methods
  async testVaultHookGeneration(page, options) {
    const test = { name: 'Vault Hook Generation', passed: false, error: null, severity: 'high' };
    
    try {
      await page.goto(`${this.baseUrl}/vault/hooks`, { waitUntil: 'networkidle0' });
      
      // Check for vault-specific features
      const vaultFeatures = await page.$$('.gladiator-name, .neuro-trigger, .psychology-framework');
      
      if (vaultFeatures.length > 0) {
        test.passed = true;
      } else {
        test.error = 'Vault-specific hook features not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testSwipeCopyAccess(page) {
    const test = { name: 'Swipe Copy Access', passed: false, error: null, severity: 'high' };
    
    try {
      await page.goto(`${this.baseUrl}/vault/swipe-copy`, { waitUntil: 'networkidle0' });
      
      const swipeCopyContent = await page.$('.swipe-copy-bank') ||
                              await page.$('[data-testid="swipe-copy"]');
      
      if (swipeCopyContent) {
        test.passed = true;
      } else {
        test.error = 'Swipe copy bank not accessible';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testAdminAccess(page) {
    const test = { name: 'Admin Access', passed: false, error: null, severity: 'critical' };
    
    try {
      await page.goto(`${this.baseUrl}/admin`, { waitUntil: 'networkidle0' });
      
      const adminDashboard = await page.$('.admin-dashboard') ||
                            await page.$('[data-testid="admin-dashboard"]');
      
      if (adminDashboard) {
        test.passed = true;
      } else {
        test.error = 'Admin dashboard not accessible';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testVaultAnalytics(page) {
    const test = { name: 'Vault Analytics', passed: false, error: null, severity: 'medium' };
    
    try {
      const vaultAnalytics = await page.$('.vault-analytics') ||
                            await page.$('[data-testid="vault-analytics"]');
      
      if (vaultAnalytics) {
        test.passed = true;
      } else {
        test.error = 'Vault analytics not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testCampaignIntelligence(page) {
    const test = { name: 'Campaign Intelligence', passed: false, error: null, severity: 'medium' };
    
    try {
      const campaignIntel = await page.$('.campaign-intelligence') ||
                           await page.$('[data-testid="campaign-intelligence"]');
      
      if (campaignIntel) {
        test.passed = true;
      } else {
        test.error = 'Campaign intelligence not accessible';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testSecurityDashboard(page) {
    const test = { name: 'Security Dashboard', passed: false, error: null, severity: 'medium' };
    
    try {
      const securityDashboard = await page.$('.security-dashboard') ||
                               await page.$('[data-testid="security-dashboard"]');
      
      if (securityDashboard) {
        test.passed = true;
      } else {
        test.error = 'Security dashboard not accessible';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testUTMAnalytics(page) {
    const test = { name: 'UTM Analytics', passed: false, error: null, severity: 'medium' };
    
    try {
      const utmAnalytics = await page.$('.utm-analytics') ||
                          await page.$('[data-testid="utm-analytics"]');
      
      if (utmAnalytics) {
        test.passed = true;
      } else {
        test.error = 'UTM analytics not accessible';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testVaultExport(page) {
    const test = { name: 'Vault Export', passed: false, error: null, severity: 'medium' };
    
    try {
      const exportButton = await page.$('button[data-testid="vault-export"]') ||
                           await page.$('.vault-export-btn');
      
      if (exportButton) {
        test.passed = true;
      } else {
        test.error = 'Vault export functionality not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }
}