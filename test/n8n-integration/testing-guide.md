
# N8N Integration Testing Guide

This comprehensive guide covers testing strategies for your N8N chatbot integration, including unit tests, integration tests, and end-to-end testing scenarios.

## 1. Testing Environment Setup

### Test Configuration

```typescript
// src/lib/test-config.ts
export const TEST_CONFIG = {
  n8n: {
    baseUrl: process.env.TEST_N8N_URL || 'http://localhost:5678',
    apiKey: process.env.TEST_N8N_API_KEY || 'test-api-key',
    timeout: 5000 // Shorter timeout for tests
  },
  mock: {
    enabled: process.env.NODE_ENV === 'test',
    responses: {
      imageGeneration: {
        success: true,
        message: 'Test image generated successfully',
        images: ['https://example.com/test-image.jpg']
      },
      styleAnalysis: {
        success: true,
        message: 'Test style analysis completed',
        analysis: { style: 'minimalist', confidence: 0.9 }
      }
    }
  }
};
```

### Mock N8N Client

```typescript
// src/lib/__mocks__/n8n-client.ts
import { N8NResponse } from '../n8n-client';
import { TEST_CONFIG } from '../test-config';

export class MockN8NClient {
  async generateOutfitImage(prompt: string): Promise<N8NResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: `Generated outfit image for: ${prompt}`,
      images: [
        'https://example.com/generated-outfit-1.jpg',
        'https://example.com/generated-outfit-2.jpg'
      ],
      suggestedActions: [
        {
          id: 'regenerate',
          label: 'Generate More',
          type: 'image_generation',
          webhookUrl: '/webhook/generate-outfit-image'
        }
      ]
    };
  }

  async analyzeStyle(data: any): Promise<N8NResponse> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      success: true,
      message: 'Style analysis completed successfully',
      analysis: {
        primaryStyle: 'minimalist',
        colorPalette: ['black', 'white', 'gray'],
        confidence: 0.85,
        recommendations: [
          'Focus on clean lines and simple silhouettes',
          'Invest in quality basics in neutral colors',
          'Add texture through fabrics rather than patterns'
        ]
      },
      suggestedActions: [
        {
          id: 'get_recommendations',
          label: 'Get Outfit Recommendations',
          type: 'outfit_recommendation',
          webhookUrl: '/webhook/recommend-outfit'
        }
      ]
    };
  }

  async getOutfitRecommendations(criteria: any): Promise<N8NResponse> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      success: true,
      message: 'Here are your personalized outfit recommendations',
      recommendations: [
        {
          id: 1,
          title: 'Professional Meeting Look',
          items: ['Black blazer', 'White blouse', 'Dark jeans', 'Loafers'],
          occasion: criteria.occasion || 'business'
        },
        {
          id: 2,
          title: 'Casual Weekend Style',
          items: ['Sweater', 'Comfortable pants', 'Sneakers', 'Crossbody bag'],
          occasion: 'casual'
        }
      ],
      suggestedActions: [
        {
          id: 'visualize',
          label: 'Generate Images',
          type: 'image_generation',
          webhookUrl: '/webhook/generate-outfit-image'
        }
      ]
    };
  }
}

export const n8nClient = new MockN8NClient();
```

## 2. Unit Tests

### N8N Client Tests

```typescript
// src/lib/__tests__/n8n-client.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { N8NClient } from '../n8n-client';

// Mock fetch
global.fetch = jest.fn();

describe('N8NClient', () => {
  let client: N8NClient;
  const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    client = new N8NClient();
    mockFetch.mockClear();
  });

  describe('generateOutfitImage', () => {
    it('should generate outfit images successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Images generated successfully',
        images: ['image1.jpg', 'image2.jpg']
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await client.generateOutfitImage('casual summer outfit');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/webhook/generate-outfit-image'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('casual summer outfit')
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      await expect(
        client.generateOutfitImage('test prompt')
      ).rejects.toThrow('N8N API error: 500 Internal Server Error');
    });

    it('should handle timeout errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('AbortError'));

      await expect(
        client.generateOutfitImage('test prompt')
      ).rejects.toThrow('Request timeout - please try again');
    });
  });

  describe('analyzeStyle', () => {
    it('should analyze style with user preferences', async () => {
      const mockResponse = {
        success: true,
        message: 'Style analysis completed',
        analysis: { style: 'minimalist' }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await client.analyzeStyle({
        prompt: 'I love simple, clean styles',
        userPreferences: { colors: ['black', 'white'] }
      });

      expect(result).toEqual(mockResponse);
    });
  });
});
```

