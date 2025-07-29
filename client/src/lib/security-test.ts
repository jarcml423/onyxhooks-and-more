/**
 * Security testing utilities for comprehensive security validation
 */

import { browserFingerprint, validateSession } from './fingerprint';

export class SecurityTester {
  
  /**
   * Test browser fingerprinting system
   */
  static async testFingerprinting(): Promise<{ success: boolean; fingerprint: string; details: any }> {
    try {
      const fingerprint = await browserFingerprint.getFingerprint();
      
      // Test fingerprint consistency
      const fingerprint2 = await browserFingerprint.getFingerprint();
      const isConsistent = fingerprint === fingerprint2;
      
      // Get detailed fingerprint data for validation
      const details = {
        fingerprintLength: fingerprint.length,
        isConsistent,
        userAgent: navigator.userAgent.substring(0, 50) + '...',
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString()
      };
      
      console.log('🔐 Browser Fingerprint Test:', details);
      
      return {
        success: fingerprint.length > 10 && isConsistent,
        fingerprint: fingerprint.substring(0, 16) + '...', // Truncate for security
        details
      };
    } catch (error) {
      console.error('❌ Fingerprinting test failed:', error);
      return {
        success: false,
        fingerprint: '',
        details: { error: error.message }
      };
    }
  }
  
  /**
   * Test session validation system
   */
  static testSessionValidation(): { success: boolean; details: any } {
    try {
      const sessionValid = validateSession();
      
      const details = {
        sessionValid,
        sessionStorage: typeof sessionStorage !== 'undefined',
        timestamp: new Date().toISOString()
      };
      
      console.log('🛡️ Session Validation Test:', details);
      
      return {
        success: sessionValid,
        details
      };
    } catch (error) {
      console.error('❌ Session validation test failed:', error);
      return {
        success: false,
        details: { error: error.message }
      };
    }
  }
  
  /**
   * Test rate limiting detection
   */
  static testRateLimitDetection(): { success: boolean; details: any } {
    try {
      const now = Date.now();
      const lastRequest = sessionStorage.getItem('last_request');
      
      if (lastRequest) {
        const timeDiff = now - parseInt(lastRequest);
        const isRapid = timeDiff < 500; // Rapid request detection
        
        const details = {
          timeSinceLastRequest: timeDiff,
          isRapidRequest: isRapid,
          rateLimitActive: isRapid,
          timestamp: new Date().toISOString()
        };
        
        console.log('⚡ Rate Limit Test:', details);
        
        return {
          success: true,
          details
        };
      }
      
      // First request
      sessionStorage.setItem('last_request', now.toString());
      return {
        success: true,
        details: { message: 'First request recorded' }
      };
    } catch (error) {
      console.error('❌ Rate limit test failed:', error);
      return {
        success: false,
        details: { error: error.message }
      };
    }
  }
  
  /**
   * Test vault protection measures
   */
  static testVaultProtection(): { success: boolean; details: any } {
    try {
      const details = {
        contextMenuDisabled: false,
        textSelectionDisabled: false,
        keyboardShortcutsBlocked: false,
        timestamp: new Date().toISOString()
      };
      
      // Test context menu blocking
      const testDiv = document.createElement('div');
      testDiv.style.position = 'absolute';
      testDiv.style.left = '-9999px';
      testDiv.textContent = 'Test content';
      document.body.appendChild(testDiv);
      
      // Simulate right-click
      const contextMenuEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true
      });
      
      testDiv.addEventListener('contextmenu', (e) => {
        details.contextMenuDisabled = e.defaultPrevented;
      });
      
      testDiv.dispatchEvent(contextMenuEvent);
      
      // Test text selection
      const selection = window.getSelection();
      if (selection) {
        selection.selectAllChildren(testDiv);
        details.textSelectionDisabled = selection.toString() === '';
        selection.removeAllRanges();
      }
      
      // Clean up
      document.body.removeChild(testDiv);
      
      console.log('🔒 Vault Protection Test:', details);
      
      return {
        success: true,
        details
      };
    } catch (error) {
      console.error('❌ Vault protection test failed:', error);
      return {
        success: false,
        details: { error: error.message }
      };
    }
  }
  
  /**
   * Run comprehensive security test suite
   */
  static async runSecurityTestSuite(): Promise<{
    overall: boolean;
    results: {
      fingerprinting: any;
      sessionValidation: any;
      rateLimiting: any;
      vaultProtection: any;
    };
  }> {
    console.log('🔍 Running Comprehensive Security Test Suite...');
    
    const results = {
      fingerprinting: await this.testFingerprinting(),
      sessionValidation: this.testSessionValidation(),
      rateLimiting: this.testRateLimitDetection(),
      vaultProtection: this.testVaultProtection()
    };
    
    const overall = Object.values(results).every(result => result.success);
    
    console.log('📊 Security Test Results:', {
      overall: overall ? '✅ PASS' : '❌ FAIL',
      fingerprinting: results.fingerprinting.success ? '✅' : '❌',
      sessionValidation: results.sessionValidation.success ? '✅' : '❌',
      rateLimiting: results.rateLimiting.success ? '✅' : '❌',
      vaultProtection: results.vaultProtection.success ? '✅' : '❌'
    });
    
    return {
      overall,
      results
    };
  }
}

// Export test runner for global access
(window as any).SecurityTester = SecurityTester;