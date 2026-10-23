
# Troubleshooting Guide

## Common Issues and Solutions

### 1. Build and Deployment Issues

#### Issue: Build fails with TypeScript errors
**Error Message**: `Type error: Cannot find module...`

**Solution**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix import paths
# Ensure all imports use correct paths
import { Component } from '@/components/Component'

# Check tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Issue: Environment variables not working
**Error Message**: `process.env.VARIABLE_NAME is undefined`

**Solution**:
1. **Check file naming**: Must be `.env.local` for Next.js
2. **Verify variable names**: No spaces around `=`
   ```env
   # Correct
   POSTGREST_URL=https://example.com
   
   # Incorrect
   POSTGREST_URL = https://example.com
   ```
3. **Restart development server** after adding variables
4. **For production**: Set variables in hosting platform dashboard

#### Issue: Module not found errors
**Error Message**: `Module not found: Can't resolve '@/lib/...'`

**Solution**:
```javascript
// Check next.config.js
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/postgrest-js']
  }
}
```

### 2. Database Connection Issues

#### Issue: Cannot connect to database
**Error Message**: `Failed to fetch from database`

**Solution**:
1. **Verify environment variables**:
   ```bash
   # Check if variables are set
   echo $POSTGREST_URL
   echo $POSTGREST_API_KEY
   ```

2. **Test database connection**:
   ```javascript
   // Create test API route: src/app/next_api/test-db/route.ts
   import { createPostgrestClient } from '@/lib/postgrest';
   
   export async function GET() {
     try {
       const client = createPostgrestClient();
       const { data, error } = await client.from('users').select('count');
       
       if (error) throw error;
       
       return Response.json({ success: true, data });
     } catch (error) {
       return Response.json({ success: false, error: error.message });
     }
   }
   ```

3. **Check Supabase settings**:
   - Verify project URL is correct
   - Ensure API key has proper permissions
   - Check if RLS policies are blocking access

#### Issue: Database queries failing
**Error Message**: `relation "table_name" does not exist`

**Solution**:
1. **Run database schema**:
   ```sql
   -- Copy content from test/database-setup.sql
   -- Run in Supabase SQL Editor
   ```

2. **Check table names**:
   ```javascript
   // Ensure table names match schema
   const userOps = new CrudOperations("users"); // not "Users"
   ```

3. **Verify schema**:
   ```sql
   -- Check if tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

### 3. Authentication Issues

#### Issue: Users cannot login/register
**Error Message**: `Authentication failed`

**Solution**:
1. **Check API routes**:
   ```bash
   # Verify API routes exist
   ls src/app/next_api/auth/
   ```

2. **Test authentication endpoint**:
   ```bash
   # Test registration
   curl -X POST http://localhost:3000/next_api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"password123"}'
   ```

3. **Verify password hashing**:
   ```javascript
   // Install bcryptjs if not installed
   npm install bcryptjs
   npm install @types/bcryptjs
   ```

#### Issue: Session not persisting
**Error Message**: User gets logged out on page refresh

**Solution**:
1. **Check localStorage implementation**:
   ```javascript
   // Ensure user data is saved to localStorage
   localStorage.setItem('user', JSON.stringify(userData));
   ```

2. **Verify token handling**:
   ```javascript
   // Check if token is being stored and retrieved correctly
   const token = localStorage.getItem('authToken');
   ```

### 4. API Route Issues

#### Issue: API routes returning 404
**Error Message**: `404 - This page could not be found`

**Solution**:
1. **Check file structure**:
   ```
   src/app/next_api/
   ├── auth/
   │   └── register/
   │       └── route.ts  ← Must be named 'route.ts'
   ```

2. **Verify export names**:
   ```javascript
   // Correct
   export async function POST(request: NextRequest) { ... }
   
   // Incorrect
   export default function handler() { ... }
   ```

3. **Check API call paths**:
   ```javascript
   // Correct
   fetch('/next_api/auth/register', { ... })
   
   // Incorrect
   fetch('/api/auth/register', { ... })
   ```

#### Issue: CORS errors
**Error Message**: `Access to fetch blocked by CORS policy`

**Solution**:
```javascript
// Add CORS headers to API routes
export async function POST(request: NextRequest) {
  const response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
  
  return response;
}
```

### 5. Frontend Issues

#### Issue: Components not rendering
**Error Message**: `Hydration failed` or blank page

**Solution**:
1. **Check client/server component usage**:
   ```javascript
   // Add "use client" for interactive components
   "use client";
   
   import { useState } from 'react';
   
   export default function Component() {
     const [state, setState] = useState();
     // ...
   }
   ```

2. **Verify imports**:
   ```javascript
   // Check if all imports are correct
   import { Button } from '@/components/ui/button';
   import { Card } from '@/components/ui/card';
   ```

#### Issue: Styling not working
**Error Message**: Styles not applied or Tailwind classes not working

**Solution**:
1. **Check Tailwind configuration**:
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: [
       './src/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     // ...
   }
   ```

