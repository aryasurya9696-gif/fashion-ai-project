
# N8N Integration Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the N8N chatbot integration.

## 1. Common Issues & Solutions

### Connection Issues

#### Problem: "Failed to connect to N8N webhook"

**Symptoms:**
- Webhook requests timeout
- Connection refused errors
- Network unreachable errors

**Solutions:**

```bash
# Check N8N service status
curl -I http://your-n8n-instance.com:5678/healthz

# Test webhook endpoint
curl -X POST http://your-n8n-instance.com/webhook-test/test \
  -H "Content-Type: application/json" \
  -d '{"test": "message"}'

# Check firewall settings
sudo ufw status
sudo iptables -L

# Verify DNS resolution
nslookup your-n8n-instance.com
```

**Configuration Check:**
```typescript
// Verify environment variables
console.log('N8N Config:', {
  url: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL,
  hasApiKey: !!process.env.NEXT_PUBLIC_N8N_API_KEY
});
```

#### Problem: "CORS policy blocking requests"

**Solution:**
```env
# N8N CORS configuration
N8N_CORS_ORIGIN=https://your-website.com,http://localhost:3000
```

### Authentication Issues

#### Problem: "Unauthorized webhook request"

**Symptoms:**
- 401 Unauthorized responses
- API key validation failures

**Solutions:**

```typescript
// Debug API key validation
const debugAuth = async () => {
  const response = await fetch('/webhook/test', {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.NEXT_PUBLIC_N8N_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ debug: true })
  });
  
  console.log('Auth Status:', response.status);
  console.log('Headers:', response.headers);
};
```

**N8N Workflow Debug:**
```javascript
// Add to webhook node
const headers = $input.first().headers;
console.log('Received headers:', headers);
console.log('API Key:', headers['x-api-key']);

if (!headers['x-api-key']) {
  throw new Error('Missing API key');
}
```

### Workflow Execution Issues

#### Problem: "Workflow fails silently"

**Debugging Steps:**

1. **Enable N8N Logging:**
```env
N8N_LOG_LEVEL=debug
N8N_LOG_OUTPUT=console,file
N8N_LOG_FILE_LOCATION=/var/log/n8n/
```

2. **Add Debug Nodes:**
```javascript
// Debug node in workflow
const debugInfo = {
  timestamp: new Date().toISOString(),
  inputData: $input.all(),
  environment: {
    nodeVersion: process.version,
    n8nVersion: $env.N8N_VERSION
  }
};

console.log('Debug Info:', JSON.stringify(debugInfo, null, 2));
return debugInfo;
```

3. **Check Execution History:**
```bash
# Access N8N interface
http://your-n8n-instance.com:5678

# Navigate to: Executions > Failed/Success
# Review execution logs and error details
```

#### Problem: "AI service API errors"

**Common API Issues:**

```javascript
// OpenAI API error handling
try {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${$env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('OpenAI Error:', error);
    
    // Handle specific errors
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your OpenAI configuration.');
    }
    
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  return await response.json();
} catch (error) {
  console.error('API Request failed:', error);
  throw error;
}
```

## 2. Performance Issues

### Slow Response Times

#### Problem: "N8N workflows taking too long"

**Diagnosis:**
```javascript
// Add timing to workflow nodes
const startTime = Date.now();

// ... workflow logic ...

const endTime = Date.now();
const duration = endTime - startTime;

console.log(`Workflow execution time: ${duration}ms`);

if (duration > 10000) {
  console.warn('Slow execution detected');
}
```

**Optimization Strategies:**

1. **Parallel Processing:**
```javascript
// Instead of sequential API calls
const results = await Promise.all([
  fetch(apiUrl1),
  fetch(apiUrl2),
  fetch(apiUrl3)
]);
```

