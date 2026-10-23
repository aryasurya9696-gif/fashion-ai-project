
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sparkles, 
  MessageCircle, 
  History, 
  User, 
  CreditCard,
  HelpCircle,
  LogOut,
  Brain,
  Heart,
  TrendingUp,
  Calendar,
  Star,
  Camera,
  BarChart3,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  plan: string;
}

interface DashboardStats {
  consultations: number;
  savedLooks: number;
  photosAnalyzed: number;
  styleScore: string;
  totalSessions: number;
  lastActive: string;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    consultations: 0,
    savedLooks: 0,
    photosAnalyzed: 0,
    styleScore: '0%',
    totalSessions: 0,
    lastActive: 'Never'
  });
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem('fashionai_authenticated');
    const userDataStr = localStorage.getItem('fashionai_user');
    
    if (authStatus === 'true' && userDataStr) {
      setIsAuthenticated(true);
      const user = JSON.parse(userDataStr);
      setUserData(user);
      loadUserStats(user.id);
    } else {
      router.push('/auth');
    }
  }, [router]);

  const loadUserStats = (userId: string) => {
    try {
      // Load real data from localStorage
      const chatHistory = localStorage.getItem('fashionai_chat_history');
      const chatSessions = chatHistory ? JSON.parse(chatHistory) : [];
      const userSessions = chatSessions.filter((session: any) => session.user_id === userId);
      
      const savedOutfits = localStorage.getItem('savedOutfits');
      const outfits = savedOutfits ? JSON.parse(savedOutfits) : [];
      const userOutfits = outfits.filter((outfit: any) => outfit.user_id === userId);
      
      // Count photos from chat messages
      let photosCount = 0;
      userSessions.forEach((session: any) => {
        if (session.messages && Array.isArray(session.messages)) {
          session.messages.forEach((message: any) => {
            if (message.images && Array.isArray(message.images)) {
              photosCount += message.images.length;
            }
          });
        }
      });
      
      // Calculate style score based on real activity
      const consultationsCount = userSessions.length;
      const savedLooksCount = userOutfits.length;
      const activityScore = Math.min(
        (consultationsCount * 10) + (savedLooksCount * 15) + (photosCount * 5), 
        100
      );
      
      // Get last active time from most recent session
      let lastActiveTime = 'Never';
      if (userSessions.length > 0) {
        const sortedSessions = userSessions.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const mostRecent = sortedSessions[0];
        if (mostRecent.created_at) {
          lastActiveTime = new Date(mostRecent.created_at).toLocaleString();
        }
      }
      
      setStats({
        consultations: consultationsCount,
        savedLooks: savedLooksCount,
        photosAnalyzed: photosCount,
        styleScore: activityScore + '%',
        totalSessions: consultationsCount,
        lastActive: lastActiveTime
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
      // Keep stats at zero if there's an error
      setStats({
        consultations: 0,
        savedLooks: 0,
        photosAnalyzed: 0,
        styleScore: '0%',
        totalSessions: 0,
        lastActive: 'Never'
      });
    }
  };

  // Refresh stats when component becomes visible (user returns from chat)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated && userData?.id) {
        loadUserStats(userData.id);
      }
    };

    const handleStorageChange = () => {
      if (isAuthenticated && userData?.id) {
        loadUserStats(userData.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when data is updated
    window.addEventListener('fashionai-data-updated', handleStorageChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('fashionai-data-updated', handleStorageChange);
    };
  }, [isAuthenticated, userData?.id]);

  const handleLogout = () => {
    localStorage.removeItem('fashionai_authenticated');
    localStorage.removeItem('fashionai_user');
    localStorage.removeItem('fashionai_stats');
    localStorage.removeItem('savedOutfits');
    localStorage.removeItem('fashionai_chat_history');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const dashboardStats = [
    { 
      label: 'AI Consultations', 
      value: stats.consultations.toString(), 
      icon: Brain, 
      color: 'text-primary',
      description: 'Chat sessions with AI stylist'
    },
    { 
      label: 'Saved Looks', 
      value: stats.savedLooks.toString(), 
      icon: Heart, 
      color: 'text-secondary',
      description: 'Outfits saved to your collection'
    },
    { 
      label: 'Photos Analyzed', 
      value: stats.photosAnalyzed.toString(), 
      icon: Camera, 
      color: 'text-accent',
      description: 'Images processed by AI'
    },
    { 
      label: 'Style Score', 
      value: stats.styleScore, 
      icon: Star, 
      color: 'text-primary',
      description: 'Your fashion expertise level'
    }
  ];

  const quickActions = [
    {
      title: 'Start AI Chat',
      description: 'Get instant fashion recommendations',
      icon: MessageCircle,
      href: '/chat',
      color: 'bg-gradient-to-r from-primary to-secondary'
    },
    {
      title: 'View History',
      description: 'Browse your saved looks',
      icon: History,
      href: '/history',
      color: 'bg-gradient-to-r from-secondary to-accent'
    },
    {
      title: 'My Profile',
      description: 'Manage your account settings',
      icon: User,
      href: '/profile',
      color: 'bg-gradient-to-r from-accent to-primary'
    },
    {
      title: 'Analytics',
      description: 'View your style insights',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-gradient-to-r from-primary via-secondary to-accent'
    }
  ];

  const getRecentActivity = () => {
    const activities = [];
    
    if (stats.consultations > 0) {
      activities.push({
        type: 'consultation',
        title: 'AI Style Sessions',
        description: `${stats.consultations} styling consultations completed`,
        time: stats.lastActive,
        icon: Sparkles
      });
    }
    
    if (stats.savedLooks > 0) {
      activities.push({
        type: 'save',
        title: 'Saved Outfits',
        description: `${stats.savedLooks} looks saved to collection`,
        time: 'In your history',
        icon: Heart
      });
    }
    
    if (stats.photosAnalyzed > 0) {
      activities.push({
        type: 'analysis',
        title: 'Photo Analysis',
        description: `${stats.photosAnalyzed} photos processed by AI`,
        time: 'AI processing complete',
        icon: Camera
      });
    }
    
    // If no activity, show getting started message
    if (activities.length === 0) {
      activities.push({
        type: 'welcome',
        title: 'Welcome to FashionAI',
        description: 'Start your first styling session to see activity here',
        time: 'Get started now',
        icon: Sparkles
      });
    }
    
    return activities;
  };

  if (!isAuthenticated || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading dashboard...</p>
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
              <Link href="/" className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold font-poppins">
                  <span className="neon-pink">Fashion</span>
                  <span className="neon-blue">AI</span>
                </span>
              </Link>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="font-medium">{userData.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{userData.plan} Plan</p>
              </div>
              
              <Button
                variant="outline"
                onClick={handleLogout}
                className="glass border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-500 hover:text-red-400 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Welcome back, <span className="neon-pink">{userData.name.split(' ')[0]}</span>!
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    {stats.consultations === 0 
                      ? "Ready to start your first styling session?" 
                      : "Ready to discover your perfect style today?"
                    }
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(userData.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {dashboardStats.map((stat, index) => (
            <Card key={stat.label} className="glass hover-glow">
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <Link key={action.title} href={action.href}>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        >
                          <Card className="glass hover-glow cursor-pointer group">
                            <CardContent className="p-6">
                              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <action.icon className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="font-semibold mb-2">{action.title}</h3>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity & Insights */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary" />
                    Activity Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getRecentActivity().map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg glass-strong"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Progress Goals */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    Style Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Style Score</span>
                      <span className="font-medium">{stats.styleScore}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: stats.styleScore }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Collection Goal</span>
                      <span className="font-medium">{stats.savedLooks}/20</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((stats.savedLooks / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <Zap className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {stats.consultations === 0 ? "Ready to Get Started?" : "Ready to Style?"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {stats.consultations === 0 
                  ? "Start your first conversation with our AI stylist to get personalized outfit recommendations"
                  : "Continue your styling journey with our AI stylist for more personalized recommendations"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover-glow">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {stats.consultations === 0 ? "Start First Chat" : "Continue Styling"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
