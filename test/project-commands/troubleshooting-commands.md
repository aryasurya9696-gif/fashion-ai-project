
# Troubleshooting Commands

## Common Development Issues

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Use different port
pnpm dev -- --port 3001
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install

# Clear Next.js cache
rm -rf .next

# Restart development server
pnpm dev
```

### TypeScript Errors
```bash
# Run type checking
pnpm type-check

# Restart TypeScript server (VS Code)
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"

# Clear TypeScript cache
rm -rf .next/cache
```

### Build Failures
```bash
# Build with verbose output
pnpm build --verbose

# Check for memory issues
NODE_OPTIONS='--max-old-space-size=4096' pnpm build

# Clear all caches
rm -rf .next node_modules
pnpm install
pnpm build
```

## Performance Issues

### Slow Development Server
```bash
# Start with turbo mode
pnpm dev --turbo

# Disable source maps temporarily
NEXT_DISABLE_SOURCEMAPS=true pnpm dev

# Check for large files
find . -name "*.js" -o -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -n
```

### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS='--max-old-space-size=8192' pnpm dev

# Monitor memory usage
top -p $(pgrep -f "next-server")

# Check for memory leaks
node --inspect pnpm dev
```

## Database Issues (if applicable)

### Connection Problems
```bash
# Test database connection
pg_isready -h localhost -p 5432

# Check PostgREST status
curl http://localhost:3000/

# Verify environment variables
echo $POSTGREST_URL
echo $POSTGREST_API_KEY
```

### Migration Issues
```bash
# Reset database
pnpm db:reset

# Run migrations manually
pnpm db:migrate

# Check migration status
pnpm db:status
```

## Styling Issues

### Tailwind CSS Not Working
```bash
# Rebuild Tailwind
pnpm build:css

# Check Tailwind config
npx tailwindcss --init --dry-run

# Purge and rebuild
rm -rf .next
pnpm dev
```

### Component Library Issues
```bash
# Reinstall shadcn/ui components
pnpm dlx shadcn-ui@latest add --overwrite button

# Check component imports
grep -r "from.*ui/" src/
```

## Network and API Issues

### API Route Problems
```bash
# Test API endpoints
curl http://localhost:3000/api/health

# Check API logs
tail -f .next/server.log

# Debug API routes
DEBUG=api:* pnpm dev
```

### CORS Issues
```bash
# Check browser console for CORS errors
# Add CORS headers in next.config.js

# Test with curl
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     http://localhost:3000/api/endpoint
```

## Environment Issues

### Environment Variables Not Loading
```bash
# Check .env files
ls -la .env*

# Verify variable names (must start with NEXT_PUBLIC_ for client-side)
grep NEXT_PUBLIC .env.local

# Restart development server after env changes
pnpm dev
```

### Path Resolution Issues
```bash
# Check tsconfig.json paths
cat tsconfig.json | grep -A 10 "paths"

# Verify import statements
grep -r "from.*@/" src/
```

## Git and Version Control

### Merge Conflicts
```bash
# Check conflict status
git status

# Resolve conflicts manually, then
git add .
git commit -m "Resolve merge conflicts"

# Abort merge if needed
git merge --abort
```

### Dependency Conflicts
```bash
# Check for duplicate dependencies
pnpm list --depth=0

# Update dependencies
pnpm update

# Check for security vulnerabilities
pnpm audit
```

## Emergency Reset Commands

### Complete Reset
```bash
# Nuclear option - reset everything
rm -rf node_modules .next pnpm-lock.yaml
pnpm install
pnpm dev
```

### Partial Reset
```bash
# Reset only build cache
rm -rf .next

# Reset only dependencies
rm -rf node_modules
pnpm install
```

## Debugging Tools

### Enable Debug Mode
```bash
# Debug Next.js
DEBUG=next:* pnpm dev

# Debug specific modules
DEBUG=api:*,db:* pnpm dev

# Debug with inspector
node --inspect pnpm dev
```

### Performance Profiling
```bash
# Profile build time
time pnpm build

# Analyze bundle
pnpm build:analyze

# Check lighthouse scores
npx lighthouse http://localhost:3000
```