2. **Caching:**
```javascript
// Cache frequent requests
const cacheKey = `style_analysis_${userId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const result = await performAnalysis();
await redis.setex(cacheKey, 3600, JSON.stringify(result)); // 1 hour cache
```

3. **Request Optimization:**
```javascript
// Optimize AI prompts for faster processing
const optimizedPrompt = prompt
  .replace(/\s+/g, ' ')
  .trim()
  .substring(0, 1000); // Limit prompt length
```

### Memory Issues

#### Problem: "N8N running out of memory"

**Monitoring:**
```bash
# Check N8N memory usage
docker stats n8n

# Monitor system resources
htop
free -h
```

**Solutions:**
```env
# Increase N8N memory limits
EXECUTIONS_DATA_SAVE_ON_ERROR=none
EXECUTIONS_DATA_SAVE_ON_SUCCESS=none
EXECUTIONS_DATA_MAX_AGE=168 # 7 days
```

## 3. Data Issues

### Invalid Response Format

#### Problem: "Unexpected response structure"

**Validation:**
```typescript
// Response validation utility
interface ExpectedResponse {
  success: boolean;
  message: string;
  data?: any;
  images?: string[];
  error?: {
    message: string;
    code?: string;
  };
}

const validateN8NResponse = (response: any): ExpectedResponse => {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Invalid response: not an object');
  }

  if (typeof response.success !== 'boolean') {
    throw new Error('Invalid response: missing success field');
  }

  if (typeof response.message !== 'string') {
    throw new Error('Invalid response: missing message field');
  }

  return response as ExpectedResponse;
};
```

**N8N Response Formatting:**
```javascript
// Ensure consistent response format in N8N
const formatResponse = (success, message, data = null, error = null) => {
  return {
    success,
    message,
    ...(data && { data }),
    ...(error && { error }),
    timestamp: new Date().toISOString(),
    version: '1.0'
  };
};

// Usage in workflow
if (success) {
  return formatResponse(true, 'Operation completed', result);
} else {
  return formatResponse(false, 'Operation failed', null, { message: errorMessage });
}
```

### Image Processing Issues

#### Problem: "Generated images not displaying"

**Debug Image URLs:**
```javascript
// Validate image URLs in N8N
const validateImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    if (!response.ok) {
      throw new Error(`Image not accessible: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    return true;
  } catch (error) {
    console.error('Image validation failed:', error);
    return false;
  }
};

// Validate all generated images
const validImages = [];
for (const imageUrl of generatedImages) {
  if (await validateImageUrl(imageUrl)) {
    validImages.push(imageUrl);
  }
}
```

**CORS Issues with Images:**
```typescript
// Handle CORS for image display
const ImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
    // Try with proxy or fallback
    setImageSrc(`/api/proxy-image?url=${encodeURIComponent(src)}`);
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={handleError}
      crossOrigin="anonymous"
      className="generated-image"
    />
  );
};
```

## 4. Environment-Specific Issues

### Development Environment

#### Problem: "Works locally but fails in development"

**Common Causes:**
1. Environment variable differences
2. Network configuration
3. SSL/TLS issues

**Solutions:**
```bash
# Compare environment variables
env | grep N8N

# Test network connectivity
curl -v https://your-n8n-instance.com/webhook/test

# Check SSL certificates
openssl s_client -connect your-n8n-instance.com:443
```

### Production Environment

#### Problem: "Production deployment issues"

**Checklist:**
```bash
# 1. Verify environment variables
echo $N8N_WEBHOOK_URL
echo $N8N_API_KEY

# 2. Check service status
systemctl status n8n
docker ps | grep n8n

# 3. Review logs
journalctl -u n8n -f
docker logs n8n

# 4. Test connectivity
curl -X POST $N8N_WEBHOOK_URL/webhook/test \
  -H "X-API-Key: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 5. Monitoring & Alerting

### Health Checks

```typescript
// Health check endpoint
export const healthCheck = async (): Promise<{
  status: 'healthy' | 'unhealthy';
  checks: Record<string, boolean>;
  timestamp: string;
}> => {
  const checks = {
    n8nConnection: false,
    apiKeyValid: false,
    workflowsActive: false
  };

  try {
    // Test N8N connection
    const response = await fetch(`${N8N_BASE_URL}/healthz`);
    checks.n8nConnection = response.ok;

    // Test API key
    const authTest = await fetch(`${N8N_BASE_URL}/webhook/test`, {
      method: 'POST',
      headers: { 'X-API-Key': N8N_API_KEY }
    });
    checks.apiKeyValid = authTest.status !== 401;

    // Test workflow execution
    const workflowTest = await fetch(`${N8N_BASE_URL}/webhook/health-check`, {
      method: 'POST',
      headers: { 'X-API-Key': N8N_API_KEY },
      body: JSON.stringify({ test: true })
    });
    checks.workflowsActive = workflowTest.ok;

  } catch (error) {
    console.error('Health check failed:', error);
  }

  const allHealthy = Object.values(checks).every(Boolean);

  return {
    status: allHealthy ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString()
  };
};
```

### Error Tracking

```typescript
// Error tracking utility
interface ErrorReport {
  type: 'n8n_error';
  error: string;
  context: {
    workflow?: string;
    userId?: string;
    timestamp: string;
    environment: string;
  };
}

export const reportError = (error: Error, context: any = {}) => {
  const report: ErrorReport = {
    type: 'n8n_error',
    error: error.message,
    context: {
      ...context,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    }
  };

  // Send to monitoring service
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: report });
  }

  // Log locally
  console.error('N8N Error Report:', report);
};
```

## 6. Quick Fixes

### Emergency Fallbacks

```typescript
// Fallback responses when N8N is unavailable
const FALLBACK_RESPONSES = {
  imageGeneration: {
    success: false,
    message: 'Image generation is temporarily unavailable. Please try again later or describe your outfit needs, and I can provide text-based recommendations.',
    suggestedActions: [
      {
        id: 'text_recommendation',
        label: 'Get Text Recommendations',
        type: 'text_only'
      }
    ]
  },
  styleAnalysis: {
    success: false,
    message: 'Style analysis is currently unavailable. Could you tell me about your preferred colors, occasions, and style preferences instead?',
    suggestedActions: [
      {
        id: 'manual_input',
        label: 'Describe Your Style',
        type: 'text_input'
      }
    ]
  }
};

