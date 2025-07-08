import React from 'react';
import { Brain, Rocket } from 'lucide-react';

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: {
      icon: 20,
      text: 'text-lg',
    },
    md: {
      icon: 24,
      text: 'text-xl',
    },
    lg: {
      icon: 32,
      text: 'text-2xl',
    },
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        <Brain size={sizes[size].icon} className="text-primary-600" />
        <Rocket
          size={sizes[size].icon * 0.6}
          className="text-accent absolute -top-1 -right-1"
        />
      </div>
      <span className={`ml-2 font-bold ${sizes[size].text} text-gray-900`}>
        Di<span className="text-primary-600">Mark</span>{' '}
        <span className="font-light text-accent">AI</span>
      </span>
    </div>
  );
};