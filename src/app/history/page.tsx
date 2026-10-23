
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Download, 
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Tag,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api-client';

interface SavedOutfit {
  id: string;
  title: string;
  occasion: string;
  tags: string[];
  image_url: string;
  description: string;
  created_at: string;
  user_id: string;
}

export default function HistoryPage() {
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem('fashionai_user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchSavedOutfits();
    }
  }, [currentUser]);

  const fetchSavedOutfits = async () => {
    try {
      setIsLoading(true);
      const outfits = await api.get<SavedOutfit[]>(`/outfits?user_id=${currentUser.id}`);
      setSavedOutfits(outfits);
    } catch (error) {
      // Fallback to localStorage for demo
      const saved = localStorage.getItem('savedOutfits');
      if (saved) {
        setSavedOutfits(JSON.parse(saved));
      } else {
        // Add some demo data
        const demoOutfits: SavedOutfit[] = [
          {
            id: '1',
            title: 'Family Function Elegance',
            occasion: 'Family Function',
            tags: ['Elegant', 'Festive', 'Traditional'],
            image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
            description: 'Perfect for family gatherings with traditional elegance',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            user_id: currentUser?.id || 'demo'
          },
          {
            id: '2',
            title: 'Office Professional',
            occasion: 'Business Meeting',
            tags: ['Professional', 'Modern', 'Confident'],
            image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop',
            description: 'Sophisticated look for important business meetings',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            user_id: currentUser?.id || 'demo'
          },
          {
            id: '3',
            title: 'Casual Weekend',
            occasion: 'Casual Outing',
            tags: ['Casual', 'Comfortable', 'Trendy'],
            image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
            description: 'Relaxed yet stylish for weekend activities',
            created_at: new Date(Date.now() - 259200000).toISOString(),
            user_id: currentUser?.id || 'demo'
          }
        ];
        setSavedOutfits(demoOutfits);
        localStorage.setItem('savedOutfits', JSON.stringify(demoOutfits));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOutfits = savedOutfits.filter(outfit => {
    const matchesSearch = outfit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outfit.occasion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outfit.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         outfit.occasion.toLowerCase().includes(selectedFilter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const deleteOutfit = async (id: string) => {
    try {
      await api.delete(`/outfits?id=${id}`);
      setSavedOutfits(prev => prev.filter(outfit => outfit.id !== id));
      toast.success('Outfit removed from history');
    } catch (error) {
      // Fallback to localStorage
      const updated = savedOutfits.filter(outfit => outfit.id !== id);
      setSavedOutfits(updated);
      localStorage.setItem('savedOutfits', JSON.stringify(updated));
      toast.success('Outfit removed from history');
    }
  };

  const occasions = ['all', 'family function', 'business meeting', 'casual outing', 'party', 'wedding'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading your saved outfits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold font-poppins">
                  Style <span className="neon-pink">History</span>
                </h1>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredOutfits.length} saved looks
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Search and Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, occasion, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass border-primary/30 focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-background border border-primary/30 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    {occasions.map(occasion => (
                      <option key={occasion} value={occasion}>
                        {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Outfits Grid */}
        {filteredOutfits.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved outfits found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start chatting with our AI to create and save your first outfit!'
              }
            </p>
            <Link href="/chat">
              <Button className="btn-gradient">
                <Sparkles className="w-4 h-4 mr-2" />
                Start Styling
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOutfits.map((outfit, index) => (
              <motion.div
                key={outfit.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass hover-glow card-hover overflow-hidden">
                  <div className="relative">
                    <img
                      src={outfit.image_url}
                      alt={outfit.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-sm font-medium">
                          {outfit.occasion}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-4 left-4 w-8 h-8 rounded-full"
                      onClick={() => deleteOutfit(outfit.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{outfit.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {outfit.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {outfit.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(outfit.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Recreate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
