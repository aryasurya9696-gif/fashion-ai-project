
# Chatbot Integration with N8N

This guide shows how to integrate your website's chatbot with N8N workflows for AI image generation and automated responses.

## 1. Chatbot Button Configuration

### Add N8N Trigger Button to Chatbot

Update your chatbot component to include N8N integration buttons:

```typescript
// Add to your chat component
interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  images?: string[];
  n8nActions?: N8NAction[];
}

interface N8NAction {
  id: string;
  label: string;
  type: 'image_generation' | 'style_analysis' | 'outfit_recommendation';
  prompt?: string;
  webhookUrl: string;
}

// N8N Action Button Component
const N8NActionButton = ({ action, onTrigger }: { 
  action: N8NAction; 
  onTrigger: (action: N8NAction) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onTrigger(action);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="btn-gradient hover-glow"
      size="sm"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        <Sparkles className="w-4 h-4 mr-2" />
      )}
      {action.label}
    </Button>
  );
};
```

### Enhanced Chat Interface

```typescript
// Enhanced chat component with N8N integration
export default function ChatPageWithN8N() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // N8N Configuration
  const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://your-n8n-instance.com';
  
  const n8nActions: N8NAction[] = [
    {
      id: 'generate_outfit_image',
      label: 'Generate Outfit Image',
      type: 'image_generation',
      webhookUrl: `${N8N_BASE_URL}/webhook/generate-outfit-image`
    },
    {
      id: 'style_analysis',
      label: 'Analyze My Style',
      type: 'style_analysis',
      webhookUrl: `${N8N_BASE_URL}/webhook/analyze-style`
    },
    {
      id: 'outfit_recommendation',
      label: 'Get Outfit Suggestions',
      type: 'outfit_recommendation',
      webhookUrl: `${N8N_BASE_URL}/webhook/recommend-outfit`
    }
  ];

  // Trigger N8N Workflow
  const triggerN8NWorkflow = async (action: N8NAction, userPrompt?: string) => {
    setIsProcessing(true);
    
    try {
      const payload = {
        action: action.type,
        prompt: userPrompt || action.prompt,
        userId: currentUser?.id,
        timestamp: new Date().toISOString(),
        chatSessionId: generateSessionId(),
        userPreferences: getUserPreferences()
      };

      const response = await fetch(action.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_N8N_API_KEY || ''
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`N8N workflow failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Add N8N response to chat
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: result.message || 'Processing your request...',
        timestamp: new Date(),
        images: result.images || [],
        n8nActions: result.suggestedActions || []
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Show success notification
      toast.success('AI processing completed!');
      
    } catch (error) {
      console.error('N8N workflow error:', error);
      toast.error('Failed to process request. Please try again.');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again or contact support.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Enhanced message rendering with N8N actions
  const renderMessage = (message: ChatMessage) => (
    <div className="message-container">
      {/* Regular message content */}
      <div className="message-content">
        {message.content}
      </div>
      
      {/* Generated images */}
      {message.images && message.images.length > 0 && (
        <div className="generated-images grid grid-cols-2 gap-2 mt-3">
          {message.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Generated ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button size="sm" variant="secondary">
                  <Download className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* N8N Action Buttons */}
      {message.n8nActions && message.n8nActions.length > 0 && (
        <div className="n8n-actions flex flex-wrap gap-2 mt-3">
          {message.n8nActions.map((action) => (
            <N8NActionButton
              key={action.id}
              action={action}
              onTrigger={(action) => triggerN8NWorkflow(action)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="chat-container">
      {/* Chat messages */}
      <div className="messages">
        {messages.map(renderMessage)}
        
        {/* Processing indicator */}
        {isProcessing && (
          <div className="processing-indicator">
            <div className="flex items-center gap-2 text-primary">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>AI is processing your request...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area with N8N quick actions */}
      <div className="input-area">
        <div className="quick-actions mb-2">
          <div className="flex gap-2 overflow-x-auto">
            {n8nActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => triggerN8NWorkflow(action)}
                className="whitespace-nowrap"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Regular chat input */}
        <div className="chat-input">
          {/* Your existing input component */}
        </div>
      </div>
    </div>
  );
}
```

## 2. Environment Configuration

### Frontend Environment Variables

```env
# .env.local
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com
NEXT_PUBLIC_N8N_API_KEY=your_n8n_api_key
```

### N8N Webhook Security

```typescript
// Webhook validation utility
export const validateN8NWebhook = (request: Request) => {
  const apiKey = request.headers.get('X-API-Key');
  const expectedKey = process.env.N8N_API_KEY;
  
  if (!apiKey || apiKey !== expectedKey) {
    throw new Error('Unauthorized webhook request');
  }
  
  return true;
};
```

## 3. Real-time Updates

### WebSocket Integration (Optional)

```typescript
// WebSocket connection for real-time updates
class N8NWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string) {
    const wsUrl = `${process.env.NEXT_PUBLIC_N8N_WS_URL}/ws/${userId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('N8N WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleN8NUpdate(data);
    };

    this.ws.onclose = () => {
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('N8N WebSocket error:', error);
    };
  }

  private handleN8NUpdate(data: any) {
    // Handle real-time updates from N8N workflows
    switch (data.type) {
      case 'workflow_started':
        toast.info('AI processing started...');
        break;
      case 'workflow_completed':
        this.updateChatWithResults(data.results);
        break;
      case 'workflow_failed':
        toast.error('AI processing failed');
        break;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect(getCurrentUserId());
      }, 1000 * Math.pow(2, this.reconnectAttempts));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
```

## 4. Error Handling & Fallbacks

### Robust Error Handling

```typescript
// Enhanced error handling for N8N integration
const handleN8NError = (error: any, action: N8NAction) => {
  console.error('N8N Error:', error);
  
  // Log error for monitoring
  logError({
    type: 'n8n_workflow_error',
    action: action.type,
    error: error.message,
    timestamp: new Date().toISOString(),
    userId: currentUser?.id
  });
  
  // Provide fallback response
  const fallbackMessage: ChatMessage = {
    id: Date.now().toString(),
    type: 'ai',
    content: getFallbackMessage(action.type),
    timestamp: new Date(),
    n8nActions: [
      {
        id: 'retry',
        label: 'Try Again',
        type: action.type,
        webhookUrl: action.webhookUrl
      }
    ]
  };
  
  setMessages(prev => [...prev, fallbackMessage]);
};

const getFallbackMessage = (actionType: string): string => {
  const fallbacks = {
    'image_generation': 'I apologize, but I am currently unable to generate images. Please try again in a moment or describe your outfit needs, and I can provide text-based recommendations.',
    'style_analysis': 'I am having trouble analyzing your style right now. Could you tell me about your preferred colors, occasions, and style preferences instead?',
    'outfit_recommendation': 'My outfit recommendation system is temporarily unavailable. Let me help you manually - what is the occasion and what type of look are you going for?'
  };
  
  return fallbacks[actionType] || 'I apologize for the technical difficulty. Please try again or let me know how else I can help you with your fashion needs.';
};
```

## 5. Analytics & Monitoring

### Track N8N Usage

```typescript
// Analytics for N8N workflow usage
const trackN8NUsage = (action: N8NAction, success: boolean, duration?: number) => {
  const analyticsData = {
    event: 'n8n_workflow_triggered',
    properties: {
      action_type: action.type,
      success,
      duration,
      user_id: currentUser?.id,
      timestamp: new Date().toISOString()
    }
  };
  
  // Send to your analytics service
  analytics.track(analyticsData);
  
  // Update local usage stats
  updateLocalStats('n8n_usage', {
    total_workflows: 1,
    successful_workflows: success ? 1 : 0,
    failed_workflows: success ? 0 : 1
  });
};
```

## Next Steps

1. [Configure N8N Workflows](./workflow-examples.md)
2. [Set up API Endpoints](./api-endpoints.md)
3. [Test the Integration](./testing-guide.md)
4. [Deploy to Production](./deployment-guide.md)
