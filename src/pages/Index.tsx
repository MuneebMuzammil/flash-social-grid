
import React from 'react';
import Navigation from '@/components/Navigation';
import Feed from '@/components/Feed';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navigation />
      
      {/* Theme Toggle - Floating */}
      <div className="fixed top-20 right-4 z-40">
        <ThemeToggle />
      </div>
      
      <Feed />
    </div>
  );
};

export default Index;
