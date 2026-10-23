
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  BarChart3
} from 'lucide-react';
import AnalyticsClient from './AnalyticsClient';

export default function AnalyticsPage() {
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
                <BarChart3 className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold font-poppins">
                  Style <span className="neon-pink">Analytics</span>
                </h1>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Your fashion insights
            </div>
          </div>
        </div>
      </header>

      <AnalyticsClient />
    </div>
  );
}
