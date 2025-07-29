/**
 * Client-side fingerprinting for enhanced security
 * Generates a unique browser fingerprint based on multiple factors
 */

interface FingerprintData {
  userAgent: string;
  language: string;
  platform: string;
  screen: string;
  timezone: string;
  webgl: string;
  canvas: string;
  fonts: string[];
  plugins: string[];
}

class BrowserFingerprint {
  private static instance: BrowserFingerprint;
  private fingerprint: string | null = null;

  static getInstance(): BrowserFingerprint {
    if (!BrowserFingerprint.instance) {
      BrowserFingerprint.instance = new BrowserFingerprint();
    }
    return BrowserFingerprint.instance;
  }

  /**
   * Generate a comprehensive browser fingerprint
   */
  async generateFingerprint(): Promise<string> {
    if (this.fingerprint) {
      return this.fingerprint;
    }

    const data: FingerprintData = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      webgl: this.getWebGLFingerprint(),
      canvas: this.getCanvasFingerprint(),
      fonts: await this.getAvailableFonts(),
      plugins: this.getPluginFingerprint()
    };

    // Create hash from combined data
    this.fingerprint = await this.hashData(JSON.stringify(data));
    return this.fingerprint;
  }

  /**
   * Get WebGL renderer fingerprint
   */
  private getWebGLFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return 'no-webgl';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return 'no-debug-info';
      
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      
      return `${vendor}-${renderer}`;
    } catch (e) {
      return 'webgl-error';
    }
  }

  /**
   * Generate canvas fingerprint
   */
  private getCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return 'no-canvas';
      
      // Draw a unique pattern
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('OnyxHooks Security 🔒', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Canvas fingerprint', 4, 45);
      
      return canvas.toDataURL();
    } catch (e) {
      return 'canvas-error';
    }
  }

  /**
   * Detect available fonts
   */
  private async getAvailableFonts(): Promise<string[]> {
    const testFonts = [
      'Arial', 'Helvetica', 'Times', 'Courier', 'Verdana', 'Georgia', 'Palatino',
      'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
    ];

    const availableFonts: string[] = [];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const baseFonts = ['monospace', 'sans-serif', 'serif'];

    // Create a test element
    const span = document.createElement('span');
    span.style.fontSize = testSize;
    span.style.position = 'absolute';
    span.style.left = '-9999px';
    span.style.top = '-9999px';
    span.style.visibility = 'hidden';
    span.innerHTML = testString;
    document.body.appendChild(span);

    try {
      // Get baseline measurements
      const baseMeasurements: Record<string, { width: number; height: number }> = {};
      
      for (const baseFont of baseFonts) {
        span.style.fontFamily = baseFont;
        baseMeasurements[baseFont] = {
          width: span.offsetWidth,
          height: span.offsetHeight
        };
      }

      // Test each font
      for (const font of testFonts) {
        let detected = false;
        
        for (const baseFont of baseFonts) {
          span.style.fontFamily = `${font}, ${baseFont}`;
          const measurement = {
            width: span.offsetWidth,
            height: span.offsetHeight
          };
          
          if (measurement.width !== baseMeasurements[baseFont].width || 
              measurement.height !== baseMeasurements[baseFont].height) {
            detected = true;
            break;
          }
        }
        
        if (detected) {
          availableFonts.push(font);
        }
      }
    } finally {
      document.body.removeChild(span);
    }

    return availableFonts;
  }

  /**
   * Get plugin fingerprint
   */
  private getPluginFingerprint(): string[] {
    const plugins: string[] = [];
    
    for (let i = 0; i < navigator.plugins.length; i++) {
      const plugin = navigator.plugins[i];
      plugins.push(`${plugin.name}-${plugin.version || 'unknown'}`);
    }
    
    return plugins;
  }

  /**
   * Hash data using Web Crypto API
   */
  private async hashData(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      // Fallback to simple hash
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(16);
    }
  }

  /**
   * Get stored fingerprint or generate new one
   */
  async getFingerprint(): Promise<string> {
    return await this.generateFingerprint();
  }

  /**
   * Validate fingerprint consistency
   */
  async validateFingerprint(serverFingerprint: string): Promise<boolean> {
    const currentFingerprint = await this.getFingerprint();
    return currentFingerprint === serverFingerprint;
  }
}

export const browserFingerprint = BrowserFingerprint.getInstance();

/**
 * Generate and attach fingerprint to requests
 */
export async function attachFingerprint(requestData: any): Promise<any> {
  const fingerprint = await browserFingerprint.getFingerprint();
  return {
    ...requestData,
    browserFingerprint: fingerprint
  };
}

/**
 * Enhanced session validation
 */
export function validateSession(): boolean {
  try {
    // Check for suspicious behavior patterns
    const sessionStart = sessionStorage.getItem('session_start');
    if (!sessionStart) {
      sessionStorage.setItem('session_start', Date.now().toString());
      return true;
    }

    // Check for rapid requests (potential bot behavior)
    const lastRequest = sessionStorage.getItem('last_request');
    const now = Date.now();
    
    if (lastRequest) {
      const timeDiff = now - parseInt(lastRequest);
      if (timeDiff < 500) { // Less than 500ms between requests
        console.warn('Rapid request detected');
        return false;
      }
    }
    
    sessionStorage.setItem('last_request', now.toString());
    return true;
  } catch (e) {
    return true; // Allow if sessionStorage is not available
  }
}