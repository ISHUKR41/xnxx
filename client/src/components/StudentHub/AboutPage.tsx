import React from 'react';
import { Header } from './Header';
import { EnhancedAboutPage } from './EnhancedAboutPage';
import { FooterSection } from './FooterSection';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EnhancedAboutPage />
      <FooterSection />
    </div>
  );
};