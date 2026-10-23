
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from '@/components/SplashScreen';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('fashionai_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // Auto-hide splash after 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Redirect authenticated users to dashboard after splash
    if (!showSplash && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [showSplash, isAuthenticated, router]);

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          !isAuthenticated && <LandingPage key="landing" />
        )}
      </AnimatePresence>
    </main>
  );
}
