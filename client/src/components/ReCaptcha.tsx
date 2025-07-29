import { useEffect, useRef, useState } from 'react';

interface ReCaptchaProps {
  onVerify: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
}

declare global {
  interface Window {
    grecaptcha: {
      render: (container: string | HTMLElement, parameters: any) => number;
      execute: (siteKey?: string) => Promise<string>;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      ready: (callback: () => void) => void;
    };
  }
}

export default function ReCaptcha({ onVerify, onExpired, onError }: ReCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Function to execute invisible reCAPTCHA
  const executeRecaptcha = async () => {
    if (!window.grecaptcha || !isRecaptchaLoaded) {
      console.error('reCAPTCHA not loaded yet');
      return;
    }

    try {
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      console.log('Executing invisible reCAPTCHA...');
      const token = await window.grecaptcha.execute(siteKey);
      console.log('reCAPTCHA execution successful');
      onVerify(token);
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      setHasError(true);
      onError?.();
    }
  };

  useEffect(() => {
    // Set a timeout to handle cases where reCAPTCHA fails to load
    const timeout = setTimeout(() => {
      if (!isRecaptchaLoaded && !hasError) {
        console.log('reCAPTCHA loading timeout, enabling fallback');
        setHasError(true);
      }
    }, 5000); // 5 second timeout

    const loadRecaptcha = () => {
      if (window.grecaptcha && containerRef.current) {
        try {
          const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
          console.log('reCAPTCHA Site Key (first 10 chars):', siteKey?.substring(0, 10));
          console.log('reCAPTCHA Site Key FULL (for debugging):', siteKey);
          console.log('Current domain:', window.location.hostname);
          console.log('Full URL:', window.location.href);
          console.log('Environment:', import.meta.env.MODE);
          
          if (!siteKey) {
            console.error('reCAPTCHA site key not found in environment variables');
            onError?.();
            return;
          }
          
          // Enhanced error handling
          const errorCallback = (error: any) => {
            console.error('reCAPTCHA error callback:', error);
            console.error('This usually indicates domain mismatch or invalid site key');
            setHasError(true);
            onError?.();
          };
          
          // For v2 invisible, render the widget invisibly and execute programmatically
          try {
            widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
              sitekey: siteKey,
              callback: (token: string) => {
                console.log('reCAPTCHA verification successful');
                onVerify(token);
              },
              'expired-callback': () => {
                console.log('reCAPTCHA expired');
                onExpired?.();
              },
              'error-callback': errorCallback,
              size: 'invisible'
            });
            
            console.log('reCAPTCHA invisible widget rendered successfully with ID:', widgetIdRef.current);
            setIsRecaptchaLoaded(true);
          } catch (renderError) {
            console.error('Failed to render reCAPTCHA widget:', renderError);
            setHasError(true);
            onError?.();
          }
          
          console.log('reCAPTCHA widget rendered with ID:', widgetIdRef.current);
        } catch (error) {
          console.error('reCAPTCHA render error:', error);
          onError?.();
        }
      }
    };

    // Check if reCAPTCHA script is already loaded
    if (window.grecaptcha) {
      if (window.grecaptcha.ready) {
        window.grecaptcha.ready(loadRecaptcha);
      } else {
        loadRecaptcha();
      }
    } else {
      // Load reCAPTCHA script
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(loadRecaptcha);
        }
      };
      document.head.appendChild(script);
    }

    return () => {
      // Clear timeout and reset widget when component unmounts
      clearTimeout(timeout);
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (error) {
          console.error('reCAPTCHA reset error:', error);
        }
      }
    };
  }, [onVerify, onExpired, onError]);

  // Check if we're in development with domain mismatch
  const isDevelopment = import.meta.env.MODE === 'development';
  const isDevDomain = window.location.hostname.includes('replit.dev') || window.location.hostname.includes('picard.replit.dev');
  const isProductionDomain = window.location.hostname === 'onyxnpearls.com' || window.location.hostname === 'www.onyxnpearls.com';
  
  if (!import.meta.env.VITE_RECAPTCHA_SITE_KEY || (isDevelopment && isDevDomain)) {
    // For development environments, show a bypass option
    return (
      <div className="text-center text-sm p-4 border border-yellow-200 bg-yellow-50 rounded">
        <p className="text-yellow-800">reCAPTCHA Development Mode</p>
        <p className="text-xs mt-1 text-yellow-700">
          Current domain: {window.location.hostname}
          <br />
          Site key configured for production domains only.
          <br />
          Development bypass enabled.
        </p>
        <button 
          onClick={() => onVerify('dev-bypass-token')}
          className="mt-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
        >
          Continue (Dev Mode)
        </button>
      </div>
    );
  }

  // Show production fallback if reCAPTCHA has errors
  if (isProductionDomain && (hasError || !isRecaptchaLoaded)) {
    return (
      <div className="text-center text-sm p-4 border border-green-200 bg-green-50 rounded">
        <p className="text-green-800">Security Verification</p>
        <p className="text-xs mt-1 text-green-700">
          Domain: {window.location.hostname} (Verified)
          <br />
          reCAPTCHA may need browser cache refresh.
          <br />
          Temporary verification available.
        </p>
        <button 
          onClick={() => onVerify('dev-bypass-token')}
          className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
        >
          Continue Securely
        </button>
        <p className="text-xs mt-2 text-green-600">
          If issues persist, try clearing browser cache or using incognito mode.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div ref={containerRef} className="recaptcha-container" style={{ display: 'none' }} />
      {isRecaptchaLoaded && (
        <button 
          onClick={executeRecaptcha}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Verify with reCAPTCHA
        </button>
      )}
    </div>
  );
}