
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Trash2, Eye, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Photo {
  id: string;
  data: string;
  timestamp: string;
  type: 'camera_capture' | 'file_upload';
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    const savedPhotos = JSON.parse(localStorage.getItem('fashionai_photos') || '[]');
    setPhotos(savedPhotos);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const photoData = e.target?.result as string;
      const newPhoto: Photo = {
        id: Date.now().toString(),
        data: photoData,
        timestamp: new Date().toISOString(),
        type: 'file_upload'
      };

      const updatedPhotos = [newPhoto, ...photos];
      setPhotos(updatedPhotos);
      localStorage.setItem('fashionai_photos', JSON.stringify(updatedPhotos));
      toast.success('Photo uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    localStorage.setItem('fashionai_photos', JSON.stringify(updatedPhotos));
    toast.success('Photo deleted successfully');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          My Photos ({photos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No photos uploaded yet</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="glass border-primary/30 hover:border-primary" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload from Gallery
                  </span>
                </Button>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upload Button */}
            <div className="flex justify-end">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-existing"
              />
              <label htmlFor="file-upload-existing">
                <Button variant="outline" size="sm" className="glass border-primary/30 hover:border-primary" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Add More
                  </span>
                </Button>
              </label>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <Card className="glass-strong overflow-hidden hover-glow">
                    <div className="aspect-square relative">
                      <img
                        src={photo.data}
                        alt="Uploaded photo"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setSelectedPhoto(photo)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Camera className="w-5 h-5 text-primary" />
                                Photo Details
                              </DialogTitle>
                            </DialogHeader>
                            {selectedPhoto && (
                              <div className="space-y-4">
                                <img
                                  src={selectedPhoto.data}
                                  alt="Full size photo"
                                  className="w-full rounded-lg"
                                />
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(selectedPhoto.timestamp)}
                                    </span>
                                  </div>
                                  <Badge variant={selectedPhoto.type === 'camera_capture' ? 'default' : 'secondary'}>
                                    {selectedPhoto.type === 'camera_capture' ? 'Camera' : 'Upload'}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deletePhoto(photo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Type Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge 
                          variant={photo.type === 'camera_capture' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {photo.type === 'camera_capture' ? (
                            <Camera className="w-3 h-3 mr-1" />
                          ) : (
                            <Upload className="w-3 h-3 mr-1" />
                          )}
                          {photo.type === 'camera_capture' ? 'Camera' : 'Upload'}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(photo.timestamp)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
