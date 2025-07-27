import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  Download, 
  GraduationCap, 
  TrendingUp, 
  Globe,
  Award,
  Clock,
  CheckCircle,
  Star,
  BookOpen,
  Target
} from 'lucide-react';

export const AdvancedStatsSection: React.FC = () => {
  const [counters, setCounters] = useState({
    students: 0,
    downloads: 0,
    papers: 0,
    universities: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const targets = {
      students: 125000,
      downloads: 2500000,
      papers: 45000,
      universities: 1200
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters({
        students: Math.floor(targets.students * easeOut),
        downloads: Math.floor(targets.downloads * easeOut),
        papers: Math.floor(targets.papers * easeOut),
        universities: Math.floor(targets.universities * easeOut)
      });

      if (step >= steps) {
        clearInterval(interval);
        setCounters(targets);
      }
    }, stepDuration);
  };

  const mainStats = [
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      value: counters.students.toLocaleString(),
      label: "Active Students",
      suffix: "+",
      description: "Students worldwide trust our platform",
      color: "text-blue-400",
      bgColor: "bg-gray-800"
    },
    {
      icon: <Download className="w-8 h-8 text-green-400" />,
      value: counters.downloads.toLocaleString(),
      label: "Total Downloads",
      suffix: "+",
      description: "Papers and resources downloaded",
      color: "text-green-400",
      bgColor: "bg-gray-800"
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-400" />,
      value: counters.papers.toLocaleString(),
      label: "Question Papers",
      suffix: "+",
      description: "Previous year papers available",
      color: "text-purple-400",
      bgColor: "bg-gray-800"
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-orange-400" />,
      value: counters.universities.toLocaleString(),
      label: "Universities",
      suffix: "+",
      description: "Educational institutions covered",
      color: "text-orange-400",
      bgColor: "bg-gray-800"
    }
  ];

  const performanceStats = [
    {
      label: "Student Success Rate",
      value: 95,
      description: "Students improve their grades using our platform",
      icon: <Award className="w-5 h-5 text-yellow-500" />
    },
    {
      label: "Content Accuracy",
      value: 99,
      description: "Verified and accurate study materials", 
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      label: "User Satisfaction",
      value: 97,
      description: "Students rate our platform highly",
      icon: <Star className="w-5 h-5 text-blue-500" />
    },
    {
      label: "Platform Uptime",
      value: 99.9,
      description: "Reliable access when you need it most",
      icon: <Clock className="w-5 h-5 text-purple-500" />
    }
  ];

  const growthMetrics = [
    {
      metric: "Daily Active Users",
      value: "15,000+",
      growth: "+23%",
      period: "vs last month",
      icon: <Users className="w-6 h-6 text-blue-500" />
    },
    {
      metric: "Papers Added Weekly",
      value: "500+",
      growth: "+15%",
      period: "vs last week",
      icon: <FileText className="w-6 h-6 text-green-500" />
    },
    {
      metric: "Tools Usage",
      value: "50,000+",
      growth: "+35%",
      period: "monthly usage",
      icon: <Target className="w-6 h-6 text-purple-500" />
    },
    {
      metric: "Global Reach",
      value: "150+",
      growth: "+8",
      period: "countries",
      icon: <Globe className="w-6 h-6 text-orange-500" />
    }
  ];



  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-sm font-semibold">
            Platform Statistics
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Trusted by Students Worldwide
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Our platform has become the go-to destination for students seeking quality educational resources. 
            Here's the impact we're making in the academic community.
          </p>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mainStats.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} border-2 hover:shadow-xl transition-all duration-300 group`}>
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}{stat.suffix}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{stat.label}</h3>
                <p className="text-sm text-gray-200 leading-relaxed">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            Performance Excellence
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {performanceStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {stat.icon}
                      <h4 className="font-semibold text-lg text-white">{stat.label}</h4>
                    </div>
                    <Badge variant="secondary" className="text-lg font-bold px-3 py-1 bg-blue-600 text-white">
                      {stat.value}%
                    </Badge>
                  </div>
                  <Progress value={stat.value} className="mb-3" />
                  <p className="text-sm text-gray-200">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">
            Growing Every Day
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthMetrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                      {metric.icon}
                    </div>
                    <Badge className="bg-green-600 text-white text-xs">
                      {metric.growth}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <h4 className="font-medium text-gray-200 mb-1">{metric.metric}</h4>
                  <p className="text-xs text-gray-300">{metric.period}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievement Highlights */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <Award className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <div className="text-3xl font-bold mb-2">Top Rated</div>
              <p className="opacity-90">Educational Platform 2024</p>
            </div>
            <div>
              <Star className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <p className="opacity-90">Average User Rating</p>
            </div>
            <div>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <div className="text-3xl font-bold mb-2">300%</div>
              <p className="opacity-90">Growth in Last Year</p>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-4">Join the Success Story</h3>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Be part of a thriving community that's transforming how students learn and succeed academically.
          </p>
        </div>
      </div>
    </section>
  );
};