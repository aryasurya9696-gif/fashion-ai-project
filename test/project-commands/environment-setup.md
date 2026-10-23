
# Environment Setup

## Prerequisites Installation

### Node.js Setup
```bash
# Install Node.js 18+ (using nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

### Package Manager Setup
```bash
# Install pnpm globally
npm install -g pnpm

# Verify pnpm installation
pnpm --version

# Alternative: use corepack
corepack enable
corepack prepare pnpm@latest --activate
```

## Project Setup

### Initial Installation
```bash
# Clone repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local
```

### Environment Variables Configuration
```bash
# Edit environment variables
nano .env.local

# Required variables for this project:
# NODE_ENV=development
# NEXT_PUBLIC_APP_URL=http://localhost:3000
# POSTGREST_URL=your_postgrest_url (if using database)
# POSTGREST_SCHEMA=public (if using database)
# POSTGREST_API_KEY=your_api_key (if using database)
```

### Development Tools Setup
```bash
# Install VS Code extensions (recommended)
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next

# Setup Git hooks (if using husky)
pnpm prepare
```

## Database Setup (if applicable)

### PostgreSQL Setup
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Install PostgreSQL (Ubuntu)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
createdb your_database_name
```

### PostgREST Setup
```bash
# Install PostgREST
# Download from https://github.com/PostgREST/postgrest/releases

# Run PostgREST
./postgrest postgrest.conf
```

## IDE Configuration

### VS Code Settings
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Verification Commands
```bash
# Verify setup
pnpm dev

# Check if all dependencies are installed
pnpm list

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## Common Setup Issues

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Use different port
pnpm dev -- --port 3001
```

### Permission Issues
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Clear npm cache
npm cache clean --force
```

### Module Resolution Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
pnpm install

# Clear Next.js cache
rm -rf .next
```
