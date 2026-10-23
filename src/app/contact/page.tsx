
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Mail, MessageCircle, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-2xl">
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
            <CardTitle className="text-3xl font-bold mb-4">Contact Us</CardTitle>
            <p className="text-muted-foreground">
              Get in touch with our team for support or inquiries
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 glass rounded-lg">
                <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">support@fashionai.com</p>
              </div>
              
              <div className="text-center p-4 glass rounded-lg">
                <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Chat</h3>
                <p className="text-sm text-muted-foreground">Live chat available</p>
              </div>
              
              <div className="text-center p-4 glass rounded-lg">
                <Phone className="w-8 h-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                We typically respond within 24 hours during business days.
              </p>
              <Link href="/dashboard">
                <Button className="btn-gradient hover-glow">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
