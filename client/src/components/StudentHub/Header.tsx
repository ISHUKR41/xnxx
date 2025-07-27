import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Link } from 'wouter';
import { AnimatedLogo3D } from '@/components/ui/AnimatedLogo3D';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'PYQs', href: '/#pyqs' },
    { label: 'News', href: '/#news' },
    { label: 'Tools', href: '/tools' },
    { label: 'Test', href: '/#test' },
    { label: 'Books', href: '/#books' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-lg shadow-lg py-1 sm:py-2' 
          : 'bg-transparent py-2 sm:py-4'
      }`}
      style={{ backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.95)' : 'transparent' }}
    >
      <nav className="container mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Enhanced 3D Animated Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer hover:scale-105 transition-all duration-300">
          <AnimatedLogo3D size="md" className="hidden sm:block" />
          <AnimatedLogo3D size="sm" className="sm:hidden" />
          <div className="relative">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold group-hover:animate-pulse text-white">
              <span className="hidden sm:inline">📚 STUDENTHUB.COM</span>
              <span className="sm:hidden">📚 STUDENTHUB</span>
            </span>
            <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-gray-200 hover:text-blue-400 transition-colors duration-300 font-medium text-sm xl:text-base py-2 px-1 touch-target hover:scale-105 transform"
              style={{ willChange: 'transform, color' }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Button className="btn-hero text-sm xl:text-base px-4 xl:px-6 py-2 xl:py-3 touch-target hover:shadow-glow transition-all duration-300 transform hover:scale-105">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 touch-target text-gray-200 hover:text-blue-400 transition-colors duration-300 hover:scale-110 transform"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-out ${
          isMenuOpen
            ? 'max-h-96 opacity-100 transform translate-y-0'
            : 'max-h-0 opacity-0 transform -translate-y-4 pointer-events-none'
        } overflow-hidden`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.98)' }}
      >
        <div className="px-4 py-6 space-y-4">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.href}
              className="block text-gray-200 hover:text-blue-400 transition-all duration-300 font-medium text-lg py-3 px-4 rounded-lg hover:bg-gray-800/50 touch-target transform hover:scale-105"
              onClick={() => setIsMenuOpen(false)}
              style={{
                animationDelay: `${index * 0.1}s`,
                willChange: 'transform, color'
              }}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <Button className="w-full btn-hero py-3 text-lg touch-target hover:shadow-glow transition-all duration-300 transform hover:scale-105">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};