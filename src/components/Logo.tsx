import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ 
  className = "", 
  iconClassName = "", 
  variant = 'light',
  size = 'md'
}: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg",
    md: "w-10 h-10 rounded-xl",
    lg: "w-16 h-16 rounded-2xl",
    xl: "w-24 h-24 rounded-3xl"
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-10 h-10",
    xl: "w-14 h-14"
  };

  const bgClass = variant === 'light' ? 'bg-owl-blue' : 'bg-white';
  const textClass = variant === 'light' ? 'text-white' : 'text-owl-blue';

  return (
    <div className={`${sizeClasses[size]} ${bgClass} flex items-center justify-center shadow-lg ${className}`}>
      <Heart className={`${iconSizes[size]} ${textClass} ${iconClassName}`} />
    </div>
  );
}
