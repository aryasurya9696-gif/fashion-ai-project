
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles, User, LogOut, Users, MessageCircle, History, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LucideIcon } from 'lucide-react';

interface NavbarProps {
  transparent?: boolean;
}

interface NavItem {
  name: string;
  href: string;
  icon?: LucideIcon;
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('fashionai_authenticated');
    const userDataStr = localStorage.getItem('fashionai_user');
    
    if (authStatus === 'true' && userDataStr) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(userDataStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fashionai_authenticated');
    localStorage.removeItem('fashionai_user');
    localStorage.removeItem('fashionai_stats');
    localStorage.removeItem('savedOutfits');
    localStorage.removeItem('fashionai_chat_history');
    setIsAuthenticated(false);
    setUserData(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Navigation items for non-authenticated users
  const publicNavItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQs', href: '/faq' },
  ];

  // Navigation items for authenticated users
  const authenticatedNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'AI Chat', href: '/chat', icon: MessageCircle },
    { name: 'History', href: '/history', icon: History },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 ${
        transparent ? 'bg-transparent' : 'glass'
      } backdrop-blur-md`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
            <Sparkles className="w-8 h-8 text-primary group-hover:text-secondary transition-colors" />
            <span className="text-2xl font-bold font-poppins">
              <span className="neon-pink">Fashion</span>
              <span className="neon-blue">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200 font-medium"
                >
                  {isAuthenticated && IconComponent && (
                    <IconComponent className="w-4 h-4" />
                  )}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{userData?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userData?.plan} Plan</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="glass border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-500 hover:text-red-400 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass rounded-lg mt-2 p-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {isAuthenticated && IconComponent && (
                      <IconComponent className="w-4 h-4" />
                    )}
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-border pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="font-medium">{userData?.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{userData?.plan} Plan</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full glass border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-500 hover:text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
