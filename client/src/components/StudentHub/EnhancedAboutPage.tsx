import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Award, 
  Target,
  Heart,
  Globe,
  Star,
  TrendingUp,
  Lightbulb,
  Shield,
  Clock,
  Zap,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  GraduationCap,
  Brain,
  Rocket,
  Trophy,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileText,
  Image,
  Layers,
  Cpu,
  Database,
  Code,
  Eye,
  ThumbsUp,
  Download,
  MessageCircle
} from 'lucide-react';

export const EnhancedAboutPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [counters, setCounters] = useState({
    students: 0,
    papers: 0,
    tools: 0,
    countries: 0
  });

  // Animate counters on mount
  useEffect(() => {
    const targets = { students: 125000, papers: 45000, tools: 25, countries: 150 };
    const duration = 2000;
    const steps = 60;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters({
        students: Math.floor(targets.students * easeOut),
        papers: Math.floor(targets.papers * easeOut),
        tools: Math.floor(targets.tools * easeOut),
        countries: Math.floor(targets.countries * easeOut)
      });

      if (step >= steps) {
        clearInterval(interval);
        setCounters(targets);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'mission', label: 'Our Mission', icon: <Target className="w-5 h-5" /> },
    { id: 'story', label: 'Our Story', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'team', label: 'Our Team', icon: <Users className="w-5 h-5" /> },
    { id: 'technology', label: 'Technology', icon: <Cpu className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-5 h-5" /> },
    { id: 'future', label: 'Future Vision', icon: <Rocket className="w-5 h-5" /> }
  ];

  const milestones = [
    { year: '2014', title: 'Founded', description: 'StudentHub.com was founded with a vision to democratize education' },
    { year: '2016', title: 'First 10K Users', description: 'Reached our first major milestone of 10,000 active students' },
    { year: '2018', title: 'Tool Suite Launch', description: 'Launched comprehensive PDF and image editing tools' },
    { year: '2020', title: 'Global Expansion', description: 'Expanded to serve students in over 100 countries worldwide' },
    { year: '2022', title: 'AI Integration', description: 'Integrated AI-powered study assistance and personalized learning' },
    { year: '2024', title: 'Present Day', description: 'Serving 125,000+ students with 45,000+ question papers' }
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'CEO & Founder',
      education: 'PhD in Education Technology, Stanford University',
      experience: '15+ years in EdTech',
      specialty: 'Educational Innovation & Strategy',
      image: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder', 
      education: 'MS Computer Science, MIT',
      experience: '12+ years in Software Development',
      specialty: 'AI & Machine Learning',
      image: '👨‍💻'
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Head of Content',
      education: 'PhD in Curriculum Design, Oxford',
      experience: '10+ years in Academic Content',
      specialty: 'Content Strategy & Quality Assurance',
      image: '👩‍🏫'
    },
    {
      name: 'David Rodriguez',
      role: 'Head of Engineering',
      education: 'MS Software Engineering, Berkeley',
      experience: '8+ years in Platform Development',
      specialty: 'Scalable Architecture & Performance',
      image: '👨‍🔧'
    }
  ];

  const technologies = [
    {
      category: 'Frontend Technologies',
      tools: ['React', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion'],
      description: 'Modern, responsive user interface with interactive 3D elements'
    },
    {
      category: 'Backend Technologies',
      tools: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
      description: 'Robust, scalable backend infrastructure for high performance'
    },
    {
      category: 'AI & Machine Learning',
      tools: ['TensorFlow', 'OpenAI GPT', 'Natural Language Processing', 'Computer Vision'],
      description: 'Intelligent features for personalized learning and content analysis'
    },
    {
      category: 'DevOps & Infrastructure',
      tools: ['AWS', 'Kubernetes', 'CI/CD', 'Monitoring', 'Auto-scaling'],
      description: 'Enterprise-grade infrastructure ensuring 99.9% uptime'
    }
  ];

  const achievements = [
    {
      title: 'Best Educational Platform 2024',
      organization: 'EdTech Awards',
      description: 'Recognized for outstanding contribution to digital education',
      icon: <Award className="w-8 h-8 text-yellow-500" />
    },
    {
      title: 'Innovation in Learning Technology',
      organization: 'UNESCO Recognition',
      description: 'Acknowledged for innovative approach to accessible education',
      icon: <Lightbulb className="w-8 h-8 text-blue-500" />
    },
    {
      title: 'Top 10 EdTech Startups',
      organization: 'TechCrunch',
      description: 'Featured among the most promising educational technology companies',
      icon: <Star className="w-8 h-8 text-purple-500" />
    },
    {
      title: 'Student Choice Award',
      organization: 'Global Education Forum',
      description: 'Voted by students as the most helpful educational platform',
      icon: <Heart className="w-8 h-8 text-red-500" />
    }
  ];

  const values = [
    {
      title: 'Accessibility',
      description: 'Making quality education accessible to every student, regardless of location or background',
      icon: <Globe className="w-12 h-12 text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      title: 'Innovation',
      description: 'Continuously innovating to provide cutting-edge tools and resources for modern learning',
      icon: <Rocket className="w-12 h-12 text-purple-500" />,
      color: 'bg-purple-50'
    },
    {
      title: 'Quality',
      description: 'Maintaining the highest standards in content quality and platform reliability',
      icon: <Shield className="w-12 h-12 text-green-500" />,
      color: 'bg-green-50'
    },
    {
      title: 'Community',
      description: 'Building a supportive community where students can learn, share, and grow together',
      icon: <Users className="w-12 h-12 text-orange-500" />,
      color: 'bg-orange-50'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'mission':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                At StudentHub.com, our mission is to democratize education by providing every student with 
                access to high-quality study materials, professional tools, and innovative learning resources. 
                We believe that education should be accessible, affordable, and available to all.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className={`${value.color} border-2 hover:shadow-lg transition-all duration-300`}>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md mx-auto mb-4">
                      {value.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-3 text-gray-800">{value.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
              <h4 className="text-2xl font-bold mb-4">Our Impact</h4>
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold mb-2">{counters.students.toLocaleString()}+</div>
                  <p>Students Helped</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{counters.papers.toLocaleString()}+</div>
                  <p>Question Papers</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{counters.tools}+</div>
                  <p>Professional Tools</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{counters.countries}+</div>
                  <p>Countries Served</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'story':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                StudentHub.com began in 2014 when our founders, Dr. Sarah Johnson and Michael Chen, 
                recognized the need for a comprehensive platform that could serve students worldwide 
                with quality educational resources and professional tools.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <Card className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <Badge className="mb-3 bg-blue-100 text-blue-800">{milestone.year}</Badge>
                          <h4 className="text-xl font-bold mb-2 text-gray-800">{milestone.title}</h4>
                          <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 text-gray-800">Meet Our Team</h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our diverse team of educators, technologists, and innovators work tirelessly to 
                create the best possible learning experience for students worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="text-6xl">{member.image}</div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                          {member.name}
                        </h4>
                        <Badge className="mb-3 bg-blue-100 text-blue-800">{member.role}</Badge>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            {member.education}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {member.experience}
                          </div>
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-2" />
                            {member.specialty}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <h4 className="text-2xl font-bold mb-4 text-gray-800">Join Our Team</h4>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We're always looking for passionate individuals who share our vision of making 
                education accessible to all. Explore career opportunities with us.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                View Open Positions
              </Button>
            </div>
          </div>
        );

      case 'technology':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 text-gray-800">Technology Stack</h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                We leverage cutting-edge technologies to deliver a fast, reliable, and 
                innovative platform that serves millions of students worldwide.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {technologies.map((tech, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-bold mb-4 text-gray-800">{tech.category}</h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">{tech.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {tech.tools.map((tool, idx) => (
                        <Badge key={idx} variant="secondary">{tool}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <div className="text-2xl font-bold mb-2">99.9%</div>
                  <p className="opacity-90">Uptime Guarantee</p>
                </div>
                <div>
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <div className="text-2xl font-bold mb-2">&lt; 2s</div>
                  <p className="opacity-90">Average Load Time</p>
                </div>
                <div>
                  <Shield className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <div className="text-2xl font-bold mb-2">256-bit</div>
                  <p className="opacity-90">SSL Encryption</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 text-gray-800">Our Achievements</h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                We're proud of the recognition we've received for our commitment to 
                educational excellence and innovation in learning technology.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {achievements.map((achievement, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                          {achievement.title}
                        </h4>
                        <Badge className="mb-3 bg-blue-100 text-blue-800">{achievement.organization}</Badge>
                        <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { metric: 'User Satisfaction', value: '97%', icon: <ThumbsUp className="w-6 h-6" /> },
                { metric: 'Success Rate', value: '95%', icon: <CheckCircle className="w-6 h-6" /> },
                { metric: 'Platform Rating', value: '4.9/5', icon: <Star className="w-6 h-6" /> },
                { metric: 'Growth Rate', value: '300%', icon: <TrendingUp className="w-6 h-6" /> }
              ].map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                    <p className="text-gray-600 text-sm">{stat.metric}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'future':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-6 text-gray-800">Future Vision</h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                We're constantly evolving and expanding our platform to meet the changing needs 
                of students and educators worldwide. Here's what's coming next.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'AI-Powered Personalization',
                  description: 'Advanced AI that adapts to individual learning styles and provides personalized recommendations',
                  timeline: 'Q2 2024',
                  icon: <Brain className="w-8 h-8 text-purple-500" />
                },
                {
                  title: 'Virtual Reality Learning',
                  description: 'Immersive VR experiences for complex subjects like anatomy, chemistry, and physics',
                  timeline: 'Q4 2024',
                  icon: <Eye className="w-8 h-8 text-blue-500" />
                },
                {
                  title: 'Global Collaboration Platform',
                  description: 'Connect students worldwide for collaborative learning and knowledge sharing',
                  timeline: 'Q1 2025',
                  icon: <Globe className="w-8 h-8 text-green-500" />
                }
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                        {feature.icon}
                      </div>
                      <Badge className="mb-4 bg-blue-100 text-blue-800">{feature.timeline}</Badge>
                      <h4 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white text-center">
              <h4 className="text-3xl font-bold mb-4">Be Part of the Future</h4>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Join us in shaping the future of education. Your feedback and suggestions 
                help us build better tools and resources for students worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-green-600 hover:bg-gray-100">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Share Feedback
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <Mail className="w-5 h-5 mr-2" />
                  Join Newsletter
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 px-6 py-2 text-lg font-semibold">
            About StudentHub.com
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Empowering Students Worldwide
          </h1>
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to make quality education accessible to every student, 
            providing the tools, resources, and support needed for academic success.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center space-x-2"
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {renderTabContent()}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Get in Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions, suggestions, or just want to say hello? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-800">Email Us</h3>
                <p className="text-gray-600 mb-4">Get in touch with our support team</p>
                <Button variant="outline">
                  support@studenthub.com
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-800">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with us in real-time</p>
                <Button variant="outline">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <Globe className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-800">Community</h3>
                <p className="text-gray-600 mb-4">Join our student community</p>
                <Button variant="outline">
                  Join Forum
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};