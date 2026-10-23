
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Camera, 
  Brain, 
  Palette, 
  Star,
  ArrowRight,
  Upload,
  MessageCircle,
  Download,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import Navbar from './Navbar';

export default function LandingPage() {
  const features = [
    {
      icon: Camera,
      title: 'Smart Photo Analysis',
      description: 'Upload your dress photos and let our AI analyze style, color, and occasion suitability.',
      color: 'text-primary'
    },
    {
      icon: Brain,
      title: 'AI Style Recommendations',
      description: 'Get personalized outfit suggestions based on your preferences and the occasion.',
      color: 'text-secondary'
    },
    {
      icon: Palette,
      title: 'Complete Look Generation',
      description: 'Receive styled outfit previews with accessories, shoes, and styling tips.',
      color: 'text-accent'
    },
    {
      icon: Sparkles,
      title: 'Occasion-Perfect Styling',
      description: 'Whether it\'s a family function or office meeting, get the perfect look every time.',
      color: 'text-primary'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Fashion Enthusiast',
      content: 'FashionAI helped me choose the perfect outfit for my sister\'s wedding. The AI suggestions were spot-on!',
      rating: 5
    },
    {
      name: 'Arjun Patel',
      role: 'Working Professional',
      content: 'As someone who struggles with fashion choices, this app is a lifesaver. Quick, accurate, and stylish recommendations.',
      rating: 5
    },
    {
      name: 'Sneha Reddy',
      role: 'College Student',
      content: 'Love how the AI understands different occasions. From casual to formal, it always gets it right!',
      rating: 5
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up for free and join our fashion community',
      icon: Upload
    },
    {
      number: '02',
      title: 'Upload & Chat with AI',
      description: 'Upload dress photos and chat with our AI stylist',
      icon: MessageCircle
    },
    {
      number: '03',
      title: 'Get Perfect Looks',
      description: 'Receive personalized outfit recommendations instantly',
      icon: Download
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your photos are processed securely and never stored permanently'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get AI-powered recommendations in seconds, not hours'
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Join our community of fashion-forward users worldwide'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar transparent />
      
      {/* Hero Section with 3D Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* 3D Spline Logo Reveal Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe 
            src='https://my.spline.design/logoreveal-SSxT9A5dZHMrkMP24Q87Gza1/' 
            frameBorder='0' 
            width='100%' 
            height='100%'
            className="absolute inset-0 w-full h-full object-cover"
            style={{ pointerEvents: 'none' }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Look Your Best.
              </span>
              <br />
              <span className="text-white drop-shadow-lg">Powered by AI.</span>
            </h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            >
              Your personal stylist for every occasion. Upload your dresses, get AI-powered outfit recommendations instantly.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap"
            >
              <Link href="/team">
                <Button 
                  size="lg" 
                  className="btn-gradient text-lg px-8 py-6 hover-glow group shadow-2xl"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Meet Our Team
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 text-white/70 text-sm"
            >
              <p>✨ No credit card required • 🔒 100% secure • 🚀 Instant access</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 relative bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full glass flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
              <span className="neon-pink">Powerful</span> Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of personal styling with our AI-powered features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass hover-glow h-full card-hover">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-full glass-strong flex items-center justify-center ${feature.color}`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
              How It <span className="neon-blue">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get styled in three simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 mb-12 ${
                  index % 2 === 1 ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <Card className="glass hover-glow card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-xl font-bold text-white">
                          {step.number}
                        </div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center text-primary">
                  <step.icon className="w-10 h-10" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
              What Our <span className="neon-gold">Users Say</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who trust FashionAI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass hover-glow h-full card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic text-sm leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              Ready to Transform Your <span className="neon-pink">Style?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who have discovered their perfect style with FashionAI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="btn-gradient text-lg px-12 py-6 hover-glow group"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Free Trial
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="glass border-primary/30 hover:border-primary text-lg px-12 py-6"
                >
                  Already have an account?
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold font-poppins">
                  <span className="neon-pink">Fashion</span>
                  <span className="neon-blue">AI</span>
                </span>
              </Link>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                Your personal AI stylist for every occasion. Look your best with intelligent fashion recommendations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="#features" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Features
                </Link>
                <Link href="/pricing" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Pricing
                </Link>
                <Link href="/faq" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQs
                </Link>
                <Link href="/team" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Our Team
                </Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
                <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p className="text-sm">&copy; 2024 FashionAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