### useN8N Hook Tests

```typescript
// src/hooks/__tests__/useN8N.test.ts
import { renderHook, act } from '@testing-library/react';
import { useN8N } from '../useN8N';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('sonner');
jest.mock('@/lib/n8n-client');

describe('useN8N', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful image generation', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useN8N({ onSuccess }));

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.generateImage('test prompt');
    });

    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(toast.success).toHaveBeenCalledWith('Request completed successfully!');
  });

  it('should handle errors properly', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() => useN8N({ onError }));

    // Mock client to throw error
    const mockClient = require('@/lib/n8n-client').n8nClient;
    mockClient.generateOutfitImage.mockRejectedValueOnce(new Error('Test error'));

    await act(async () => {
      try {
        await result.current.generateImage('test prompt');
      } catch (error) {
        // Expected to throw
      }
    });

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(toast.error).toHaveBeenCalled();
  });

  it('should track loading state correctly', async () => {
    const { result } = renderHook(() => useN8N());

    expect(result.current.isLoading).toBe(false);

    const promise = act(async () => {
      return result.current.generateImage('test prompt');
    });

    expect(result.current.isLoading).toBe(true);

    await promise;

    expect(result.current.isLoading).toBe(false);
  });
});
```

## 3. Integration Tests

### Chatbot Integration Tests

```typescript
// src/components/__tests__/ChatPageWithN8N.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatPageWithN8N } from '../ChatPageWithN8N';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('sonner');
jest.mock('@/hooks/useN8N');

describe('ChatPageWithN8N', () => {
  const mockUseN8N = {
    isLoading: false,
    error: null,
    generateImage: jest.fn(),
    analyzeStyle: jest.fn(),
    getRecommendations: jest.fn()
  };

  beforeEach(() => {
    require('@/hooks/useN8N').useN8N.mockReturnValue(mockUseN8N);
    jest.clearAllMocks();
  });

  it('should render N8N action buttons', () => {
    render(<ChatPageWithN8N />);

    expect(screen.getByText('Generate Outfit Image')).toBeInTheDocument();
    expect(screen.getByText('Analyze My Style')).toBeInTheDocument();
    expect(screen.getByText('Get Recommendations')).toBeInTheDocument();
  });

  it('should trigger image generation on button click', async () => {
    render(<ChatPageWithN8N />);

    const generateButton = screen.getByText('Generate Outfit Image');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockUseN8N.generateImage).toHaveBeenCalled();
    });
  });

  it('should display loading state during N8N requests', () => {
    mockUseN8N.isLoading = true;
    render(<ChatPageWithN8N />);

    expect(screen.getByText('AI is processing your request...')).toBeInTheDocument();
  });

  it('should handle N8N responses and update chat', async () => {
    const mockResponse = {
      success: true,
      message: 'Generated successfully',
      images: ['image1.jpg']
    };

    mockUseN8N.generateImage.mockResolvedValueOnce(mockResponse);

    render(<ChatPageWithN8N />);

    const generateButton = screen.getByText('Generate Outfit Image');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Generated successfully')).toBeInTheDocument();
    });
  });
});
```

## 4. End-to-End Tests

### Playwright E2E Tests

