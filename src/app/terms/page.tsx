
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles, FileText } from 'lucide-react';

export default function TermsPage() {
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
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold mb-4">Terms of Service</CardTitle>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <h3 className="text-lg font-semibold text-primary">Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using FashionAI, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>

              <h3 className="text-lg font-semibold text-primary">Use License</h3>
              <p className="text-muted-foreground">
                Permission is granted to temporarily use FashionAI for personal, non-commercial 
                transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>

              <h3 className="text-lg font-semibold text-primary">User Account</h3>
              <p className="text-muted-foreground">
                You are responsible for safeguarding the password and for maintaining the 
                confidentiality of your account information.
              </p>

              <h3 className="text-lg font-semibold text-primary">AI Styling Service</h3>
              <p className="text-muted-foreground">
                Our AI styling recommendations are provided for informational purposes only. 
                Fashion choices and styling decisions remain your personal responsibility.
              </p>

              <h3 className="text-lg font-semibold text-primary">Limitation of Liability</h3>
              <p className="text-muted-foreground">
                FashionAI shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the service.
              </p>

              <h3 className="text-lg font-semibold text-primary">Contact Information</h3>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us at 
                legal@fashionai.com
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
