
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  TrendingUp,
  Calendar,
  Heart,
  Camera,
  MessageCircle,
  Star,
  Target,
  Clock,
  Award
} from 'lucide-react';

interface AnalyticsData {
  totalConsultations: number;
  savedOutfits: number;
  photosAnalyzed: number;
  styleScore: number;
  weeklyActivity: number[];
  topOccasions: { name: string; count: number }[];
  stylePreferences: { category: string; percentage: number }[];
}

export default function AnalyticsClient() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalConsultations: 0,
    savedOutfits: 0,
    photosAnalyzed: 0,
    styleScore: 0,
    weeklyActivity: [2, 5, 3, 8, 6, 4, 7],
    topOccasions: [
      { name: 'Family Function', count: 8 },
      { name: 'Office Meeting', count: 6 },
      { name: 'Casual Outing', count: 4 },
      { name: 'Party', count: 3 }
    ],
    stylePreferences: [
      { category: 'Traditional', percentage: 35 },
      { category: 'Professional', percentage: 28 },
      { category: 'Casual', percentage: 22 },
      { category: 'Party Wear', percentage: 15 }
    ]
  });

  useEffect(() => {
    // Load analytics data from localStorage
    const stats = localStorage.getItem('fashionai_stats');
    const savedOutfits = localStorage.getItem('savedOutfits');
    
    if (stats) {
      const parsedStats = JSON.parse(stats);
      setAnalyticsData(prev => ({
        ...prev,
        totalConsultations: parsedStats.consultations || 0,
        savedOutfits: parsedStats.savedLooks || 0,
        photosAnalyzed: parsedStats.photosAnalyzed || 0,
        styleScore: parseInt(parsedStats.styleScore) || 0
      }));
    }
  }, []);

  const insights = [
    {
      title: 'Most Active Day',
      value: 'Thursday',
      description: 'You style the most on Thursdays',
      icon: Calendar,
      color: 'text-primary'
    },
    {
      title: 'Favorite Style',
      value: 'Traditional',
      description: '35% of your saved looks',
      icon: Heart,
      color: 'text-secondary'
    },
    {
      title: 'Style Streak',
      value: '7 days',
      description: 'Current styling streak',
      icon: Award,
      color: 'text-accent'
    },
    {
      title: 'AI Accuracy',
      value: '94%',
      description: 'Recommendation satisfaction',
      icon: Target,
      color: 'text-primary'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Overview Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-3 text-primary" />
            <div className="text-2xl font-bold mb-1">{analyticsData.totalConsultations}</div>
            <div className="text-sm text-muted-foreground">AI Consultations</div>
          </CardContent>
        </Card>
        
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-3 text-secondary" />
            <div className="text-2xl font-bold mb-1">{analyticsData.savedOutfits}</div>
            <div className="text-sm text-muted-foreground">Saved Looks</div>
          </CardContent>
        </Card>
        
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <Camera className="w-8 h-8 mx-auto mb-3 text-accent" />
            <div className="text-2xl font-bold mb-1">{analyticsData.photosAnalyzed}</div>
            <div className="text-sm text-muted-foreground">Photos Analyzed</div>
          </CardContent>
        </Card>
        
        <Card className="glass hover-glow">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-3 text-primary" />
            <div className="text-2xl font-bold mb-1">{analyticsData.styleScore}%</div>
            <div className="text-sm text-muted-foreground">Style Score</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-muted-foreground">{day}</div>
                    <div className="flex-1 bg-muted rounded-full h-3 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(analyticsData.weeklyActivity[index] / 10) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
                      />
                    </div>
                    <div className="w-8 text-sm font-medium">{analyticsData.weeklyActivity[index]}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Occasions */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                Top Occasions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topOccasions.map((occasion, index) => (
                  <div key={occasion.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-primary' : 
                        index === 1 ? 'bg-secondary' : 
                        index === 2 ? 'bg-accent' : 'bg-muted-foreground'
                      }`} />
                      <span className="text-sm">{occasion.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(occasion.count / 10) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                          className={`h-full rounded-full ${
                            index === 0 ? 'bg-primary' : 
                            index === 1 ? 'bg-secondary' : 
                            index === 2 ? 'bg-accent' : 'bg-muted-foreground'
                          }`}
                        />
                      </div>
                      <span className="text-sm font-medium w-6">{occasion.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Style Preferences */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-8"
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Style Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsData.stylePreferences.map((style, index) => (
                <div key={style.category} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted"
                      />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                        animate={{ 
                          strokeDashoffset: 2 * Math.PI * 40 * (1 - style.percentage / 100) 
                        }}
                        transition={{ duration: 1, delay: 0.4 + index * 0.1 }}
                        className={
                          index === 0 ? 'text-primary' : 
                          index === 1 ? 'text-secondary' : 
                          index === 2 ? 'text-accent' : 'text-primary'
                        }
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">{style.percentage}%</span>
                    </div>
                  </div>
                  <h3 className="font-medium">{style.category}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights Grid */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {insights.map((insight, index) => (
          <Card key={insight.title} className="glass hover-glow">
            <CardContent className="p-6 text-center">
              <insight.icon className={`w-8 h-8 mx-auto mb-3 ${insight.color}`} />
              <div className="text-xl font-bold mb-1">{insight.value}</div>
              <div className="text-sm font-medium mb-2">{insight.title}</div>
              <div className="text-xs text-muted-foreground">{insight.description}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Action Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8"
      >
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Keep Styling!</h3>
            <p className="text-muted-foreground mb-6">
              Your style journey is looking great. Continue exploring new looks with our AI stylist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button className="bg-gradient-to-r from-primary to-secondary hover-glow">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start New Session
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="outline" className="glass border-primary/30 hover:border-primary">
                  <Heart className="w-4 h-4 mr-2" />
                  View Saved Looks
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
