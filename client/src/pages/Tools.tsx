import React from 'react';
import { Header } from '@/components/StudentHub/Header';
import { EnhancedToolsInterface } from '@/components/Tools/EnhancedToolsInterface';

const Tools = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <EnhancedToolsInterface />
    </div>
  );
};

export default Tools;