import React from 'react';
import { Header } from '@/components/StudentHub/Header';
import { ComprehensiveToolsPage } from '@/components/Tools/ComprehensiveToolsPage';

const Tools = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <ComprehensiveToolsPage />
    </div>
  );
};

export default Tools;