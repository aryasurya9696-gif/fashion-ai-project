
'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, Upload, X, RotateCcw, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onPhotoCapture?: (photoData: string) => void;
  className?: string;
}

export default function CameraCapture({ onPhotoCapture, className }: CameraCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhoto(photoData);
    
    toast.success('Photo captured successfully!');
  }, []);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
  }, []);

  const uploadPhoto = useCallback(() => {
    if (!capturedPhoto) return;

    // Save to localStorage for demo purposes
    const savedPhotos = JSON.parse(localStorage.getItem('fashionai_photos') || '[]');
    const newPhoto = {
      id: Date.now().toString(),
      data: capturedPhoto,
      timestamp: new Date().toISOString(),
      type: 'camera_capture'
    };
    
    savedPhotos.unshift(newPhoto);
    localStorage.setItem('fashionai_photos', JSON.stringify(savedPhotos));

    // Call the callback if provided
    if (onPhotoCapture) {
      onPhotoCapture(capturedPhoto);
    }

    toast.success('Photo uploaded successfully!');
    handleClose();
  }, [capturedPhoto, onPhotoCapture]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedPhoto(null);
    setIsOpen(false);
  }, [stopCamera]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    startCamera();
  }, [startCamera]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={handleOpen}
          className={`bg-gradient-to-r from-primary to-secondary hover-glow ${className}`}
        >
          <Camera className="w-4 h-4 mr-2" />
          Take Photo
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Camera Capture
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!capturedPhoto ? (
            // Camera View
            <Card className="glass-strong">
              <CardContent className="p-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                        <p>Starting camera...</p>
                      </div>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    onClick={capturePhoto}
                    disabled={!stream || isLoading}
                    className="bg-gradient-to-r from-primary to-secondary hover-glow"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Photo
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="glass border-border/50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Photo Preview
            <Card className="glass-strong">
              <CardContent className="p-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <img
                    src={capturedPhoto}
                    alt="Captured photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex justify-center gap-4 mt-4">
                  <Button
                    onClick={uploadPhoto}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover-glow"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={retakePhoto}
                    className="glass border-border/50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="glass border-border/50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
