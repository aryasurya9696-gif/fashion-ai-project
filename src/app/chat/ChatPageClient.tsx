
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Bot,
  User,
  Send,
  Camera,
  Paperclip,
  ArrowLeft,
  Sparkles,
  Lock,
  Heart,
  X,
  Mic,
  Loader2,
  ImagePlus,
  ExternalLink
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  images?: string[];
  outfitCard?: OutfitRecommendation;
  renderImageUrl?: string;
}

interface OutfitRecommendation {
  id: string;
  title: string;
  occasion: string;
  tags: string[];
  imageUrl: string;
  description: string;
  _personDataUrl?: string;
  _dressDataUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function ChatPageClient() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [personIndex, setPersonIndex] = useState(0);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication from localStorage
    const authStatus = localStorage.getItem('fashionai_authenticated');
    const userDataStr = localStorage.getItem('fashionai_user');

    if (authStatus === 'true' && userDataStr) {
      const userData = JSON.parse(userDataStr);
      setIsAuthenticated(true);
      setCurrentUser(userData);

      // Initialize chat with welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: "Hello! I'm your AI fashion stylist. Upload photos of yourself and some outfit options, and I'll help you choose the perfect look for any occasion!",
        timestamp: new Date()
      };

      setMessages([welcomeMessage]);
      setIsLoading(false);
    } else {
      router.push('/auth');
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateUserStats = (action: string) => {
    if (!currentUser?.id) return;

    const statsKey = `user_stats_${currentUser.id}`;
    const existingStats = JSON.parse(localStorage.getItem(statsKey) || '{}');

    const updatedStats = {
      ...existingStats,
      [action]: (existingStats[action] || 0) + 1,
      lastActivity: new Date().toISOString()
    };

    localStorage.setItem(statsKey, JSON.stringify(updatedStats));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    if (validFiles.length === 0) {
      toast.error('Please select valid image files.');
      setIsUploading(false);
      return;
    }

    const newImages: string[] = [];
    let processedCount = 0;
    let hasErrors = false;

    validFiles.forEach(file => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          if (result && result.startsWith('data:image/')) {
            newImages.push(result);
          } else {
            hasErrors = true;
          }
        } catch (error) {
          console.error('Image processing error:', error);
          hasErrors = true;
        } finally {
          processedCount++;

          if (processedCount === validFiles.length) {
            setUploadedImages(prev => {
              const merged = [...prev, ...newImages];
              if (merged.length > 0 && (personIndex >= merged.length)) {
                setPersonIndex(0);
              }
              return merged;
            });
            setIsUploading(false);
            updateUserStats('photo');

            if (hasErrors) {
              toast.warning(`Uploaded ${newImages.length} photo(s) with some errors.`);
            } else {
              toast.success(`Successfully uploaded ${newImages.length} photo(s)!`);
            }

            event.target.value = '';
          }
        }
      };

      reader.onerror = () => {
        console.error('File reading error for:', file.name);
        hasErrors = true;
        processedCount++;

        if (processedCount === validFiles.length) {
          setUploadedImages(prev => {
            const merged = [...prev, ...newImages];
            if (merged.length > 0 && (personIndex >= merged.length)) {
              setPersonIndex(0);
            }
            return merged;
          });
          setIsUploading(false);

          if (newImages.length > 0) {
            toast.warning(`Uploaded ${newImages.length} photo(s) with some errors.`);
          } else {
            toast.error('Failed to read uploaded images.');
          }

          event.target.value = '';
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCameraCapture(true);
      }
    } catch (error) {
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    setUploadedImages(prev => [...prev, photoData]);
    updateUserStats('photo');

    // Stop camera stream
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    setShowCameraCapture(false);
    toast.success('Photo captured successfully!');
  };

  const closeCameraCapture = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCameraCapture(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const processAIResponse = async (userMessage: string, images: string[]) => {
    setIsTyping(true);
    updateUserStats('consultation');

    try {
      console.log('[DEBUG] Starting AI response processing');

      // Check webhook URL
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://tejuacc1234.app.n8n.cloud/webhook-test/c3e14950-4779-4765-973c-02276f48d072';
      console.log('[DEBUG] Using webhook URL:', webhookUrl);

      // Prepare the request payload
      const payload = {
        message: userMessage,
        images: images,
        userId: currentUser?.id || 'anonymous',
        sessionId: sessionStorage.getItem('sessionId') || 'default-session',
        timestamp: new Date().toISOString()
      };

      console.log('[DEBUG] Sending payload:', payload);

      let aiResponse = '';
      let outfitCard: OutfitRecommendation | undefined;

      if (images.length === 0) {
        // Allow text-only messages for n8n
        if (!userMessage.trim()) {
          setIsTyping(false);
          toast.error('Please upload photos or type a message.');
          return;
        }
      }

      // Send to n8n webhook (already declared above)
      // Optional API key support (for secured n8n endpoints)
      const n8nApiKey = process.env.NEXT_PUBLIC_N8N_API_KEY as string | undefined;

      // Prepare the data for n8n webhook
      const hasPerson = images.length >= 2;
      const selectedPerson = hasPerson ? (images[personIndex ?? 0] ?? images[0]) : undefined;
      const dresses = hasPerson ? images.filter((_, idx) => idx !== (personIndex ?? 0)) : images;

      const webhookData = {
        message: userMessage,
        images: images,
        hasPerson: hasPerson,
        personImage: selectedPerson,
        dressImages: dresses,
        occasion: userMessage || 'general occasion',
        timestamp: new Date().toISOString(),
        userId: currentUser?.id,
        userName: currentUser?.name,
        totalImages: images.length
      };

      console.log('[DEBUG] Sending to n8n webhook:', {
        url: webhookUrl,
        data: webhookData,
        hasApiKey: !!n8nApiKey
      });

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(n8nApiKey ? { 'X-API-Key': n8nApiKey } : {})
        },
        body: JSON.stringify(webhookData)
      });

      console.log('[DEBUG] Response status:', response.status);
      console.log('[DEBUG] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[DEBUG] Webhook failed:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        throw new Error(`Webhook failed: ${response.status} - ${errorText}`);
      }

      let responseData: any;
      let rawText: string | null = null;

      // First try to get raw text
      try {
        rawText = await response.text();
        console.log('[DEBUG] Raw response:', rawText);

        // Then try to parse as JSON
        try {
          responseData = JSON.parse(rawText);
          console.log('[DEBUG] Parsed JSON response:', {
            keys: Object.keys(responseData),
            hasRecommendation: !!responseData.recommendation,
            hasResponse: !!responseData.response,
            hasMessage: !!responseData.message,
            hasImages: !!responseData.images,
            hasImageUrl: !!responseData.imageUrl,
            hasSuccess: !!responseData.success,
            imagesCount: responseData.images?.length,
            imageUrl: responseData.imageUrl,
            fullData: responseData
          });
        } catch (jsonError) {
          console.log('[DEBUG] Not JSON response, using raw text');
          responseData = { response: rawText };
        }
      } catch (error) {
        console.error('[DEBUG] Failed to read response:', error);
        throw new Error('Failed to read webhook response');
      }

      // Handle the response from n8n - more flexible response handling
      if (!responseData || typeof responseData !== 'object') {
        console.error('[DEBUG] Invalid response structure:', {
          type: typeof responseData,
          value: responseData
        });
        throw new Error(`Invalid response structure from webhook. Got: ${typeof responseData}`);
      }

      // Check if responseData contains the problematic object structure
      if (responseData.taskId && responseData.model && responseData.state) {
        console.error('[DEBUG] Received task status object instead of response:', responseData);
        throw new Error('Received task status object instead of actual response. The webhook may be returning task metadata instead of the processed result.');
      }

      if (Object.keys(responseData).length === 0) {
        console.error('[DEBUG] Empty response data');
        throw new Error('Empty response from webhook');
      }

      // Accept any response that has content - check for any valid content
      const possibleFields = [
        'recommendation', 'response', 'message',
        'text', 'content', 'answer',
        'result', 'output', 'data', 'imageUrl'
      ];

      const foundField = possibleFields.find(field => responseData[field]);
      console.log('[DEBUG] Response field found:', foundField);
      console.log('[DEBUG] Checking response conditions:', {
        foundField,
        isString: typeof responseData === 'string',
        hasRawText: !!rawText,
        responseDataType: typeof responseData,
        hasImageUrl: !!responseData.imageUrl,
        hasSuccess: !!responseData.success,
        responseKeys: Object.keys(responseData)
      });

      // Check if we have ANY valid content (including imageUrl format)
      const hasValidContent = foundField || typeof responseData === 'string' || rawText ||
        (responseData.imageUrl && responseData.success === true);

      if (hasValidContent) {
        // Extract the actual response content
        aiResponse = responseData[foundField] ||
          (typeof responseData === 'string' ? responseData : null) ||
          rawText ||
          "I received your request but couldn\'t process the response properly. Please try again.";

        // Handle imageUrl response format
        if (foundField === 'imageUrl' && responseData.success === true) {
          aiResponse = "Here's your AI-generated outfit recommendation! The image has been processed successfully.";
        } else if (responseData.imageUrl && responseData.success === true) {
          // Handle case where imageUrl is found but not as the primary field
          aiResponse = "Here's your AI-generated outfit recommendation! The image has been processed successfully.";
        }

        // Ensure aiResponse is never an object, even if it comes from a field
        if (typeof aiResponse === 'object' && aiResponse !== null) {
          console.error('[DEBUG] Field content is still an object:', {
            field: foundField,
            content: aiResponse
          });
          aiResponse = 'I received an unexpected response format. Please try again or contact support.';
        }

        console.log('[DEBUG] Using response content:', aiResponse);

        // Create outfit card if we have image data and basic recommendation info
        if (images.length > 0 || responseData.images || responseData.imageUrl) {
          // Check if n8n returned generated images
          const generatedImages = responseData.images || [];
          const hasGeneratedImages = generatedImages.length > 0;

          // Handle imageUrl response format
          const hasImageUrl = responseData.imageUrl && responseData.success === true;
          let imageSource = [];

          if (hasImageUrl) {
            // Handle single imageUrl response
            imageSource = [responseData.imageUrl.replace(/`/g, '')]; // Remove backticks from URL
          } else if (hasGeneratedImages) {
            // Use generated images from n8n
            imageSource = generatedImages;
          } else {
            // Fall back to uploaded images
            imageSource = images;
          }

          console.log('[DEBUG] Image source selection:', {
            hasImageUrl,
            hasGeneratedImages,
            generatedCount: generatedImages.length,
            uploadedCount: images.length,
            imageSource: imageSource.length,
            usingSource: hasImageUrl ? 'imageUrl' : hasGeneratedImages ? 'generated' : 'uploaded'
          });

          // Try to find the best dress index from various possible field names
          let bestIndex = responseData.bestDressIndex ??
            responseData.selectedIndex ??
            responseData.recommendedIndex ??
            responseData.dressIndex ??
            0;

          let confidence = responseData.confidence ??
            responseData.score ??
            responseData.rating ??
            responseData.accuracy ??
            0.8; // Default confidence

          const offset = hasPerson ? 1 : 0;
          const dressImage = imageSource[bestIndex + offset] || imageSource[offset] || imageSource[0];

          outfitCard = {
            id: Date.now().toString(),
            title: responseData.title ||
              responseData.recommendationTitle ||
              responseData.outfitTitle ||
              (hasImageUrl ? 'AI Generated Outfit' : 'AI Stylist Recommendation'),
            occasion: responseData.occasion ||
              responseData.event ||
              responseData.context ||
              userMessage ||
              'General',
            tags: [
              ...(confidence !== undefined ? [`Confidence: ${(confidence * 100).toFixed(0)}%`] : []),
              ...(responseData.style ? [responseData.style] : []),
              ...(hasImageUrl ? ['AI Generated'] : []),
              ...(responseData.tags || responseData.additionalTags || [])
            ],
            imageUrl: dressImage,
            description: responseData.reasoning ||
              responseData.description ||
              responseData.explanation ||
              responseData.details ||
              aiResponse,
            _personDataUrl: hasPerson ? selectedPerson : undefined,
            _dressDataUrl: dressImage,
          };
        }
      } else {
        console.error('[DEBUG] No valid response content found:', {
          responseData,
          availableFields: Object.keys(responseData)
        });
        throw new Error('No valid response content found in webhook response');
      }

      // Ensure aiResponse is never an object
      if (typeof aiResponse === 'object' && aiResponse !== null) {
        console.error('[DEBUG] aiResponse is still an object:', aiResponse);
        aiResponse = 'I received an unexpected response format. Please try again or contact support.';
      }

      // Final check - if we still don't have a valid string response, provide a fallback
      if (!aiResponse || aiResponse === '') {
        console.error('[DEBUG] aiResponse is empty or null, providing fallback');
        aiResponse = 'I received your request but couldn\'t process the response properly. Please try again.';
      }

      // Create AI message with the response
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: typeof aiResponse === 'string' ? aiResponse : String(aiResponse || 'No response available'),
        timestamp: new Date(),
        outfitCard,
        images: responseData.images || undefined // Add generated images to the message if available
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Save chat history to localStorage
      saveChatHistory([...messages, aiMessage]);

      // Show success notification
      toast.success('AI stylist responded!');

    } catch (error) {
      console.error('AI processing error:', error);
      setIsTyping(false);

      // Show proper error message instead of automatic fallback
      let errorMessage = 'Sorry, I encountered an issue processing your request. ';

      if (error instanceof Error) {
        if (error.message.includes('Webhook failed')) {
          errorMessage += 'The AI service is temporarily unavailable. Please try again in a moment.';
        } else if (error.message.includes('Invalid response')) {
          errorMessage += 'I received an unexpected response. Please try again or contact support.';
        } else {
          errorMessage += 'Please try again or contact support if the issue persists.';
        }
      } else {
        errorMessage += 'Please try again or contact support if the issue persists.';
      }

      const errorMsg: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: errorMessage,
        timestamp: new Date()
        // Don't include outfitCard in error state
      };

      setMessages(prev => [...prev, errorMsg]);
      toast.error('AI service error - please try again.');
    }
  };

  const saveChatHistory = (chatMessages: Message[]) => {
    if (currentUser?.id) {
      const chatHistory = {
        user_id: currentUser.id,
        messages: chatMessages,
        session_title: chatMessages[chatMessages.length - 1]?.content?.slice(0, 50) || 'New Chat Session',
        created_at: new Date().toISOString()
      };

      // Save to localStorage
      const existingHistory = JSON.parse(localStorage.getItem('fashionai_chat_history') || '[]');

      // Check if this is a new session or update to existing
      const existingSessionIndex = existingHistory.findIndex((session: any) =>
        session.user_id === currentUser.id &&
        Math.abs(new Date(session.created_at).getTime() - new Date().getTime()) < 300000 // 5 minutes
      );

      if (existingSessionIndex >= 0) {
        // Update existing session
        existingHistory[existingSessionIndex] = chatHistory;
      } else {
        // Add new session
        existingHistory.push(chatHistory);
      }

      localStorage.setItem('fashionai_chat_history', JSON.stringify(existingHistory));

      // Notify dashboard of data update
      updateUserStats('consultation');
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && uploadedImages.length === 0) {
      toast.error('Please type a message or upload photos.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue || (uploadedImages.length > 0 ? `Uploaded ${uploadedImages.length} photo(s)` : ''),
      timestamp: new Date(),
      images: uploadedImages.length > 0 ? [...uploadedImages] : undefined
    };

    setMessages(prev => [...prev, userMessage]);

    // Clear input and reset state BEFORE processing
    const messageText = inputValue;
    const currentImages = [...uploadedImages]; // Create copy for processing
    setInputValue('');
    setUploadedImages([]);
    setPersonIndex(0); // Reset person index

    // Process AI response with the uploaded images
    await processAIResponse(messageText, currentImages);
  };

  const saveOutfit = async (outfit: OutfitRecommendation) => {
    if (!currentUser?.id) {
      toast.error('Please login to save outfits');
      return;
    }

    try {
      const newOutfit = {
        ...outfit,
        user_id: currentUser.id,
        created_at: new Date().toISOString()
      };

      // Save to localStorage
      const saved = localStorage.getItem('savedOutfits');
      const savedOutfits = saved ? JSON.parse(saved) : [];
      savedOutfits.push(newOutfit);
      localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));

      updateUserStats('save');
      toast.success('Outfit saved to your history!');
    } catch (error) {
      console.error('Failed to save outfit:', error);
      toast.error('Failed to save outfit');
    }
  };

  const regenerateOutfit = (occasion: string) => {
    const regenerateMessage = `Please regenerate a new look for ${occasion}`;
    processAIResponse(regenerateMessage, ['regenerate']);
    toast.success('Generating a new look for you!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your styling session...</p>
        </div>
      </div>
    );
  }

  // Authentication check
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full glass flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your personal AI stylist and get personalized outfit recommendations.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/auth">
                <Button className="btn-gradient w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Sign In to Continue
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="w-full glass border-primary/30">
                  Create New Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-border p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-lg font-bold font-poppins">
                    <span className="neon-pink">Fashion</span>AI
                  </h1>
                  <p className="text-xs text-muted-foreground">Your Personal Stylist</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Camera Capture Modal */}
      {showCameraCapture && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass max-w-2xl w-full rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Camera Capture
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeCameraCapture}
                  className="hover:text-primary"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={capturePhoto}
                  className="bg-gradient-to-r from-primary to-secondary hover-glow"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={closeCameraCapture}
                  className="glass border-border/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                      ? 'bg-gradient-to-r from-primary to-secondary'
                      : 'glass border border-primary/30'
                    }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`space-y-2 ${message.type === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    {/* Text Message */}
                    <div className={`p-4 rounded-2xl max-w-md ${message.type === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'glass border border-border'
                      }`}>
                      <p className="text-sm leading-relaxed">
                        {typeof message.content === 'string' ? message.content : String(message.content || 'No content available')}
                      </p>

                      {/* Images */}
                      {message.images && message.images.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {message.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`${message.type === 'ai' ? 'Generated' : 'Uploaded'} ${index + 1}`}
                                className="w-full h-64 object-cover rounded-xl image-premium image-hover-enhanced"
                              />
                              {message.type === 'ai' && (
                                <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 backdrop-blur-sm rounded-full px-3 py-1">
                                  <span className="text-white text-sm font-medium flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    AI Generated
                                  </span>
                                </div>
                              )}
                              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/80"
                                  onClick={() => window.open(image, '_blank')}
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  View Full
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Outfit Recommendation Card */}
                    {message.outfitCard && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="my-4"
                      >
                        <Card className="glass hover-glow w-96 overflow-hidden border border-border/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
                          <div className="relative group">
                            <img
                              src={message.outfitCard.imageUrl}
                              alt={message.outfitCard.title}
                              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105 image-premium"
                            />
                            <div className="absolute top-4 right-4">
                              <div className="bg-gradient-to-r from-pink-500 to-purple-600 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                                <span className="text-white text-sm font-medium">
                                  {message.outfitCard.occasion}
                                </span>
                              </div>
                            </div>
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/80 border border-white/20"
                                onClick={() => window.open(message.outfitCard.imageUrl, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Full
                              </Button>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <CardContent className="p-4">
                            <h3 className="font-bold text-lg mb-2">{message.outfitCard.title}</h3>
                            <p className="text-muted-foreground text-sm mb-3">
                              {message.outfitCard.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {message.outfitCard.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <Button className="w-full btn-gradient">
                              <Heart className="w-4 h-4 mr-2" />
                              Save Outfit
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Thinking Animation */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-start gap-3 mb-4"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg fashion-pulse">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                {/* Sparkle effects */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full sparkle" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full sparkle" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1 -left-2 w-2 h-2 bg-purple-400 rounded-full sparkle" style={{ animationDelay: '1s' }} />
              </div>
              <div className="flex-1">
                <div className="glass rounded-2xl p-4 max-w-md relative overflow-hidden">
                  {/* Gradient background animation */}
                  <div className="absolute inset-0 gradient-shift opacity-10" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-sm font-medium text-primary">AI Stylist is thinking...</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3 fashion-pulse" />
                      <span>Creating your perfect look</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                        <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Image Upload Preview */}
      {uploadedImages.length > 0 && (
        <div className="border-t border-border p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Uploaded Photos ({uploadedImages.length})</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg border ${index === personIndex ? 'border-primary ring-2 ring-primary' : 'border-border'}`}
                  />
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="w-6 h-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <Button
                      size="sm"
                      variant={index === personIndex ? 'default' : 'outline'}
                      className="h-6 px-2 text-[10px]"
                      onClick={() => setPersonIndex(index)}
                    >
                      {index === personIndex ? 'Person' : 'Set Person'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border glass sticky bottom-0">
        <div className="container mx-auto max-w-4xl">
          <div className="p-4">
            <div className="flex items-end gap-3">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="hover:text-primary"
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Paperclip className="w-5 h-5" />
                  )}
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCameraCapture}
                  className="hover:text-primary"
                >
                  <Camera className="w-5 h-5" />
                </Button>

                <Button size="icon" variant="ghost" className="hover:text-primary">
                  <Mic className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1">
                {/* Prompt suggestions */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {['office meeting', 'family function', 'party night', 'casual day out', 'date night', 'festival'].map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => setInputValue(s)} className="h-7 text-xs">
                      {s}
                    </Button>
                  ))}
                </div>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe the occasion or ask for styling advice..."
                  className="border-0 bg-transparent focus:ring-0 text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
              </div>

              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={(!inputValue.trim() && uploadedImages.length === 0) || isTyping}
                className="btn-gradient hover-glow"
              >
                {isTyping ? (
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <div className="absolute inset-0 w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin animation-delay-150" />
                    </div>
                  </div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
