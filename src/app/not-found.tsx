
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <Card className="glass border-primary/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold font-poppins">
                <span className="neon-pink">Fashion</span>
                <span className="neon-blue">AI</span>
              </span>
            </div>
            <CardTitle className="text-6xl font-bold text-primary mb-4">404</CardTitle>
            <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button className="btn-gradient hover-glow group">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                  <ArrowLeft className="w-4 h-4 ml-2 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="outline" className="glass border-primary/30 hover:border-primary">
                  Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Need help? Contact our support team.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
