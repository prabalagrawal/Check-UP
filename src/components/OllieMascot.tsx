import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface OllieMascotProps {
  size?: number;
  interactive?: boolean;
  glow?: boolean;
  className?: string;
}

export default function OllieMascot({ 
  size = 300, 
  interactive = true, 
  glow = false,
  className = "" 
}: OllieMascotProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (mascotRef.current) {
        const rect = mascotRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate relative position (-1 to 1)
        const x = (e.clientX - centerX) / (window.innerWidth / 2);
        const y = (e.clientY - centerY) / (window.innerHeight / 2);
        
        setMousePos({ 
          x: Math.max(-1, Math.min(1, x)), 
          y: Math.max(-1, Math.min(1, y)) 
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Random blinking
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, [interactive]);

  // Eye movement limits
  const eyeLimit = 8;
  const pupilLimit = 12;

  return (
    <div 
      ref={mascotRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow Effect */}
      {glow && (
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-owl-blue/20 rounded-full blur-3xl"
        />
      )}

      {/* Owl Body */}
      <motion.div 
        animate={{ 
          y: [0, -10, 0],
          rotate: interactive ? mousePos.x * 5 : 0
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Main Body Shape */}
        <div className="absolute w-[80%] h-[90%] bg-owl-blue rounded-[40%_40%_45%_45%] shadow-2xl overflow-hidden">
          {/* Belly */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-owl-tan rounded-t-full opacity-90" />
          
          {/* Feathers Texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none feather-pattern" />
        </div>

        {/* Ears/Tufts */}
        <div className="absolute top-[5%] left-[15%] w-[25%] h-[20%] bg-owl-blue rounded-tl-[100%] -rotate-12" />
        <div className="absolute top-[5%] right-[15%] w-[25%] h-[20%] bg-owl-blue rounded-tr-[100%] rotate-12" />

        {/* Face Area */}
        <div className="absolute top-[20%] w-[85%] h-[50%] flex justify-center space-x-4">
          {/* Left Eye Socket */}
          <div className="relative w-[40%] aspect-square bg-white rounded-full shadow-inner flex items-center justify-center overflow-hidden">
            <motion.div 
              animate={{ 
                x: mousePos.x * eyeLimit,
                y: mousePos.y * eyeLimit
              }}
              className="relative w-[80%] h-[80%] bg-gray-100 rounded-full flex items-center justify-center"
            >
              {/* Pupil */}
              <motion.div 
                animate={{ 
                  x: mousePos.x * pupilLimit,
                  y: mousePos.y * pupilLimit,
                  scaleY: isBlinking ? 0.1 : 1
                }}
                className={`w-[60%] h-[60%] bg-midnight rounded-full relative ${glow ? 'glow-eye' : ''}`}
              >
                {/* Eye Shine */}
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-white rounded-full opacity-80" />
              </motion.div>
            </motion.div>
            
            {/* Eyelid (for blinking) */}
            <motion.div 
              animate={{ height: isBlinking ? '100%' : '0%' }}
              className="absolute top-0 left-0 w-full bg-owl-blue z-10"
            />
          </div>

          {/* Right Eye Socket */}
          <div className="relative w-[40%] aspect-square bg-white rounded-full shadow-inner flex items-center justify-center overflow-hidden">
            <motion.div 
              animate={{ 
                x: mousePos.x * eyeLimit,
                y: mousePos.y * eyeLimit
              }}
              className="relative w-[80%] h-[80%] bg-gray-100 rounded-full flex items-center justify-center"
            >
              {/* Pupil */}
              <motion.div 
                animate={{ 
                  x: mousePos.x * pupilLimit,
                  y: mousePos.y * pupilLimit,
                  scaleY: isBlinking ? 0.1 : 1
                }}
                className={`w-[60%] h-[60%] bg-midnight rounded-full relative ${glow ? 'glow-eye' : ''}`}
              >
                {/* Eye Shine */}
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-white rounded-full opacity-80" />
              </motion.div>
            </motion.div>

            {/* Eyelid (for blinking) */}
            <motion.div 
              animate={{ height: isBlinking ? '100%' : '0%' }}
              className="absolute top-0 left-0 w-full bg-owl-blue z-10"
            />
          </div>
        </div>

        {/* Beak */}
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-[12%] h-[15%] bg-owl-brown rounded-[20%_20%_100%_100%] shadow-md" />

        {/* Wings */}
        <motion.div 
          animate={{ rotate: interactive ? mousePos.x * -10 : 0 }}
          className="absolute -left-[5%] top-[40%] w-[20%] h-[40%] bg-owl-blue rounded-[100%_20%_20%_100%] -rotate-12 origin-right" 
        />
        <motion.div 
          animate={{ rotate: interactive ? mousePos.x * -10 : 0 }}
          className="absolute -right-[5%] top-[40%] w-[20%] h-[40%] bg-owl-blue rounded-[20%_100%_100%_20%] rotate-12 origin-left" 
        />
      </motion.div>
    </div>
  );
}
