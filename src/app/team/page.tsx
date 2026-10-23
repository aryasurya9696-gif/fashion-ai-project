'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Heart, 
  Users, 
  Code, 
  Palette, 
  Brain,
  Star,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';
import Link from 'next/link';


const teamMembers = [
  {
    name: 'Sneha Lokhande',
    role: 'Lead Developer & AI Specialist',
    image: '/team/sneha.svg',
    color: 'from-green-400 to-emerald-600',
    description: 'Specialized in AI integration and machine learning algorithms for fashion recommendations.',
    skills: ['AI/ML', 'Python', 'TensorFlow', 'Fashion Tech'],
    contribution: 'Developed the core AI styling engine and recommendation algorithms'
  },
  {
    name: 'Arya Suryawanshi',
    role: 'Frontend Developer & UX Designer',
    image: '/team/arya.svg',
    color: 'from-blue-400 to-indigo-600',
    description: 'Expert in creating beautiful, intuitive user interfaces and seamless user experiences.',
    skills: ['React', 'Next.js', 'UI/UX', 'Tailwind CSS'],
    contribution: 'Designed and implemented the stunning user interface and user experience'
  },
  {
    name: 'Vaibhavi Rajput',
    role: 'Backend Developer & Database Architect',
    image: '/team/vaibhavi.svg',
    color: 'from-purple-400 to-violet-600',
    description: 'Focused on building robust backend systems and efficient database architectures.',
    skills: ['Node.js', 'PostgreSQL', 'API Design', 'Cloud Services'],
    contribution: 'Built the scalable backend infrastructure and database systems'
  },
  {
    name: 'Tejaswini Jadhav',
    role: 'Full Stack Developer & Project Manager',
    image: '/team/tejaswini.svg',
    color: 'from-red-400 to-pink-600',
    description: 'Coordinated the project development and contributed to both frontend and backend.',
    skills: ['Full Stack', 'Project Management', 'DevOps', 'Quality Assurance'],
    contribution: 'Managed project coordination and ensured seamless integration across all components'
  }
];

const projectHighlights = [
  {
    icon: Brain,
    title: 'AI-Powered Styling',
    description: 'Advanced machine learning algorithms for personalized fashion recommendations'
  },
  {
    icon: Palette,
    title: 'Beautiful Design',
    description: 'Modern, responsive interface with stunning visual effects and animations'
  },
  {
    icon: Code,
    title: 'Robust Architecture',
    description: 'Scalable backend with efficient database design and API architecture'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamless teamwork combining diverse skills and expertise'
  }
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border p-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold font-poppins">
                <span className="neon-pink">Fashion</span>
                <span className="neon-blue">AI</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="glass">
                  Dashboard
                </Button>
              </Link>
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-12 h-12 text-primary" />
            <Heart className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Meet Our <span className="neon-pink">Amazing</span> Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Four talented developers who came together to create this revolutionary AI-powered fashion styling platform. 
            Each bringing their unique expertise to build something extraordinary.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary" className="glass">
              <Star className="w-4 h-4 mr-1" />
              Collaborative Project
            </Badge>
            <Badge variant="secondary" className="glass">
              <Code className="w-4 h-4 mr-1" />
              Full Stack Development
            </Badge>
            <Badge variant="secondary" className="glass">
              <Brain className="w-4 h-4 mr-1" />
              AI Integration
            </Badge>
          </div>
        </motion.div>

        {/* Team Members Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="glass hover-glow group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    
                    <div className="relative p-8">
                      {/* Profile Image */}
                      <div className="flex items-start gap-6 mb-6">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-br ${member.color} rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity`} />
                          <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                          <p className={`text-sm font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-3`}>
                            {member.role}
                          </p>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {member.description}
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                          Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="glass text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Contribution */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                          Key Contribution
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {member.contribution}
                        </p>
                      </div>

                      {/* Social Links */}
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="glass hover:text-primary">
                          <Github className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="glass hover:text-primary">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="glass hover:text-primary">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Project Highlights */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Project <span className="neon-blue">Highlights</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="glass hover-glow h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <highlight.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Card className="glass border-primary">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Transform Your Style?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Experience the power of AI-driven fashion styling. Join thousands of users who have already discovered their perfect style with FashionAI.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button className="btn-gradient hover-glow">
                    Get Started
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="glass">
                    Learn More
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