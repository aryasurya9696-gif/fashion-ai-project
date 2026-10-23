
# N8N Workflow Examples

This document provides ready-to-use N8N workflow configurations for chatbot integration, including AI image generation, style analysis, and outfit recommendations.

## 1. AI Image Generation Workflow

### Workflow Overview
- **Trigger**: Webhook from chatbot
- **Process**: Generate fashion images using AI
- **Response**: Return generated images to chatbot

### Workflow JSON (Import Ready)

```json
{
  "name": "Fashion AI Image Generator",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "generate-outfit-image",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// Extract and validate input data\nconst inputData = $input.first().json;\n\n// Validate required fields\nif (!inputData.prompt) {\n  throw new Error('Prompt is required for image generation');\n}\n\n// Enhance prompt for fashion context\nconst enhancedPrompt = `Fashion photography, ${inputData.prompt}, high quality, professional lighting, studio setting, detailed clothing, modern style`;\n\n// Prepare data for AI service\nreturn {\n  prompt: enhancedPrompt,\n  userId: inputData.userId,\n  chatSessionId: inputData.chatSessionId,\n  originalPrompt: inputData.prompt,\n  style: inputData.style || 'realistic',\n  aspectRatio: inputData.aspectRatio || '1:1'\n};"
      },
      "id": "process-input",
      "name": "Process Input",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.openai.com/v1/images/generations",
        "authentication": "headerAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{ $env.OPENAI_API_KEY }}"
            },
            {
              "name": "Content-Type",
              "value": "application/json"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "prompt",
              "value": "={{ $json.prompt }}"
            },
            {
              "name": "n",
              "value": "2"
            },
            {
              "name": "size",
              "value": "1024x1024"
            },
            {
              "name": "quality",
              "value": "hd"
            },
            {
              "name": "response_format",
              "value": "url"
            }
          ]
        }
      },
      "id": "openai-image-gen",
      "name": "OpenAI Image Generation",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "jsCode": "// Process OpenAI response\nconst openaiResponse = $input.first().json;\nconst inputData = $('Process Input').first().json;\n\n// Extract image URLs\nconst images = openaiResponse.data.map(item => item.url);\n\n// Prepare response for chatbot\nconst response = {\n  success: true,\n  message: `I've generated ${images.length} outfit images based on your request: \"${inputData.originalPrompt}\". Here are some stylish options for you!`,\n  images: images,\n  metadata: {\n    prompt: inputData.originalPrompt,\n    enhancedPrompt: inputData.prompt,\n    generatedAt: new Date().toISOString(),\n    userId: inputData.userId,\n    chatSessionId: inputData.chatSessionId\n  },\n  suggestedActions: [\n    {\n      id: 'regenerate',\n      label: 'Generate More Options',\n      type: 'image_generation',\n      prompt: inputData.originalPrompt,\n      webhookUrl: '/webhook/generate-outfit-image'\n    },\n    {\n      id: 'analyze_style',\n      label: 'Analyze This Style',\n      type: 'style_analysis',\n      webhookUrl: '/webhook/analyze-style'\n    }\n  ]\n};\n\nreturn response;"
      },
      "id": "format-response",
      "name": "Format Response",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      },
      "id": "webhook-response",
      "name": "Webhook Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1120, 300]
    },
    {
      "parameters": {
        "jsCode": "// Error handling\nconst error = $input.first().json;\n\nconst errorResponse = {\n  success: false,\n  message: 'I apologize, but I encountered an issue generating your outfit images. Please try again with a different description or contact support if the problem persists.',\n  error: {\n    message: error.message || 'Unknown error occurred',\n    timestamp: new Date().toISOString()\n  },\n  suggestedActions: [\n    {\n      id: 'retry',\n      label: 'Try Again',\n      type: 'image_generation',\n      webhookUrl: '/webhook/generate-outfit-image'\n    },\n    {\n      id: 'text_recommendation',\n      label: 'Get Text Recommendations',\n      type: 'outfit_recommendation',\n      webhookUrl: '/webhook/recommend-outfit'\n    }\n  ]\n};\n\nreturn errorResponse;"
      },
      "id": "error-handler",
      "name": "Error Handler",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 480]
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [
        [
          {
            "node": "Process Input",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Process Input": {
      "main": [
        [
          {
            "node": "OpenAI Image Generation",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenAI Image Generation": {
      "main": [
        [
          {
            "node": "Format Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Response": {
      "main": [
        [
          {
            "node": "Webhook Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
```

## 2. Style Analysis Workflow

### Workflow Configuration

```json
{
  "name": "Fashion Style Analyzer",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "analyze-style",
        "responseMode": "responseNode"
      },
      "id": "webhook-trigger",
      "name": "Style Analysis Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// Process style analysis request\nconst inputData = $input.first().json;\n\n// Extract user preferences and images\nconst userPreferences = inputData.userPreferences || {};\nconst images = inputData.images || [];\nconst prompt = inputData.prompt || '';\n\n// Create analysis prompt\nconst analysisPrompt = `Analyze the fashion style based on the following:\nUser description: ${prompt}\nPreferences: ${JSON.stringify(userPreferences)}\nProvide detailed style analysis including:\n1. Style category (casual, formal, bohemian, minimalist, etc.)\n2. Color palette preferences\n3. Silhouette preferences\n4. Occasion suitability\n5. Style recommendations\n6. Shopping suggestions`;\n\nreturn {\n  analysisPrompt,\n  userId: inputData.userId,\n  images,\n  userPreferences\n};"
      },
      "id": "prepare-analysis",
      "name": "Prepare Analysis",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "authentication": "headerAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{ $env.OPENAI_API_KEY }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "gpt-4"
            },
            {
              "name": "messages",
              "value": "=[{\"role\": \"system\", \"content\": \"You are a professional fashion stylist and style analyst. Provide detailed, personalized fashion advice.\"}, {\"role\": \"user\", \"content\": \"{{ $json.analysisPrompt }}\"}]"
            },
            {
              "name": "max_tokens",
              "value": "1000"
            },
            {
              "name": "temperature",
              "value": "0.7"
            }
          ]
        }
      },
      "id": "ai-style-analysis",
      "name": "AI Style Analysis",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "jsCode": "// Format style analysis response\nconst aiResponse = $input.first().json;\nconst inputData = $('Prepare Analysis').first().json;\n\nconst analysisText = aiResponse.choices[0].message.content;\n\n// Parse analysis into structured format\nconst response = {\n  success: true,\n  message: `Here's your personalized style analysis! 👗✨\\n\\n${analysisText}`,\n  analysis: {\n    fullText: analysisText,\n    timestamp: new Date().toISOString(),\n    userId: inputData.userId\n  },\n  suggestedActions: [\n    {\n      id: 'generate_outfit',\n      label: 'Generate Outfit Based on Analysis',\n      type: 'image_generation',\n      webhookUrl: '/webhook/generate-outfit-image'\n    },\n    {\n      id: 'get_recommendations',\n      label: 'Get Specific Recommendations',\n      type: 'outfit_recommendation',\n      webhookUrl: '/webhook/recommend-outfit'\n    },\n    {\n      id: 'save_style_profile',\n      label: 'Save Style Profile',\n      type: 'save_profile',\n      webhookUrl: '/webhook/save-style-profile'\n    }\n  ]\n};\n\nreturn response;"
      },
      "id": "format-analysis",
      "name": "Format Analysis",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      },
      "id": "analysis-response",
      "name": "Analysis Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1120, 300]
    }
  ],
  "connections": {
    "Style Analysis Webhook": {
      "main": [
        [
          {
            "node": "Prepare Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare Analysis": {
      "main": [
        [
          {
            "node": "AI Style Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Style Analysis": {
      "main": [
        [
          {
            "node": "Format Analysis",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Analysis": {
      "main": [
        [
          {
            "node": "Analysis Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 3. Outfit Recommendation Workflow

### Smart Recommendation Engine

```json
{
  "name": "Smart Outfit Recommender",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "recommend-outfit",
        "responseMode": "responseNode"
      },
      "id": "recommendation-webhook",
      "name": "Recommendation Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "jsCode": "// Process recommendation request\nconst inputData = $input.first().json;\n\n// Extract context\nconst occasion = inputData.occasion || 'casual';\nconst weather = inputData.weather || 'mild';\nconst bodyType = inputData.bodyType || 'not specified';\nconst colorPreferences = inputData.colorPreferences || [];\nconst budget = inputData.budget || 'moderate';\nconst stylePreferences = inputData.stylePreferences || [];\n\n// Create recommendation prompt\nconst recommendationPrompt = `Create outfit recommendations for:\nOccasion: ${occasion}\nWeather: ${weather}\nBody type: ${bodyType}\nColor preferences: ${colorPreferences.join(', ')}\nBudget: ${budget}\nStyle preferences: ${stylePreferences.join(', ')}\n\nProvide 3 complete outfit recommendations with:\n1. Detailed description of each piece\n2. Styling tips\n3. Where to shop (by budget)\n4. Accessories suggestions\n5. Color coordination advice`;\n\nreturn {\n  recommendationPrompt,\n  context: {\n    occasion,\n    weather,\n    bodyType,\n    colorPreferences,\n    budget,\n    stylePreferences\n  },\n  userId: inputData.userId\n};"
      },
      "id": "prepare-recommendation",
      "name": "Prepare Recommendation",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "authentication": "headerAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer {{ $env.OPENAI_API_KEY }}"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "gpt-4"
            },
            {
              "name": "messages",
              "value": "=[{\"role\": \"system\", \"content\": \"You are an expert fashion stylist. Provide practical, detailed outfit recommendations with specific items and styling advice.\"}, {\"role\": \"user\", \"content\": \"{{ $json.recommendationPrompt }}\"}]"
            },
            {
              "name": "max_tokens",
              "value": "1200"
            },
            {
              "name": "temperature",
              "value": "0.8"
            }
          ]
        }
      },
      "id": "ai-recommendations",
      "name": "AI Recommendations",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4,
      "position": [680, 300]
    },
    {
      "parameters": {
        "jsCode": "// Format recommendations response\nconst aiResponse = $input.first().json;\nconst inputData = $('Prepare Recommendation').first().json;\n\nconst recommendationsText = aiResponse.choices[0].message.content;\n\n// Create structured response\nconst response = {\n  success: true,\n  message: `Here are your personalized outfit recommendations! 👗✨\\n\\n${recommendationsText}`,\n  recommendations: {\n    fullText: recommendationsText,\n    context: inputData.context,\n    timestamp: new Date().toISOString(),\n    userId: inputData.userId\n  },\n  suggestedActions: [\n    {\n      id: 'visualize_outfits',\n      label: 'Generate Images of These Outfits',\n      type: 'image_generation',\n      prompt: `Create images based on these outfit recommendations: ${recommendationsText.substring(0, 200)}...`,\n      webhookUrl: '/webhook/generate-outfit-image'\n    },\n    {\n      id: 'refine_recommendations',\n      label: 'Refine Recommendations',\n      type: 'outfit_recommendation',\n      webhookUrl: '/webhook/recommend-outfit'\n    },\n    {\n      id: 'save_recommendations',\n      label: 'Save These Recommendations',\n      type: 'save_recommendations',\n      webhookUrl: '/webhook/save-recommendations'\n    }\n  ]\n};\n\nreturn response;"
      },
      "id": "format-recommendations",
      "name": "Format Recommendations",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [900, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ $json }}"
      },
      "id": "recommendations-response",
      "name": "Recommendations Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1120, 300]
    }
  ],
  "connections": {
    "Recommendation Webhook": {
      "main": [
        [
          {
            "node": "Prepare Recommendation",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Prepare Recommendation": {
      "main": [
        [
          {
            "node": "AI Recommendations",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "AI Recommendations": {
      "main": [
        [
          {
            "node": "Format Recommendations",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Format Recommendations": {
      "main": [
        [
          {
            "node": "Recommendations Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## 4. Workflow Import Instructions

### How to Import Workflows

1. **Access N8N Interface**
   ```bash
   # Open N8N in browser
   http://localhost:5678
   # Or your N8N cloud instance
   ```

2. **Import Workflow**
   - Click "+" to create new workflow
   - Click "..." menu → "Import from JSON"
   - Paste the workflow JSON
   - Click "Import"

3. **Configure Environment Variables**
   ```env
   OPENAI_API_KEY=your_openai_api_key
   STABILITY_API_KEY=your_stability_api_key
   N8N_API_KEY=your_n8n_api_key
   ```

4. **Activate Workflows**
   - Click "Active" toggle for each workflow
   - Test with sample webhook calls

### Testing Workflows

```bash
# Test Image Generation
curl -X POST https://your-n8n-instance.com/webhook/generate-outfit-image \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "prompt": "elegant evening dress for dinner party",
    "userId": "test_user_123",
    "chatSessionId": "session_456"
  }'

# Test Style Analysis
curl -X POST https://your-n8n-instance.com/webhook/analyze-style \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "prompt": "I love minimalist fashion with neutral colors",
    "userId": "test_user_123",
    "userPreferences": {
      "colors": ["black", "white", "beige"],
      "style": "minimalist"
    }
  }'

# Test Outfit Recommendations
curl -X POST https://your-n8n-instance.com/webhook/recommend-outfit \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "occasion": "business meeting",
    "weather": "cool",
    "budget": "moderate",
    "userId": "test_user_123"
  }'
```

## Next Steps

1. [Configure API Endpoints](./api-endpoints.md)
2. [Set up Testing Environment](./testing-guide.md)
3. [Deploy to Production](./deployment-guide.md)
4. [Monitor Performance](./monitoring-guide.md)
