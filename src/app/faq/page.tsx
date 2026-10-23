
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Sparkles, 
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  HelpCircle
} from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How does FashionAI analyze my photos?',
      answer: 'Our advanced AI uses computer vision and machine learning to analyze various aspects of your clothing including color, style, fit, fabric type, and occasion appropriateness. The AI considers factors like lighting, body type, and current fashion trends to provide personalized recommendations.',
      category: 'AI Technology'
    },
    {
      id: '2',
      question: 'Is my personal data and photos secure?',
      answer: 'Absolutely! We take privacy seriously. Your photos are processed securely using encrypted connections and are never stored permanently on our servers. All analysis happens in real-time, and your data is automatically deleted after processing. We comply with GDPR and other privacy regulations.',
      category: 'Privacy & Security'
    },
    {
      id: '3',
      question: 'How accurate are the AI recommendations?',
      answer: 'Our AI has been trained on millions of fashion images and styling combinations, achieving over 90% accuracy in style matching. The system continuously learns from user feedback and fashion trends. However, personal style is subjective, so we encourage you to use recommendations as a starting point for your own creativity.',
      category: 'AI Technology'
    },
    {
      id: '4',
      question: 'Can I use FashionAI for different occasions?',
      answer: 'Yes! FashionAI is designed to help with various occasions including family functions, business meetings, casual outings, parties, weddings, and more. Simply specify the occasion when asking for recommendations, and our AI will tailor suggestions accordingly.',
      category: 'Features'
    },
    {
      id: '5',
      question: 'What photo formats and quality do you support?',
      answer: 'We support JPG, PNG, and HEIC formats. For best results, use well-lit photos with good resolution (at least 1080p). The AI works better with clear, front-facing photos where the clothing is fully visible. You can upload up to 5 photos per consultation.',
      category: 'Technical'
    },
    {
      id: '6',
      question: 'How do I upgrade or downgrade my plan?',
      answer: 'You can change your plan anytime from your account settings. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle. We offer prorated billing for mid-cycle changes and a 30-day money-back guarantee.',
      category: 'Account & Billing'
    },
    {
      id: '7',
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. If you are not satisfied with FashionAI, contact our support team within 30 days of your purchase for a full refund. Free plan users can upgrade anytime without any commitment.',
      category: 'Account & Billing'
    },
    {
      id: '8',
      question: 'Can I save and organize my outfit recommendations?',
      answer: 'Absolutely! Pro and Premium users can save unlimited outfit recommendations to their style history. You can organize looks by occasion, season, or custom tags. Free users can save up to 5 looks. All saved outfits include the original photos and AI recommendations.',
      category: 'Features'
    }
  ];

  const categories = ['all', 'AI Technology', 'Privacy & Security', 'Features', 'Technical', 'Account & Billing'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

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
              <HelpCircle className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold font-poppins">
                <span className="neon-pink">Help</span> Center
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
            Frequently Asked <span className="neon-blue">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about FashionAI and get the help you need
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass border-primary/30 focus:border-primary"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-background border border-primary/30 rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <HelpCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or browse all categories
              </p>
            </motion.div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="glass hover-glow">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold">{faq.question}</h3>
                      </div>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <div className="border-t border-border pt-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Cannot find the answer you are looking for? Our support team is here to help you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <Button className="btn-gradient flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Live Chat Support
                  </Button>
                </Link>
                <Button variant="outline" className="glass border-primary/30 hover:border-primary flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
