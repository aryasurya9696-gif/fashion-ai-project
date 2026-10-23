
# Backend Setup Guide

## Overview
This guide covers the backend configuration for your FashionAI chatbot application, including API routes, database connections, and environment setup.

## 1. Environment Configuration

### 1.1 Required Environment Variables

Create a `.env.local` file in your project root:

```env
# Database Configuration (Supabase)
POSTGREST_URL=https://your-project-id.supabase.co/rest/v1
POSTGREST_SCHEMA=public
POSTGREST_API_KEY=your_supabase_anon_key

# Authentication (if using custom auth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Optional: Third-party integrations
OPENAI_API_KEY=your_openai_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional: Analytics and monitoring
NEXT_PUBLIC_GA_ID=your_google_analytics_id
SENTRY_DSN=your_sentry_dsn
```

### 1.2 Production Environment Variables

For production deployment, set these in your hosting platform:

**Vercel:**
- Go to Project Settings > Environment Variables
- Add each variable with appropriate values

**Netlify:**
- Go to Site Settings > Environment Variables
- Add each variable

**Railway/Heroku:**
- Use their respective dashboard or CLI to set environment variables

## 2. Database Setup

### 2.1 Supabase Setup (Recommended)

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Create new project
   # Note down your project URL and API keys
   ```

2. **Run Database Schema**
   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the content from `database-setup.sql`
   - Run the script

3. **Configure API Settings**
   - Go to Settings > API
   - Copy your project URL and anon key
   - Update your environment variables

### 2.2 Alternative: Self-hosted PostgreSQL

If you prefer self-hosted PostgreSQL:

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb fashionai_db

# Create user
sudo -u postgres createuser --interactive

# Run schema
psql -U your_user -d fashionai_db -f database-setup.sql
```

## 3. API Routes Structure

Your application uses the following API structure:

```
src/app/next_api/
├── auth/
│   ├── login/route.ts
│   ├── register/route.ts
│   └── logout/route.ts
├── users/
│   ├── route.ts
│   └── [id]/route.ts
├── chat/
│   ├── sessions/route.ts
│   ├── messages/route.ts
│   └── [sessionId]/route.ts
├── outfits/
│   ├── route.ts
│   └── [id]/route.ts
└── analytics/
    └── route.ts
```

### 3.1 API Route Examples

**User Registration API** (`src/app/next_api/auth/register/route.ts`):
```typescript
import { NextRequest } from "next/server";
import { createSuccessResponse, createErrorResponse } from "@/lib/create-response";
import { requestMiddleware, validateRequestBody } from "@/lib/api-utils";
import CrudOperations from "@/lib/crud-operations";

const userOps = new CrudOperations("users");

async function handleRegister(request: NextRequest) {
  const body = await validateRequestBody(request);
  
  const { name, email, password } = body;
  
  if (!name || !email || !password) {
    return createErrorResponse({
      errorMessage: "Name, email, and password are required",
      status: 400
    });
  }
  
  // Hash password (implement password hashing)
  const hashedPassword = await hashPassword(password);
  
  const user = await userOps.create({
    name,
    email,
    password_hash: hashedPassword,
    plan: 'free'
  });
  
  return createSuccessResponse(user, 201);
}

export const POST = requestMiddleware(handleRegister);
```

## 4. Authentication Setup

### 4.1 Custom Authentication

If using custom authentication:

```typescript
// src/lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.NEXTAUTH_SECRET!, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { userId: string };
  } catch {
    return null;
  }
}
```

### 4.2 OAuth Integration (Optional)

For Google OAuth:

```typescript
// src/lib/oauth.ts
export async function verifyGoogleToken(token: string) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
  const data = await response.json();
  
  if (data.error) {
    throw new Error('Invalid Google token');
  }
  
  return {
    email: data.email,
    name: data.name,
    picture: data.picture
  };
}
```

## 5. Real-time Features

### 5.1 WebSocket Setup (Optional)

For real-time chat features:

```typescript
// src/lib/websocket.ts
import { Server } from 'socket.io';

export function setupWebSocket(server: any) {
  const io = new Server(server);
  
  io.on('connection', (socket) => {
    socket.on('join-chat', (sessionId) => {
      socket.join(sessionId);
    });
    
    socket.on('send-message', (data) => {
      socket.to(data.sessionId).emit('new-message', data);
    });
  });
  
  return io;
}
```

## 6. Error Handling and Logging

### 6.1 Global Error Handler

```typescript
// src/lib/error-handler.ts
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown) {
  console.error('Application Error:', error);
  
  if (error instanceof AppError) {
    return createErrorResponse({
      errorMessage: error.message,
      errorCode: error.errorCode,
      status: error.statusCode
    });
  }
  
  return createErrorResponse({
    errorMessage: 'Internal server error',
    status: 500
  });
}
```

### 6.2 Request Logging

```typescript
// src/lib/logger.ts
export function logRequest(request: NextRequest) {
  console.log(`${new Date().toISOString()} - ${request.method} ${request.url}`);
}
```

## 7. Performance Optimization

### 7.1 Database Connection Pooling

```typescript
// src/lib/db-pool.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

### 7.2 Caching Strategy

```typescript
// src/lib/cache.ts
const cache = new Map();

export function setCache(key: string, value: any, ttl: number = 300000) {
  cache.set(key, {
    value,
    expires: Date.now() + ttl
  });
}

export function getCache(key: string) {
  const item = cache.get(key);
  if (!item || Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  return item.value;
}
```

## 8. Security Best Practices

### 8.1 Rate Limiting

```typescript
// src/lib/rate-limit.ts
const requests = new Map();

export function rateLimit(ip: string, limit: number = 100, window: number = 900000) {
  const now = Date.now();
  const userRequests = requests.get(ip) || [];
  
  const validRequests = userRequests.filter((time: number) => now - time < window);
  
  if (validRequests.length >= limit) {
    throw new AppError('Too many requests', 429);
  }
  
  validRequests.push(now);
  requests.set(ip, validRequests);
}
```

### 8.2 Input Validation

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8)
});

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(1000),
  sessionId: z.string().uuid()
});
```

## 9. Testing

### 9.1 API Testing

```typescript
// tests/api.test.ts
import { POST } from '@/app/next_api/auth/register/route';

describe('Auth API', () => {
  test('should register user', async () => {
    const request = new Request('http://localhost/next_api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const response = await POST(request as any);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });
});
```

## 10. Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] API routes tested
- [ ] Authentication working
- [ ] Error handling implemented
- [ ] Security measures in place
- [ ] Performance optimizations applied
- [ ] Monitoring and logging setup

## Support

For issues or questions:
1. Check the error logs in your hosting platform
2. Verify environment variables are set correctly
3. Test database connectivity
4. Review API route implementations

---

Your backend is now ready for production deployment!
