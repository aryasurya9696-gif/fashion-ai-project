
# Package Management Commands

## pnpm Commands

### Installation
```bash
# Install all dependencies
pnpm install

# Install specific package
pnpm add package-name

# Install dev dependency
pnpm add -D package-name

# Install global package
pnpm add -g package-name
```

### Package Updates
```bash
# Update all packages
pnpm update

# Update specific package
pnpm update package-name

# Check outdated packages
pnpm outdated

# Interactive update
pnpm update -i
```

### Package Removal
```bash
# Remove package
pnpm remove package-name

# Remove dev dependency
pnpm remove -D package-name

# Remove global package
pnpm remove -g package-name
```

## Dependency Management

### Lock File Management
```bash
# Install from lock file (CI/CD)
pnpm install --frozen-lockfile

# Update lock file
pnpm install --lockfile-only

# Verify lock file
pnpm install --verify-store-integrity
```

### Package Information
```bash
# List installed packages
pnpm list

# List top-level packages only
pnpm list --depth=0

# Show package info
pnpm info package-name

# Show package dependencies
pnpm why package-name
```

## Security and Auditing

### Security Audit
```bash
# Run security audit
pnpm audit

# Fix security issues
pnpm audit --fix

# Check for vulnerabilities
pnpm audit --audit-level moderate
```

### License Checking
```bash
# Check package licenses
pnpm licenses list

# Generate license report
pnpm licenses generate-disclaimer
```

## Workspace Management (if using monorepo)

### Workspace Commands
```bash
# Install for all workspaces
pnpm install -r

# Run command in all workspaces
pnpm -r run build

# Run command in specific workspace
pnpm --filter workspace-name run build
```

## Cache Management

### pnpm Cache
```bash
# Clear pnpm cache
pnpm store prune

# Check cache status
pnpm store status

# Verify store integrity
pnpm store verify
```

### Next.js Cache
```bash
# Clear Next.js cache
rm -rf .next/cache

# Clear all Next.js files
rm -rf .next
```

## Common Package Operations

### UI Components (shadcn/ui)
```bash
# Add new component
pnpm dlx shadcn-ui@latest add button

# Add multiple components
pnpm dlx shadcn-ui@latest add button card dialog

# Update component
pnpm dlx shadcn-ui@latest add --overwrite button
```

### Development Tools
```bash
# Add TypeScript types
pnpm add -D @types/node @types/react

# Add testing libraries
pnpm add -D jest @testing-library/react

# Add linting tools
pnpm add -D eslint prettier
```

### Production Dependencies
```bash
# Add runtime dependencies
pnpm add next react react-dom

# Add utility libraries
pnpm add lodash date-fns

# Add UI libraries
pnpm add framer-motion lucide-react
```

## Package Scripts

### Custom Scripts
```bash
# Run custom script
pnpm run script-name

# List available scripts
pnpm run

# Run multiple scripts
pnpm run build && pnpm run start
```

### Script Aliases
```bash
# Common aliases
pnpm dev     # Start development server
pnpm build   # Build for production
pnpm start   # Start production server
pnpm test    # Run tests
pnpm lint    # Run linter
```

## Troubleshooting Package Issues

### Common Fixes
```bash
# Clear everything and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Force reinstall specific package
pnpm add package-name --force

# Check for conflicting versions
pnpm list package-name
```

### Peer Dependency Issues
```bash
# Install peer dependencies
pnpm install --shamefully-hoist

# Check peer dependency warnings
pnpm install --strict-peer-dependencies=false
```

### Version Management
```bash
# Pin package to specific version
pnpm add package-name@1.2.3

# Use exact version
pnpm add --save-exact package-name

# Check package versions
pnpm list --depth=0
```
