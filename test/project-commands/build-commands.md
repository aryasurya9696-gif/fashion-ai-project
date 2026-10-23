
# Build Commands

## Standard Build
```bash
# Build for production
pnpm build

# Build with type checking
pnpm build --type-check

# Build with verbose output
pnpm build --verbose
```

## Build Optimization
```bash
# Build with bundle analyzer
pnpm build:analyze

# Build with source maps
pnpm build --source-maps

# Build without minification (for debugging)
pnpm build --no-minify
```

## Build Verification
```bash
# Check build output
ls -la .next/

# Verify build size
du -sh .next/

# Test production build locally
pnpm build && pnpm start
```

## Static Export (if needed)
```bash
# Export static files
pnpm export

# Build and export
pnpm build && pnpm export

# Export to specific directory
pnpm export --outdir dist
```

## Build Cleanup
```bash
# Clean build cache
pnpm clean

# Remove node_modules and reinstall
rm -rf node_modules && pnpm install

# Clear Next.js cache
rm -rf .next/cache
```

## Build Environment Variables
```bash
# Build with specific environment
NODE_ENV=production pnpm build

# Build with custom variables
NEXT_PUBLIC_API_URL=https://api.prod.com pnpm build
```

## Build Troubleshooting
```bash
# Build with debug information
DEBUG=next:* pnpm build

# Build with memory debugging
NODE_OPTIONS='--max-old-space-size=4096' pnpm build

# Check build errors
pnpm build 2>&1 | tee build.log
```

## Docker Build
```bash
# Build Docker image
docker build -t app-name:latest .

# Build with specific tag
docker build -t app-name:v1.0.0 .

# Build with build args
docker build --build-arg NODE_ENV=production -t app-name .
```

## CI/CD Build Commands
```bash
# Install dependencies (CI)
pnpm install --frozen-lockfile

# Run tests before build
pnpm test && pnpm build

# Build with coverage
pnpm test:coverage && pnpm build
```
