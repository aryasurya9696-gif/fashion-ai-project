
# API Endpoints Configuration

This document outlines the API endpoints needed for N8N chatbot integration, including webhook configurations, authentication, and response handling.

## 1. Webhook Endpoints Overview

### Base Configuration

```typescript
// N8N Webhook Base Configuration
const N8N_CONFIG = {
  baseUrl: process.env.N8N_WEBHOOK_URL || 'https://your-n8n-instance.com',
  apiKey: process.env.N8N_API_KEY,
  timeout: 30000, // 30 seconds
  retryAttempts: 3
};

// Webhook endpoints
const WEBHOOK_ENDPOINTS = {
  imageGeneration: '/webhook/generate-outfit-image',
  styleAnalysis: '/webhook/analyze-style',
  outfitRecommendation: '/webhook/recommend-outfit',
  saveProfile: '/webhook/save-style-profile',
  saveRecommendations: '/webhook/save-recommendations'
};
```

## 2. API Client Implementation

### N8N API Client

```typescript
// src/lib/n8n-client.ts
interface N8NRequest {
  endpoint: string;
  payload: any;
  userId?: string;
  sessionId?: string;
}

interface N8NResponse {
  success: boolean;
  message: string;
  data?: any;
  images?: string[];
  suggestedActions?: any[];
  error?: {
    message: string;
    code?: string;
  };
}

class N8NClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
    this.apiKey = process.env.NEXT_PUBLIC_N8N_API_KEY || '';
    this.timeout = 30000;
  }

  async triggerWorkflow(request: N8NRequest): Promise<N8NResponse> {
    const { endpoint, payload, userId, sessionId } = request;
    
    try {
      // Add metadata to payload
      const enhancedPayload = {
        ...payload,
        userId: userId || this.generateUserId(),
        sessionId: sessionId || this.generateSessionId(),
        timestamp: new Date().toISOString(),
        source: 'chatbot'
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'User-Agent': 'FashionAI-Chatbot/1.0'
        },
        body: JSON.stringify(enhancedPayload),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // Validate response structure
      if (!this.isValidN8NResponse(result)) {
        throw new Error('Invalid response format from N8N');
      }

      return result;

    } catch (error) {
      console.error('N8N API Error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  private isValidN8NResponse(response: any): response is N8NResponse {
    return (
      typeof response === 'object' &&
      typeof response.success === 'boolean' &&
      typeof response.message === 'string'
    );
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Specific workflow methods
  async generateOutfitImage(prompt: string, options?: {
    style?: string;
    aspectRatio?: string;
    userId?: string;
  }): Promise<N8NResponse> {
    return this.triggerWorkflow({
      endpoint: WEBHOOK_ENDPOINTS.imageGeneration,
      payload: {
        prompt,
        style: options?.style || 'realistic',
        aspectRatio: options?.aspectRatio || '1:1'
      },
      userId: options?.userId
    });
  }

  async analyzeStyle(data: {
    prompt?: string;
    images?: string[];
    userPreferences?: any;
    userId?: string;
  }): Promise<N8NResponse> {
    return this.triggerWorkflow({
      endpoint: WEBHOOK_ENDPOINTS.styleAnalysis,
      payload: data,
      userId: data.userId
    });
  }

  async getOutfitRecommendations(criteria: {
    occasion?: string;
    weather?: string;
    bodyType?: string;
    colorPreferences?: string[];
    budget?: string;
    stylePreferences?: string[];
    userId?: string;
  }): Promise<N8NResponse> {
    return this.triggerWorkflow({
      endpoint: WEBHOOK_ENDPOINTS.outfitRecommendation,
      payload: criteria,
      userId: criteria.userId
    });
  }
}

export const n8nClient = new N8NClient();
```

## 3. React Hook for N8N Integration

### useN8N Hook

```typescript
// src/hooks/useN8N.ts
import { useState, useCallback } from 'react';
import { n8nClient, N8NResponse } from '@/lib/n8n-client';
import { toast } from 'sonner';

interface UseN8NOptions {
  onSuccess?: (response: N8NResponse) => void;
  onError?: (error: Error) => void;
  showToasts?: boolean;
}

export const useN8N = (options: UseN8NOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastResponse, setLastResponse] = useState<N8NResponse | null>(null);

  const { onSuccess, onError, showToasts = true } = options;

  const executeWorkflow = useCallback(async (
    workflowFn: () => Promise<N8NResponse>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      if (showToasts) {
        toast.info('Processing your request...');
      }

      const response = await workflowFn();
      setLastResponse(response);

      if (response.success) {
        if (showToasts) {
          toast.success('Request completed successfully!');
        }
        onSuccess?.(response);
      } else {
        throw new Error(response.error?.message || 'Workflow failed');
      }

      return response;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      if (showToasts) {
        toast.error(error.message);
      }
      
      onError?.(error);
      throw error;

    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError, showToasts]);

  // Specific workflow methods
  const generateImage = useCallback((prompt: string, options?: any) => {
    return executeWorkflow(() => 
      n8nClient.generateOutfitImage(prompt, options)
    );
  }, [executeWorkflow]);

  const analyzeStyle = useCallback((data: any) => {
    return executeWorkflow(() => 
      n8nClient.analyzeStyle(data)
    );
  }, [executeWorkflow]);

  const getRecommendations = useCallback((criteria: any) => {
    return executeWorkflow(() => 
      n8nClient.getOutfitRecommendations(criteria)
    );
  }, [executeWorkflow]);

  return {
    isLoading,
    error,
    lastResponse,
    generateImage,
    analyzeStyle,
    getRecommendations,
    executeWorkflow
  };
};
```