```typescript
// tests/e2e/n8n-integration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('N8N Chatbot Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock N8N responses for E2E tests
    await page.route('**/webhook/generate-outfit-image', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Test image generated',
          images: ['https://example.com/test-image.jpg']
        })
      });
    });

    await page.goto('/chat');
  });

  test('should generate outfit images via N8N', async ({ page }) => {
    // Click generate image button
    await page.click('[data-testid="generate-image-button"]');

    // Wait for loading state
    await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();

    // Wait for response
    await expect(page.locator('text=Test image generated')).toBeVisible();

    // Check if image is displayed
    await expect(page.locator('img[src*="test-image.jpg"]')).toBeVisible();
  });

  test('should handle N8N errors gracefully', async ({ page }) => {
    // Mock error response
    await page.route('**/webhook/generate-outfit-image', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { message: 'Server error' }
        })
      });
    });

    await page.click('[data-testid="generate-image-button"]');

    // Should show error message
    await expect(page.locator('text=Server error')).toBeVisible();
  });

  test('should show retry option on failure', async ({ page }) => {
    // Mock initial failure then success
    let callCount = 0;
    await page.route('**/webhook/generate-outfit-image', async route => {
      callCount++;
      if (callCount === 1) {
        await route.fulfill({ status: 500 });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Success on retry'
          })
        });
      }
    });

    await page.click('[data-testid="generate-image-button"]');
    
    // Click retry button
    await page.click('[data-testid="retry-button"]');

    await expect(page.locator('text=Success on retry')).toBeVisible();
  });
});
```

## 5. Performance Tests

### Load Testing

```typescript
// tests/performance/n8n-load.test.ts
import { test, expect } from '@playwright/test';

test.describe('N8N Performance Tests', () => {
  test('should handle concurrent requests', async ({ browser }) => {
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ]);

    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );

    // Navigate all pages to chat
    await Promise.all(
      pages.map(page => page.goto('/chat'))
    );

    // Trigger N8N requests simultaneously
    const startTime = Date.now();
    
    await Promise.all(
      pages.map(page => 
        page.click('[data-testid="generate-image-button"]')
      )
    );

    // Wait for all responses
    await Promise.all(
      pages.map(page => 
        expect(page.locator('[data-testid="response-message"]')).toBeVisible()
      )
    );

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Should complete within reasonable time
    expect(duration).toBeLessThan(10000); // 10 seconds

    // Cleanup
    await Promise.all(contexts.map(context => context.close()));
  });
});
```

## 6. Test Data Management

### Test Fixtures

```typescript
// tests/fixtures/n8n-responses.ts
export const N8N_TEST_RESPONSES = {
  imageGeneration: {
    success: {
      success: true,
      message: 'Images generated successfully',
      images: [
        'https://example.com/outfit1.jpg',
        'https://example.com/outfit2.jpg'
      ],
      suggestedActions: [
        {
          id: 'regenerate',
          label: 'Generate More',
          type: 'image_generation',
          webhookUrl: '/webhook/generate-outfit-image'
        }
      ]
    },
    failure: {
      success: false,
      message: 'Failed to generate images',
      error: {
        message: 'AI service unavailable',
        code: 'SERVICE_UNAVAILABLE'
      }
    }
  },
  styleAnalysis: {
    success: {
      success: true,
      message: 'Style analysis completed',
      analysis: {
        primaryStyle: 'minimalist',
        confidence: 0.9,
        colorPalette: ['black', 'white', 'gray'],
        recommendations: [
          'Focus on clean lines',
          'Invest in quality basics'
        ]
      }
    }
  }
};
```

## 7. Test Scripts

### Package.json Test Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:integration": "jest --testPathPattern=integration",
    "test:unit": "jest --testPathPattern=__tests__",
    "test:n8n": "jest --testPathPattern=n8n",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

## 8. Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test-n8n-integration.yml
name: N8N Integration Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      n8n:
        image: n8nio/n8n
        ports:
          - 5678:5678
        env:
          N8N_BASIC_AUTH_ACTIVE: false
          
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run integration tests
        run: npm run test:integration
        env:
          TEST_N8N_URL: http://localhost:5678
          
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          TEST_N8N_URL: http://localhost:5678
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Next Steps

1. [Deploy to Production](./deployment-guide.md)
2. [Monitor Performance](./monitoring-guide.md)
3. [Troubleshoot Issues](./troubleshooting.md)
4. [Scale the System](./scaling-guide.md)
