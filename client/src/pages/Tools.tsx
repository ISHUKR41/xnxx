import React from 'react';
import { Header } from '@/components/StudentHub/Header';
import { ToolsEnhanced } from '@/components/Tools/ToolsEnhanced';

const Tools = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <ToolsEnhanced />
    </div>
  );
};

export default Tools;