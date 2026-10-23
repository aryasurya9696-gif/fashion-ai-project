
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Shield } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold font-poppins">
              <span className="neon-pink">Fashion</span>
              <span className="neon-blue">AI</span>
            </span>
          </div>
        </div>

        <Card className="glass border-primary/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold mb-4">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold text-primary">Information We Collect</h3>
              <p className="text-muted-foreground">
                We collect information you provide directly to us, such as when you create an account, 
                upload photos for styling recommendations, or contact us for support.
              </p>

              <h3 className="text-lg font-semibold text-primary">How We Use Your Information</h3>
              <p className="text-muted-foreground">
                We use the information we collect to provide, maintain, and improve our AI styling services, 
                process your requests, and communicate with you about our services.
              </p>

              <h3 className="text-lg font-semibold text-primary">Data Security</h3>
              <p className="text-muted-foreground">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h3 className="text-lg font-semibold text-primary">Photo Processing</h3>
              <p className="text-muted-foreground">
                Photos uploaded for styling analysis are processed securely and are not stored permanently 
                on our servers unless you explicitly save them to your account.
              </p>

              <h3 className="text-lg font-semibold text-primary">Contact Us</h3>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at privacy@fashionai.com
              </p>
            </div>
            
            <div className="text-center pt-6 border-t border-border">
              <Link href="/">
                <Button className="btn-gradient hover-glow">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