## 4. Chatbot Integration Component

### N8N Action Buttons

```typescript
// src/components/N8NActionButtons.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Image, 
  Search, 
  ShoppingBag,
  Loader2 
} from 'lucide-react';
import { useN8N } from '@/hooks/useN8N';

interface N8NActionButtonsProps {
  onResponse: (response: any) => void;
  userContext?: {
    userId: string;
    preferences?: any;
    chatHistory?: any[];
  };
}

export default function N8NActionButtons({ 
  onResponse, 
  userContext 
}: N8NActionButtonsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  
  const { generateImage, analyzeStyle, getRecommendations, isLoading } = useN8N({
    onSuccess: (response) => {
      onResponse(response);
      setActiveAction(null);
    },
    onError: (error) => {
      console.error('N8N Action Error:', error);
      setActiveAction(null);
    }
  });

  const handleGenerateImage = async () => {
    setActiveAction('generate');
    
    // Get context from recent chat messages
    const recentContext = userContext?.chatHistory
      ?.slice(-3)
      .map(msg => msg.content)
      .join(' ') || '';
    
    const prompt = `Generate a stylish outfit image based on: ${recentContext}`;
    
    await generateImage(prompt, {
      userId: userContext?.userId,
      style: userContext?.preferences?.style || 'realistic'
    });
  };

  const handleAnalyzeStyle = async () => {
    setActiveAction('analyze');
    
    await analyzeStyle({
      prompt: 'Analyze my fashion style based on our conversation',
      userPreferences: userContext?.preferences,
      userId: userContext?.userId
    });
  };

  const handleGetRecommendations = async () => {
    setActiveAction('recommend');
    
    await getRecommendations({
      occasion: 'general',
      budget: 'moderate',
      stylePreferences: userContext?.preferences?.styles || [],
      userId: userContext?.userId
    });
  };

  const actionButtons = [
    {
      id: 'generate',
      label: 'Generate Outfit Image',
      icon: Image,
      action: handleGenerateImage,
      description: 'Create AI-generated outfit images'
    },
    {
      id: 'analyze',
      label: 'Analyze My Style',
      icon: Search,
      action: handleAnalyzeStyle,
      description: 'Get personalized style analysis'
    },
    {
      id: 'recommend',
      label: 'Get Recommendations',
      icon: ShoppingBag,
      action: handleGetRecommendations,
      description: 'Receive outfit suggestions'
    }
  ];

  return (
    <div className="n8n-actions space-y-3">
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        AI-Powered Actions
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {actionButtons.map((button) => {
          const Icon = button.icon;
          const isActive = activeAction === button.id;
          const isDisabled = isLoading && !isActive;
          
          return (
            <Button
              key={button.id}
              onClick={button.action}
              disabled={isDisabled}
              variant={isActive ? "default" : "outline"}
              className={`justify-start h-auto p-3 ${
                isActive ? 'btn-gradient' : 'glass border-primary/30'
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  {isActive ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium">{button.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {button.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
```

## 5. Error Handling & Retry Logic

### Robust Error Handling

```typescript
// src/lib/n8n-error-handler.ts
export class N8NError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'N8NError';
  }
}

export const handleN8NError = (error: any): N8NError => {
  if (error instanceof N8NError) {
    return error;
  }

  // Network errors
  if (error.name === 'AbortError') {
    return new N8NError(
      'Request timeout. Please try again.',
      'TIMEOUT',
      408,
      true
    );
  }

  // HTTP errors
  if (error.status) {
    const retryable = error.status >= 500 || error.status === 429;
    return new N8NError(
      `Server error: ${error.statusText}`,
      'HTTP_ERROR',
      error.status,
      retryable
    );
  }

  // Generic errors
  return new N8NError(
    error.message || 'Unknown error occurred',
    'UNKNOWN',
    500,
    false
  );
};

// Retry logic
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      const n8nError = handleN8NError(lastError);
      
      // Don't retry if not retryable or last attempt
      if (!n8nError.retryable || attempt === maxAttempts) {
        throw n8nError;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
};
```

## 6. Environment Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com
NEXT_PUBLIC_N8N_API_KEY=your_n8n_api_key
NEXT_PUBLIC_N8N_TIMEOUT=30000
NEXT_PUBLIC_N8N_RETRY_ATTEMPTS=3
```

### Configuration Validation

```typescript
// src/lib/n8n-config.ts
interface N8NConfig {
  webhookUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
}

export const validateN8NConfig = (): N8NConfig => {
  const config = {
    webhookUrl: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL,
    apiKey: process.env.NEXT_PUBLIC_N8N_API_KEY,
    timeout: parseInt(process.env.NEXT_PUBLIC_N8N_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.NEXT_PUBLIC_N8N_RETRY_ATTEMPTS || '3')
  };

  if (!config.webhookUrl) {
    throw new Error('N8N_WEBHOOK_URL is required');
  }

  if (!config.apiKey) {
    throw new Error('N8N_API_KEY is required');
  }

  return config as N8NConfig;
};
```

## Next Steps

1. [Test the Integration](./testing-guide.md)
2. [Deploy to Production](./deployment-guide.md)
3. [Monitor Performance](./monitoring-guide.md)
4. [Troubleshoot Issues](./troubleshooting.md)
