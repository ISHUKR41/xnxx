import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  FileText, 
  Image, 
  Download, 
  Search, 
  Users, 
  Trophy, 
  Target,
  Zap,
  Shield,
  Clock,
  Star,
  Lightbulb,
  Globe,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  Heart,
  Brain,
  Rocket
} from 'lucide-react';

export const DetailedFeaturesSection: React.FC = () => {
  const mainFeatures = [
    {
      icon: <FileText className="w-12 h-12 text-blue-600" />,
      title: "Question Paper Bank",
      description: "Access thousands of previous year question papers from top universities and boards",
      details: [
        "10,000+ Question Papers",
        "All Major Universities",
        "Subject-wise Organization",
        "Year-wise Sorting",
        "Instant Download"
      ],
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: <Image className="w-12 h-12 text-green-600" />,
      title: "Advanced PDF & Image Tools",
      description: "Professional tools for document processing and image manipulation",
      details: [
        "PDF Merge & Split",
        "Image Compression",
        "Format Conversion",
        "Batch Processing",
        "High-Quality Output"
      ],
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: <Brain className="w-12 h-12 text-purple-600" />,
      title: "AI-Powered Study Assistant",
      description: "Smart learning companion to help you understand complex topics",
      details: [
        "Concept Explanation",
        "Practice Questions",
        "Progress Tracking",
        "Personalized Learning",
        "24/7 Availability"
      ],
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  const additionalFeatures = [
    {
      icon: <Search className="w-8 h-8 text-orange-500" />,
      title: "Smart Search Engine",
      description: "Find exactly what you need with our intelligent search system",
      stat: "99.9% Accuracy"
    },
    {
      icon: <Download className="w-8 h-8 text-red-500" />,
      title: "Instant Downloads",
      description: "Fast, secure downloads with no waiting time or registration",
      stat: "< 2 Seconds"
    },
    {
      icon: <Shield className="w-8 h-8 text-teal-500" />,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security",
      stat: "256-bit SSL"
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-500" />,
      title: "24/7 Availability",
      description: "Access your study materials anytime, anywhere",
      stat: "99.9% Uptime"
    },
    {
      icon: <Users className="w-8 h-8 text-pink-500" />,
      title: "Community Support",
      description: "Connect with students and share knowledge",
      stat: "50,000+ Users"
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      title: "Proven Results",
      description: "Students using our platform show 40% better performance",
      stat: "95% Success Rate"
    }
  ];

  const toolCategories = [
    {
      category: "PDF Tools",
      tools: ["Merge PDF", "Split PDF", "Compress PDF", "Protect PDF", "PDF to Word", "PDF to PowerPoint"],
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      category: "Image Tools", 
      tools: ["Resize Image", "Crop Image", "Compress Image", "Convert Format", "Batch Process", "Quality Enhance"],
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      category: "Text Tools",
      tools: ["Text to PDF", "Word Counter", "Grammar Check", "Format Text", "Extract Text", "Translate"],
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      category: "Study Tools",
      tools: ["Notes Maker", "Quiz Generator", "Mind Maps", "Study Planner", "Progress Tracker", "Flashcards"],
      color: "text-purple-600", 
      bgColor: "bg-purple-50"
    }
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Reduce study preparation time by 60% with organized resources",
      icon: <Clock className="w-6 h-6 text-blue-500" />
    },
    {
      title: "Better Grades",
      description: "Students report average grade improvement of 2+ points",
      icon: <TrendingUp className="w-6 h-6 text-green-500" />
    },
    {
      title: "Stress-Free Learning",
      description: "Organized approach reduces exam anxiety and stress",
      icon: <Heart className="w-6 h-6 text-red-500" />
    },
    {
      title: "Future Ready",
      description: "Develop skills that will help throughout your career",
      icon: <Rocket className="w-6 h-6 text-purple-500" />
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
            Comprehensive Platform Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Everything You Need for Academic Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover a complete ecosystem of tools, resources, and support designed specifically 
            for students who want to excel in their academic journey.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className={`${feature.bgColor} ${feature.borderColor} border-2 hover:shadow-xl transition-all duration-300 group`}>
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 group-hover:bg-primary/90 transition-colors">
                  Explore Feature
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Students Choose StudentHub.com
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group border-2 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2 text-gray-800">{feature.title}</h4>
                      <p className="text-gray-600 text-sm mb-2 leading-relaxed">{feature.description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {feature.stat}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tools Categories */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Professional Tools at Your Fingertips
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {toolCategories.map((category, index) => (
              <Card key={index} className={`${category.bgColor} border-2 hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <h4 className={`font-bold text-lg mb-4 ${category.color}`}>
                    {category.category}
                  </h4>
                  <ul className="space-y-2">
                    {category.tools.map((tool, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {tool}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Try Tools
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Transform Your Academic Journey
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                    {benefit.icon}
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-800">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Excel in Your Studies?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful students who trust StudentHub.com for their academic needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Star className="w-5 h-5 mr-2" />
              Start Free Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};