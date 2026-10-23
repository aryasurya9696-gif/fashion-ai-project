
# Development Commands

## Initial Setup
```bash
# Clone the repository (if needed)
git clone <repository-url>
cd <project-name>

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Development Server
```bash
# Start Next.js development server
pnpm dev

# Start on specific port
pnpm dev -- --port 3001

# Start with turbo mode
pnpm dev --turbo
```

## Development Tools
```bash
# Run TypeScript type checking
pnpm type-check

# Run ESLint
pnpm lint

# Fix ESLint issues automatically
pnpm lint:fix

# Format code with Prettier
pnpm format

# Run all checks (lint + type-check)
pnpm check
```

## File Watching
```bash
# Watch for file changes and restart
pnpm dev

# Watch specific files
pnpm dev -- --watch src/

# Enable hot reload (default in dev mode)
pnpm dev
```

## Environment Variables
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
# or
code .env.local
```

## Database Development (if applicable)
```bash
# Run database migrations
pnpm db:migrate

# Seed database with test data
pnpm db:seed

# Reset database
pnpm db:reset
```

## Component Development
```bash
# Add new shadcn/ui component
pnpm dlx shadcn-ui@latest add button

# Generate new component
pnpm generate:component ComponentName
```

## Debugging
```bash
# Start with debugging enabled
NODE_OPTIONS='--inspect' pnpm dev

# Start with verbose logging
DEBUG=* pnpm dev

# Check bundle analyzer
pnpm analyze
```
