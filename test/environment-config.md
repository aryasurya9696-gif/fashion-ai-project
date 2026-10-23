
# Environment Configuration Guide

## Overview
This guide covers all environment variables and configuration needed for your FashionAI chatbot application.

## 1. Environment Files Structure

```
your-project/
├── .env.local          # Local development (gitignored)
├── .env.example        # Template file (committed to git)
├── .env.production     # Production overrides (optional)
└── .env.test          # Testing environment (optional)
```

## 2. Required Environment Variables

### 2.1 Database Configuration

```env
# PostgreSQL Database (Supabase)
POSTGREST_URL=https://your-project-id.supabase.co/rest/v1
POSTGREST_SCHEMA=public
POSTGREST_API_KEY=your_supabase_anon_key

# Alternative: Direct PostgreSQL connection
DATABASE_URL=postgresql://username:password@host:port/database
```

### 2.2 Authentication

```env
# NextAuth.js configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters

# OAuth providers (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 2.3 AI and External APIs

```env
# OpenAI for chatbot functionality
OPENAI_API_KEY=sk-your-openai-api-key

# Alternative AI providers
ANTHROPIC_API_KEY=your_anthropic_key
COHERE_API_KEY=your_cohere_key
```

### 2.4 File Storage

```env
# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Alternative: AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Alternative: Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2.5 Analytics and Monitoring

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry Error Tracking
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2.6 Email Services

```env
# SendGrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key

# Resend
RESEND_API_KEY=re_your-resend-api-key

# SMTP (alternative)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2.7 Payment Processing (if needed)

```env
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal (alternative)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

## 3. Environment-Specific Configurations

### 3.1 Development (.env.local)

```env
# Development environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
POSTGREST_URL=https://your-dev-project.supabase.co/rest/v1
POSTGREST_API_KEY=your_dev_api_key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key-32-chars-min

# Debug settings
DEBUG=true
LOG_LEVEL=debug
```

### 3.2 Production

```env
# Production environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
POSTGREST_URL=https://your-prod-project.supabase.co/rest/v1
POSTGREST_API_KEY=your_prod_api_key

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=production-secret-key-very-secure-32-chars-min

# Security settings
SECURE_COOKIES=true
CSRF_PROTECTION=true
```

### 3.3 Testing

```env
# Test environment
NODE_ENV=test
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Test database
POSTGREST_URL=https://your-test-project.supabase.co/rest/v1
POSTGREST_API_KEY=your_test_api_key

# Mock services
MOCK_EXTERNAL_APIS=true
```

## 4. Platform-Specific Setup

### 4.1 Vercel

**Via Dashboard:**
1. Go to Project Settings > Environment Variables
2. Add each variable with appropriate environment (Development/Preview/Production)

**Via CLI:**
```bash
# Add environment variables
vercel env add POSTGREST_URL
vercel env add POSTGREST_API_KEY
vercel env add NEXTAUTH_SECRET

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME
```

**Via vercel.json:**
```json
{
  "env": {
    "POSTGREST_URL": "@postgrest_url",
    "POSTGREST_API_KEY": "@postgrest_api_key",
    "NEXTAUTH_SECRET": "@nextauth_secret"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

### 4.2 Netlify

**Via Dashboard:**
1. Go to Site Settings > Environment Variables
2. Add each variable

**Via netlify.toml:**
```toml
[build.environment]
  NODE_ENV = "production"
  POSTGREST_URL = "https://your-project.supabase.co/rest/v1"

[context.production.environment]
  NEXTAUTH_URL = "https://your-domain.com"

[context.deploy-preview.environment]
  NEXTAUTH_URL = "https://deploy-preview-123--your-site.netlify.app"
```

### 4.3 Railway

**Via Dashboard:**
1. Go to your project
2. Click "Variables" tab
3. Add variables

**Via CLI:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Add environment variables
railway variables set POSTGREST_URL=your_url
railway variables set POSTGREST_API_KEY=your_key
```

### 4.4 Heroku

**Via CLI:**
```bash
# Set environment variables
heroku config:set POSTGREST_URL=your_url
heroku config:set POSTGREST_API_KEY=your_key
heroku config:set NEXTAUTH_SECRET=your_secret

# View all variables
heroku config

# Remove variable
heroku config:unset VARIABLE_NAME
```

## 5. Security Best Practices

### 5.1 Secret Generation

```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator (for non-production)
# https://generate-secret.vercel.app/32
```

### 5.2 Environment Variable Validation

Create `src/lib/env.ts`:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  POSTGREST_URL: z.string().url(),
  POSTGREST_API_KEY: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

### 5.3 Runtime Validation

```typescript
// src/lib/config.ts
export function validateConfig() {
  const required = [
    'POSTGREST_URL',
    'POSTGREST_API_KEY',
    'NEXTAUTH_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
```

## 6. Development Workflow

### 6.1 Environment File Template

Create `.env.example`:

```env
# Database Configuration
POSTGREST_URL=https://your-project-id.supabase.co/rest/v1
POSTGREST_SCHEMA=public
POSTGREST_API_KEY=your_supabase_anon_key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-minimum-32-characters

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email (optional)
SENDGRID_API_KEY=SG.your-sendgrid-api-key
```

### 6.2 Setup Script

Create `scripts/setup-env.js`:

```javascript
const fs = require('fs');
const path = require('path');

const envExample = path.join(__dirname, '..', '.env.example');
const envLocal = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envLocal)) {
  fs.copyFileSync(envExample, envLocal);
  console.log('Created .env.local from .env.example');
  console.log('Please update the values in .env.local');
} else {
  console.log('.env.local already exists');
}
```

### 6.3 Package.json Scripts

```json
{
  "scripts": {
    "setup": "node scripts/setup-env.js",
    "dev": "next dev",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    "build": "next build",
    "start": "next start",
    "env:check": "node -e \"require('./src/lib/env.ts')\""
  }
}
```

## 7. Troubleshooting

### 7.1 Common Issues

**Issue**: Environment variables not loading
```bash
# Check if file exists
ls -la .env.local

# Check file content (be careful with secrets)
cat .env.local | grep -v SECRET

# Restart development server
npm run dev
```

**Issue**: Variables undefined in production
```bash
# Check if variables are set in hosting platform
vercel env ls
# or
heroku config
```

### 7.2 Debug Environment

Create debug endpoint `src/app/next_api/debug/env/route.ts`:

```typescript
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Not available in production' });
  }

  const safeEnv = Object.keys(process.env)
    .filter(key => !key.includes('SECRET') && !key.includes('KEY'))
    .reduce((obj, key) => {
      obj[key] = process.env[key];
      return obj;
    }, {});

  return Response.json(safeEnv);
}
```

## 8. Migration Guide

### 8.1 From Development to Production

1. **Copy environment variables**:
   ```bash
   # Export from development
   cat .env.local > production-env.txt
   
   # Update URLs and secrets for production
   # Set in hosting platform
   ```

2. **Update URLs**:
   ```env
   # Development
   NEXTAUTH_URL=http://localhost:3000
   
   # Production
   NEXTAUTH_URL=https://your-domain.com
   ```

3. **Generate new secrets**:
   ```bash
   # Generate new production secrets
   openssl rand -base64 32
   ```

### 8.2 Environment Sync

Create `scripts/sync-env.js`:

```javascript
// Sync environment variables between platforms
const platforms = {
  vercel: 'vercel env',
  railway: 'railway variables',
  heroku: 'heroku config'
};

// Implementation depends on your needs
```

---

**Important**: Never commit `.env.local` or any file containing real secrets to version control!