2. **Verify CSS imports**:
   ```javascript
   // In src/app/layout.tsx
   import './globals.css';
   ```

3. **Check PostCSS configuration**:
   ```javascript
   // postcss.config.mjs
   export default {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

### 6. Performance Issues

#### Issue: Slow page loading
**Symptoms**: Pages take long time to load

**Solution**:
1. **Optimize images**:
   ```javascript
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="Description"
     width={500}
     height={300}
     priority // For above-the-fold images
   />
   ```

2. **Implement code splitting**:
   ```javascript
   import dynamic from 'next/dynamic';
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>
   });
   ```

3. **Use React.memo for expensive components**:
   ```javascript
   import { memo } from 'react';
   
   const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
     // Component logic
   });
   ```

### 7. Production-Specific Issues

#### Issue: Environment variables not working in production
**Solution**:
1. **Set variables in hosting platform**:
   - Vercel: Project Settings > Environment Variables
   - Netlify: Site Settings > Environment Variables
   - Railway: Project Dashboard > Variables

2. **Redeploy after setting variables**

#### Issue: Database connection fails in production
**Solution**:
1. **Check production database URL**:
   ```env
   # Ensure production database URL is different from development
   POSTGREST_URL=https://your-prod-project.supabase.co/rest/v1
   ```

2. **Verify SSL settings**:
   ```javascript
   // Some production databases require SSL
   const client = createPostgrestClient({
     ssl: { rejectUnauthorized: false }
   });
   ```

### 8. Debugging Tools

#### Enable Debug Mode
```bash
# Development
NODE_OPTIONS='--inspect' npm run dev

# Check environment variables
npm run dev -- --debug
```

#### API Testing
```bash
# Test API endpoints
curl -X GET http://localhost:3000/next_api/users
curl -X POST http://localhost:3000/next_api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

#### Database Testing
```sql
-- Test database connection in Supabase SQL Editor
SELECT 'Database connection successful' as status;

-- Check table structure
\d users;

-- Test data insertion
INSERT INTO users (name, email) VALUES ('Test User', 'test@example.com');
```

### 9. Getting Help

#### Check Logs
1. **Development**: Check terminal output
2. **Vercel**: Go to Functions tab in dashboard
3. **Netlify**: Check Function logs
4. **Railway**: Check deployment logs

#### Common Log Locations
- **Browser Console**: F12 > Console tab
- **Network Tab**: F12 > Network tab (for API calls)
- **Server Logs**: Check hosting platform dashboard

#### Community Resources
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [Supabase Discord](https://discord.supabase.com/)
- [Vercel Discord](https://discord.gg/vercel)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

### 10. Emergency Fixes

#### Quick Rollback
```bash
# If deployment breaks, rollback to previous version
vercel --prod --force  # Redeploy previous version
```

#### Disable Features
```javascript
// Temporarily disable problematic features
const FEATURE_ENABLED = false;

if (FEATURE_ENABLED) {
  // Feature code
}
```

#### Database Recovery
```sql
-- If database issues, check recent changes
SELECT * FROM users ORDER BY created_at DESC LIMIT 10;

-- Rollback recent changes if needed
DELETE FROM users WHERE created_at > '2024-01-01';
```

---

**Remember**: Always test changes in development before deploying to production!
