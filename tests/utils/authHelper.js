export class AuthHelper {
  constructor(browser) {
    this.browser = browser;
    this.baseUrl = 'http://localhost:5000';
  }

  async testLogin(page, credentials) {
    const test = { 
      name: 'Authentication', 
      passed: false, 
      error: null, 
      severity: 'critical',
      tier: credentials.expectedTier 
    };
    
    try {
      // Navigate to login page
      await page.goto(`${this.baseUrl}/login`, { waitUntil: 'networkidle0' });
      
      // Wait for login form
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      await page.waitForSelector('input[type="password"]', { timeout: 5000 });
      
      // Clear and fill login form
      await page.click('input[type="email"]', { clickCount: 3 });
      await page.type('input[type="email"]', credentials.email);
      
      await page.click('input[type="password"]', { clickCount: 3 });
      await page.type('input[type="password"]', credentials.password);
      
      // Submit form
      const submitButton = await page.$('button[type="submit"]') || 
                          await page.$('button:contains("Login")') ||
                          await page.$('button:contains("Sign In")');
      
      if (submitButton) {
        await submitButton.click();
      } else {
        throw new Error('Login submit button not found');
      }
      
      // Wait for redirect or dashboard load
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
      
      // Verify successful login by checking for dashboard or user-specific content
      const currentUrl = page.url();
      const isLoggedIn = currentUrl.includes('/dashboard') || 
                        currentUrl.includes('/hooks') ||
                        await page.$('[data-testid="user-menu"]') ||
                        await page.$('.user-dashboard') ||
                        await page.$('.logout-button');
      
      if (isLoggedIn) {
        // Verify tier-specific access
        const tierVerified = await this.verifyTierAccess(page, credentials.expectedTier);
        if (tierVerified) {
          test.passed = true;
        } else {
          test.error = `Login successful but tier access verification failed for ${credentials.expectedTier}`;
        }
      } else {
        test.error = 'Login failed - no redirect to authenticated area';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async verifyTierAccess(page, expectedTier) {
    try {
      // Check for tier-specific indicators in the UI
      const tierIndicators = {
        free: ['.free-tier-badge', '[data-tier="free"]', '.upgrade-prompt'],
        starter: ['.starter-tier-badge', '[data-tier="starter"]', '.starter-dashboard'],
        pro: ['.pro-tier-badge', '[data-tier="pro"]', '.pro-dashboard'],
        vault: ['.vault-tier-badge', '[data-tier="vault"]', '.vault-dashboard', '.admin-access']
      };
      
      const indicators = tierIndicators[expectedTier] || [];
      
      for (const indicator of indicators) {
        const element = await page.$(indicator);
        if (element) {
          return true;
        }
      }
      
      // Alternative: Check page content for tier mentions
      const pageContent = await page.content();
      const tierMentions = [
        expectedTier.toLowerCase(),
        expectedTier.charAt(0).toUpperCase() + expectedTier.slice(1),
        expectedTier.toUpperCase()
      ];
      
      return tierMentions.some(mention => pageContent.includes(mention));
      
    } catch (error) {
      console.error('Error verifying tier access:', error);
      return false;
    }
  }

  async testLogout(page) {
    const test = { name: 'Logout', passed: false, error: null, severity: 'medium' };
    
    try {
      // Look for logout button or user menu
      const logoutButton = await page.$('button:contains("Logout")') ||
                          await page.$('button:contains("Sign Out")') ||
                          await page.$('[data-testid="logout"]');
      
      if (logoutButton) {
        await logoutButton.click();
        
        // Wait for redirect to login or landing page
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 5000 });
        
        // Verify logout by checking current URL or page content
        const currentUrl = page.url();
        const isLoggedOut = currentUrl.includes('/login') || 
                           currentUrl === this.baseUrl ||
                           currentUrl.includes('/landing');
        
        if (isLoggedOut) {
          test.passed = true;
        } else {
          test.error = 'Logout did not redirect to expected page';
        }
      } else {
        test.error = 'Logout button not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testSessionPersistence(page, credentials) {
    const test = { name: 'Session Persistence', passed: false, error: null, severity: 'medium' };
    
    try {
      // Login first
      const loginTest = await this.testLogin(page, credentials);
      if (!loginTest.passed) {
        test.error = 'Cannot test session persistence - login failed';
        return test;
      }
      
      // Navigate to different page
      await page.goto(`${this.baseUrl}/dashboard`, { waitUntil: 'networkidle0' });
      
      // Refresh page to test session persistence
      await page.reload({ waitUntil: 'networkidle0' });
      
      // Check if still logged in
      const stillLoggedIn = !page.url().includes('/login') &&
                           (await page.$('[data-testid="user-menu"]') ||
                            await page.$('.user-dashboard') ||
                            await page.$('.logout-button'));
      
      if (stillLoggedIn) {
        test.passed = true;
      } else {
        test.error = 'Session not persisted after page refresh';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testUnauthorizedAccess(page, protectedPath) {
    const test = { name: 'Unauthorized Access Protection', passed: false, error: null, severity: 'critical' };
    
    try {
      // Ensure user is logged out
      await this.ensureLoggedOut(page);
      
      // Try to access protected path
      await page.goto(`${this.baseUrl}${protectedPath}`, { waitUntil: 'networkidle0' });
      
      // Should redirect to login or show access denied
      const currentUrl = page.url();
      const isProtected = currentUrl.includes('/login') ||
                         currentUrl.includes('/signup') ||
                         await page.$('.access-denied') ||
                         await page.$('.unauthorized');
      
      if (isProtected) {
        test.passed = true;
      } else {
        test.error = `Unauthorized access allowed to ${protectedPath}`;
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async ensureLoggedOut(page) {
    try {
      // Clear cookies and localStorage
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      
      const cookies = await page.cookies();
      if (cookies.length > 0) {
        await page.deleteCookie(...cookies);
      }
      
      // Navigate to login page to ensure logged out state
      await page.goto(`${this.baseUrl}/login`, { waitUntil: 'networkidle0' });
      
    } catch (error) {
      console.error('Error ensuring logged out state:', error);
    }
  }

  async testPasswordValidation(page) {
    const test = { name: 'Password Validation', passed: false, error: null, severity: 'medium' };
    
    try {
      await page.goto(`${this.baseUrl}/signup`, { waitUntil: 'networkidle0' });
      
      // Test weak password
      await page.type('input[type="email"]', 'test@example.com');
      await page.type('input[type="password"]', '123');
      
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        
        // Should show validation error
        const hasError = await page.$('.password-error') ||
                        await page.$('.validation-error') ||
                        await page.$('[data-testid="password-error"]');
        
        if (hasError) {
          test.passed = true;
        } else {
          test.error = 'Password validation not working';
        }
      } else {
        test.error = 'Submit button not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }

  async testEmailValidation(page) {
    const test = { name: 'Email Validation', passed: false, error: null, severity: 'medium' };
    
    try {
      await page.goto(`${this.baseUrl}/signup`, { waitUntil: 'networkidle0' });
      
      // Test invalid email
      await page.type('input[type="email"]', 'invalid-email');
      await page.type('input[type="password"]', 'ValidPassword123!');
      
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        
        // Should show validation error
        const hasError = await page.$('.email-error') ||
                        await page.$('.validation-error') ||
                        await page.$('[data-testid="email-error"]');
        
        if (hasError) {
          test.passed = true;
        } else {
          test.error = 'Email validation not working';
        }
      } else {
        test.error = 'Submit button not found';
      }
      
    } catch (error) {
      test.error = error.message;
    }
    
    return test;
  }
}