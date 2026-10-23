
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Star,
  Zap,
  Crown,
  Camera,
  Brain,
  Heart,
  Download,
  Shield,
  Headphones
} from 'lucide-react';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out FashionAI',
      price: { monthly: 0, yearly: 0 },
      icon: Sparkles,
      color: 'text-muted-foreground',
      features: [
        '5 AI consultations per month',
        'Basic outfit recommendations',
        'Upload up to 3 photos',
        'Standard processing speed',
        'Community support'
      ],
      limitations: [
        'Limited styling options',
        'Basic AI responses',
        'No priority support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      description: 'Best for fashion enthusiasts',
      price: { monthly: 19, yearly: 190 },
      icon: Zap,
      color: 'text-primary',
      features: [
        'Unlimited AI consultations',
        'Advanced outfit recommendations',
        'Upload up to 10 photos per session',
        'Fast processing speed',
        'Occasion-specific styling',
        'Save unlimited looks',
        'Download high-res images',
        'Priority email support'
      ],
      limitations: [],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Premium',
      description: 'For style professionals & influencers',
      price: { monthly: 49, yearly: 490 },
      icon: Crown,
      color: 'text-accent',
      features: [
        'Everything in Pro',
        'Personal style profile',
        'Brand collaboration tools',
        'Advanced analytics',
        'Custom styling sessions',
        'White-label options',
        'API access',
        '24/7 priority support',
        'Personal stylist consultation'
      ],
      limitations: [],
      cta: 'Go Premium',
      popular: false
    }
  ];

  const features = [
    {
      icon: Camera,
      title: 'Smart Photo Analysis',
      description: 'Advanced AI analyzes your photos for style, fit, and occasion suitability'
    },
    {
      icon: Brain,
      title: 'Personalized Recommendations',
      description: 'Get outfit suggestions tailored to your style preferences and body type'
    },
    {
      icon: Heart,
      title: 'Style History',
      description: 'Save and organize your favorite looks for future reference'
    },
    {
      icon: Download,
      title: 'High-Quality Exports',
      description: 'Download styled outfit images in high resolution for sharing'
    },
    {
      icon: Shield,
      title: 'Privacy Protected',
      description: 'Your photos are processed securely and never stored permanently'
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Get help from our fashion experts and technical support team'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold font-poppins">
                <span className="neon-pink">Pricing</span> Plans
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Choose Your <span className="neon-blue">Style Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Unlock the full potential of AI-powered fashion recommendations with our flexible pricing plans
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
                Save 20%
              </span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <Card className={`glass hover-glow card-hover h-full ${
                plan.popular ? 'border-primary/50' : ''
              }`}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full glass-strong flex items-center justify-center ${plan.color}`}>
                    <plan.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  
                  <div className="mt-4">
                    <div className="text-4xl font-bold">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                      {plan.price.monthly > 0 && (
                        <span className="text-lg text-muted-foreground font-normal">
                          /{isYearly ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {isYearly && plan.price.monthly > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        ${(plan.price.monthly * 12).toFixed(0)} billed annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'btn-gradient hover-glow' 
                        : 'glass border-primary/30 hover:border-primary'
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>

                  {plan.name === 'Free' && (
                    <p className="text-xs text-muted-foreground text-center">
                      No credit card required
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold font-poppins mb-4">
              Everything You Need for <span className="neon-gold">Perfect Style</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools helps you look your best for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Card className="glass hover-glow card-hover h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full glass-strong flex items-center justify-center text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Check out our FAQ section or contact our support team for personalized assistance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/faq">
                  <Button variant="outline" className="glass border-primary/30 hover:border-primary">
                    View FAQs
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="btn-gradient">
                    Contact Support
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
