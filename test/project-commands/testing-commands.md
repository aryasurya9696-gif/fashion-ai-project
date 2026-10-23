
# Testing Commands

## Test Execution

### Basic Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/components/Button.test.tsx
```

### Test Types
```bash
# Run unit tests only
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run end-to-end tests
pnpm test:e2e

# Run visual regression tests
pnpm test:visual
```

## Jest Commands (if using Jest)

### Jest Specific
```bash
# Run Jest with specific config
pnpm jest --config jest.config.js

# Run tests matching pattern
pnpm jest --testNamePattern="Button"

# Run tests in specific directory
pnpm jest src/components/

# Update snapshots
pnpm jest --updateSnapshot
```

### Jest Debugging
```bash
# Run Jest in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Run single test file in debug
pnpm jest --runInBand src/components/Button.test.tsx

# Verbose output
pnpm jest --verbose
```

## Playwright/Cypress E2E Testing

### Playwright Commands
```bash
# Install Playwright
pnpm dlx playwright install

# Run Playwright tests
pnpm playwright test

# Run in headed mode
pnpm playwright test --headed

# Run specific test
pnpm playwright test tests/login.spec.ts
```

### Cypress Commands
```bash
# Open Cypress GUI
pnpm cypress open

# Run Cypress headless
pnpm cypress run

# Run specific spec
pnpm cypress run --spec "cypress/e2e/login.cy.ts"
```

## Testing Tools Setup

### Install Testing Dependencies
```bash
# Jest and React Testing Library
pnpm add -D jest @testing-library/react @testing-library/jest-dom

# Playwright
pnpm add -D @playwright/test

# Cypress
pnpm add -D cypress

# Additional testing utilities
pnpm add -D @testing-library/user-event msw
```

## Code Quality Testing

### Linting and Formatting
```bash
# Run ESLint
pnpm lint

# Fix ESLint issues
pnpm lint:fix

# Run Prettier
pnpm format

# Check Prettier formatting
pnpm format:check
```

### Type Checking
```bash
# Run TypeScript compiler
pnpm type-check

# Watch mode for type checking
pnpm type-check:watch

# Strict type checking
pnpm tsc --noEmit --strict
```

## Performance Testing

### Bundle Analysis
```bash
# Analyze bundle size
pnpm analyze

# Check bundle with webpack-bundle-analyzer
pnpm build:analyze

# Lighthouse CI
npx lhci autorun
```

### Load Testing
```bash
# Install k6 for load testing
brew install k6

# Run load test
k6 run loadtest.js

# Artillery load testing
npx artillery quick --count 10 --num 3 http://localhost:3000
```

## Test Coverage

### Coverage Reports
```bash
# Generate coverage report
pnpm test:coverage

# Open coverage report
open coverage/lcov-report/index.html

# Coverage with specific threshold
pnpm jest --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```

### Coverage Analysis
```bash
# Check coverage for specific files
pnpm jest --coverage --collectCoverageFrom="src/components/**/*.{ts,tsx}"

# Exclude files from coverage
pnpm jest --coverage --coveragePathIgnorePatterns="src/test/"
```

## Mock and Stub Testing

### API Mocking
```bash
# Start MSW (Mock Service Worker)
pnpm msw init public/

# Run tests with API mocks
pnpm test --setupFilesAfterEnv src/test/setup.ts
```

### Database Mocking
```bash
# Run tests with test database
TEST_DATABASE_URL=postgresql://test pnpm test

# Reset test database
pnpm test:db:reset
```

## Continuous Integration Testing

### CI Commands
```bash
# Install dependencies (CI mode)
pnpm install --frozen-lockfile

# Run all checks
pnpm ci:check

# Run tests in CI
CI=true pnpm test --coverage --watchAll=false
```

### Pre-commit Testing
```bash
# Run pre-commit hooks
pnpm pre-commit

# Test staged files only
pnpm lint-staged

# Run quick tests
pnpm test:quick
```

## Debugging Tests

### Debug Mode
```bash
# Debug Jest tests
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug with VS Code
# Add breakpoints and run "Debug Jest Tests" configuration

# Debug Playwright tests
pnpm playwright test --debug
```

### Test Utilities
```bash
# Generate test files
pnpm generate:test ComponentName

# Update test snapshots
pnpm test -- --updateSnapshot

# Clear test cache
pnpm jest --clearCache
```

## Test Environment Setup

### Environment Variables for Testing
```bash
# Set test environment
NODE_ENV=test pnpm test

# Use test environment file
cp .env.test.example .env.test
```

### Test Database Setup
```bash
# Create test database
createdb myapp_test

# Run migrations for test
NODE_ENV=test pnpm db:migrate

# Seed test data
NODE_ENV=test pnpm db:seed
```
