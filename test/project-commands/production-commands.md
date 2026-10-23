
# Production Commands

## Build for Production
```bash
# Create production build
pnpm build

# Build with verbose output
pnpm build --verbose

# Build and analyze bundle
pnpm build && pnpm analyze
```

## Production Server
```bash
# Start production server locally
pnpm start

# Start on specific port
pnpm start -- --port 8080

# Start with PM2 (process manager)
pm2 start "pnpm start" --name "app"
```

## Deployment Commands

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Deploy with environment variables
vercel --env NEXT_PUBLIC_API_URL=https://api.example.com
```

### Netlify Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to Netlify
netlify deploy

# Deploy to production
netlify deploy --prod

# Deploy with build command
netlify deploy --build
```

### Docker Deployment
```bash
# Build Docker image
docker build -t app-name .

# Run Docker container
docker run -p 3000:3000 app-name

# Run with environment variables
docker run -p 3000:3000 --env-file .env app-name
```

### Manual Server Deployment
```bash
# Build the application
pnpm build

# Copy files to server
rsync -avz .next/ user@server:/path/to/app/

# Install dependencies on server
ssh user@server "cd /path/to/app && pnpm install --production"

# Start application on server
ssh user@server "cd /path/to/app && pnpm start"
```

## Environment Setup for Production
```bash
# Set production environment variables
export NODE_ENV=production
export NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Or create .env.production file
echo "NODE_ENV=production" > .env.production
echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com" >> .env.production
```

## Performance Optimization
```bash
# Analyze bundle size
pnpm analyze

# Check lighthouse scores
npx lighthouse http://localhost:3000

# Run performance tests
pnpm test:performance
```

## Health Checks
```bash
# Check if application is running
curl http://localhost:3000/api/health

# Check application status
pnpm status

# Monitor logs
pnpm logs
```