// Use fallback when N8N fails
const handleN8NFailure = (actionType: string) => {
  const fallback = FALLBACK_RESPONSES[actionType];
  if (fallback) {
    return fallback;
  }
  
  return {
    success: false,
    message: 'I apologize, but I am experiencing technical difficulties. Please try again in a few moments.',
    suggestedActions: [
      {
        id: 'retry',
        label: 'Try Again',
        type: 'retry'
      }
    ]
  };
};
```

### Reset Procedures

```bash
#!/bin/bash
# reset-n8n.sh - Emergency reset script

echo "Resetting N8N integration..."

# 1. Restart N8N service
sudo systemctl restart n8n
# OR for Docker
docker restart n8n

# 2. Clear cache
redis-cli FLUSHDB

# 3. Test connectivity
curl -X POST $N8N_WEBHOOK_URL/webhook/test \
  -H "X-API-Key: $N8N_API_KEY" \
  -d '{"test": true}'

# 4. Verify workflows are active
echo "Please check N8N interface to ensure workflows are active"
echo "URL: $N8N_WEBHOOK_URL"

echo "Reset complete!"
```

## 7. Getting Help

### Support Channels

1. **N8N Community:**
   - Forum: https://community.n8n.io/
   - Discord: https://discord.gg/n8n

2. **Documentation:**
   - N8N Docs: https://docs.n8n.io/
   - API Reference: https://docs.n8n.io/api/

3. **GitHub Issues:**
   - N8N Repository: https://github.com/n8n-io/n8n
   - Report bugs and feature requests

### Creating Support Tickets

**Information to Include:**
- N8N version
- Node.js version
- Operating system
- Error messages and logs
- Steps to reproduce
- Expected vs actual behavior
- Workflow JSON (if applicable)

**Log Collection:**
```bash
# Collect relevant logs
echo "=== N8N Logs ===" > debug-info.txt
docker logs n8n >> debug-info.txt

echo "=== System Info ===" >> debug-info.txt
uname -a >> debug-info.txt
node --version >> debug-info.txt

echo "=== Environment ===" >> debug-info.txt
env | grep N8N >> debug-info.txt
```

This troubleshooting guide should help you resolve most common issues with the N8N chatbot integration. For persistent problems, don't hesitate to reach out to the community or create detailed bug reports.
