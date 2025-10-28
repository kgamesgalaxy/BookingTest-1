import React, { useEffect, useRef } from 'react';

// Simple bot: eyes follow mouse; container glows
const HeroBot = () => {
  const leftEye = useRef(null);
  const rightEye = useRef(null);

  useEffect(() => {
    const move = (e) => {
      const update = (eye) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        const tx = Math.max(-4, Math.min(4, dx * 6));
        const ty = Math.max(-4, Math.min(4, dy * 6));
        eye.style.transform = `translate(${tx}px, ${ty}px)`;
      };
      update(leftEye.current);
      update(rightEye.current);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="relative w-40 h-40 lg:w-56 lg:h-56 rounded-3xl bg-gaming-card/70 border border-gaming-accent/30 shadow-gaming-glow backdrop-blur-md mx-auto">
      <div className="absolute -inset-1 rounded-3xl bg-gaming-accent/10 blur-2xl" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-6">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gaming-light/80 border border-gaming-border overflow-hidden flex items-center justify-center">
            <div ref={leftEye} className="w-2.5 h-2.5 bg-gaming-accent rounded-full transition-transform" />
          </div>
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gaming-light/80 border border-gaming-border overflow-hidden flex items-center justify-center">
            <div ref={rightEye} className="w-2.5 h-2.5 bg-gaming-accent rounded-full transition-transform" />
          </div>
        </div>
        <div className="mt-4 text-[10px] lg:text-xs text-gaming-text-secondary uppercase tracking-widest">KGG Assistant</div>
      </div>
    </div>
  );
};

export default HeroBot;


