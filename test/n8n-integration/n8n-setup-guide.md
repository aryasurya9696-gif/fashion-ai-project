
# N8N Installation & Configuration Guide

## 1. N8N Installation Options

### Option A: Docker Installation (Recommended)

```bash
# Create N8N directory
mkdir n8n-data
cd n8n-data

# Run N8N with Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Option B: NPM Installation

```bash
# Install N8N globally
npm install n8n -g

# Start N8N
n8n start

# Or with custom port
n8n start --port 5678
```

### Option C: N8N Cloud (Easiest)

1. Visit [n8n.cloud](https://n8n.cloud)
2. Create account and workspace
3. Use cloud instance URL for webhooks

## 2. Initial Configuration

### Environment Variables

Create `.env` file in N8N directory:

```env
# Basic Configuration
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password

# Webhook Configuration
WEBHOOK_URL=https://your-domain.com
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https

# Database (Optional - uses SQLite by default)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=n8n
DB_POSTGRESDB_PASSWORD=n8n

# AI Service API Keys
OPENAI_API_KEY=your_openai_api_key
STABILITY_API_KEY=your_stability_api_key
REPLICATE_API_TOKEN=your_replicate_token
```

### Security Settings

```env
# Security
N8N_SECURE_COOKIE=true
N8N_JWT_AUTH_ACTIVE=true
N8N_JWT_AUTH_HEADER=authorization
N8N_JWT_AUTH_HEADER_VALUE_PREFIX=Bearer

# CORS Settings
N8N_CORS_ORIGIN=https://your-website.com
```

## 3. Webhook Configuration

### Enable Webhooks

```env
# Webhook Settings
N8N_PAYLOAD_SIZE_MAX=16
N8N_METRICS=true
EXECUTIONS_DATA_SAVE_ON_ERROR=all
EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
```

### Test Webhook

Create a simple test workflow:

1. Add "Webhook" node
2. Set HTTP Method: POST
3. Set Path: `/test`
4. Add "Respond to Webhook" node
5. Connect nodes and activate workflow

Test with:
```bash
curl -X POST https://your-n8n-instance.com/webhook-test/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello N8N"}'
```

## 4. AI Service Integration

### OpenAI Configuration

```javascript
// OpenAI HTTP Request Node Configuration
{
  "method": "POST",
  "url": "https://api.openai.com/v1/images/generations",
  "headers": {
    "Authorization": "Bearer {{ $env.OPENAI_API_KEY }}",
    "Content-Type": "application/json"
  },
  "body": {
    "prompt": "{{ $json.prompt }}",
    "n": 1,
    "size": "1024x1024",
    "response_format": "url"
  }
}
```

### Stability AI Configuration

```javascript
// Stability AI HTTP Request Node Configuration
{
  "method": "POST",
  "url": "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
  "headers": {
    "Authorization": "Bearer {{ $env.STABILITY_API_KEY }}",
    "Content-Type": "application/json"
  },
  "body": {
    "text_prompts": [
      {
        "text": "{{ $json.prompt }}",
        "weight": 1
      }
    ],
    "cfg_scale": 7,
    "height": 1024,
    "width": 1024,
    "samples": 1,
    "steps": 30
  }
}
```

## 5. Production Deployment

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'n8n',
    script: 'n8n',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      N8N_PORT: 5678,
      N8N_HOST: '0.0.0.0'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-n8n-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-n8n-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 6. Monitoring & Logs

### Enable Logging

```env
# Logging Configuration
N8N_LOG_LEVEL=info
N8N_LOG_OUTPUT=console,file
N8N_LOG_FILE_LOCATION=/var/log/n8n/
```

### Health Check Endpoint

Create workflow for health monitoring:
- Webhook: `/health`
- Response: `{"status": "ok", "timestamp": "{{ $now }}"}`

## 7. Backup & Recovery

### Database Backup

```bash
# SQLite backup (default)
cp ~/.n8n/database.sqlite3 backup_$(date +%Y%m%d).sqlite3

# PostgreSQL backup
pg_dump n8n > backup_$(date +%Y%m%d).sql
```

### Workflow Export

```bash
# Export all workflows
n8n export:workflow --all --output=workflows_backup.json

# Import workflows
n8n import:workflow --input=workflows_backup.json
```

## Next Steps

1. [Configure Chatbot Integration](./chatbot-integration.md)
2. [Set up Workflow Examples](./workflow-examples.md)
3. [Test the Integration](./testing-guide.md)
