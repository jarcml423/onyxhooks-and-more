import { useErrorHandler } from '@/components/ErrorBoundary';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    statusCode: number;
  };
  guidance?: string;
  upgradePrompt?: string;
  supportInfo?: string;
  tier?: string;
}

export interface ApiError extends Error {
  code?: string;
  statusCode?: number;
  tier?: string;
  guidance?: string;
  upgradePrompt?: string;
  supportInfo?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      throw this.createApiError('Failed to parse response', 'PARSE_ERROR', response.status);
    }

    if (!response.ok) {
      const error = this.createApiError(
        data?.error?.message || data?.message || `HTTP ${response.status}`,
        data?.error?.code || 'HTTP_ERROR',
        response.status,
        data?.tier,
        data?.guidance,
        data?.upgradePrompt,
        data?.supportInfo
      );
      throw error;
    }

    return data;
  }

  private createApiError(
    message: string,
    code: string,
    statusCode: number,
    tier?: string,
    guidance?: string,
    upgradePrompt?: string,
    supportInfo?: string
  ): ApiError {
    const error = new Error(message) as ApiError;
    error.code = code;
    error.statusCode = statusCode;
    error.tier = tier;
    error.guidance = guidance;
    error.upgradePrompt = upgradePrompt;
    error.supportInfo = supportInfo;
    return error;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw this.createApiError(
          'Network connection failed',
          'NETWORK_ERROR',
          0,
          undefined,
          'Check your internet connection. Service may be temporarily unavailable.'
        );
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient('/api');

// Specialized API functions with error handling
export const onyxHooksApi = {
  // Generate hooks with tier-appropriate error handling
  generateHooks: async (data: { industry: string; coachType: string; targetAudience?: string }) => {
    return apiClient.post('/generate-hooks', data);
  },

  // Generate offers with validation and error handling
  generateOffer: async (data: { niche: string; transformation: string; currentOffer?: string }) => {
    return apiClient.post('/generate-offer', data);
  },

  // Score quiz with comprehensive feedback
  scoreQuiz: async (data: { answers: Record<string, any> }) => {
    return apiClient.post('/score-quiz', data);
  },

  // Analyze funnel with tier-based insights
  analyzeFunnel: async (data: { url?: string; content?: string; toneOverride?: string }) => {
    return apiClient.post('/analyze-funnel', data);
  },

  // Test role switching for tier management
  switchRole: async (role: string) => {
    return apiClient.post('/test/switch-role', { role });
  },

  getCurrentRole: async () => {
    return apiClient.get('/test/current-role');
  }
};

// React hook for API calls with integrated error handling
export function useApiCall<T = any>(tier: string = 'free') {
  const { handleError } = useErrorHandler(tier);

  const makeRequest = async <R = T>(
    apiCall: () => Promise<R>,
    onSuccess?: (data: R) => void,
    onError?: (error: any) => void
  ): Promise<{ data?: R; error?: any }> => {
    try {
      const data = await apiCall();
      onSuccess?.(data);
      return { data };
    } catch (error) {
      const processedError = handleError(error);
      onError?.(processedError);
      return { error: processedError };
    }
  };

  return { makeRequest };
}

// Utility for retry logic with exponential backoff
export class RetryClient {
  constructor(
    private client: ApiClient,
    private maxRetries: number = 3,
    private baseDelay: number = 1000
  ) {}

  async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOptions?: {
      maxRetries?: number;
      shouldRetry?: (error: ApiError) => boolean;
    }
  ): Promise<T> {
    const maxRetries = retryOptions?.maxRetries ?? this.maxRetries;
    const shouldRetry = retryOptions?.shouldRetry ?? this.defaultShouldRetry;

    let lastError: ApiError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.client.request<T>(endpoint, options);
      } catch (error) {
        lastError = error as ApiError;

        if (attempt === maxRetries || !shouldRetry(lastError)) {
          throw lastError;
        }

        // Exponential backoff with jitter
        const delay = this.baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  private defaultShouldRetry(error: ApiError): boolean {
    // Retry on network errors and 5xx server errors
    if (error.code === 'NETWORK_ERROR') return true;
    if (error.statusCode && error.statusCode >= 500) return true;
    if (error.code === 'AI_SERVICE_ERROR') return true;
    return false;
  }
}

export const retryClient = new RetryClient(apiClient);

// Helper function for handling loading states
export function createLoadingState() {
  return {
    isLoading: false,
    error: null as any,
    setLoading: (loading: boolean) => ({ isLoading: loading }),
    setError: (error: any) => ({ error, isLoading: false }),
    setSuccess: (data: any) => ({ data, isLoading: false, error: null }),
    reset: () => ({ isLoading: false, error: null, data: null })
  };
}