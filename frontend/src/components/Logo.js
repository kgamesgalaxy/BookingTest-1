import React, { useRef, useState } from 'react';

const Logo = () => {
  const [imgOk, setImgOk] = useState(true);
  const handleError = () => setImgOk(false);

  return (
    <div className="flex items-center space-x-3 select-none">
      {imgOk ? (
        <img
          src="/kgg-logo.jpeg"
          alt="Karthikeya's Games Galaxy"
          className="h-10 w-10 lg:h-12 lg:w-12 rounded-md border border-gaming-accent/30 shadow-gaming-glow"
          onError={handleError}
        />
      ) : (
        <div className="relative h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gaming-accent/15 border border-gaming-accent/30 shadow-gaming-glow overflow-hidden">
          <div className="absolute inset-0 opacity-60" style={{background: 'radial-gradient(60% 60% at 30% 30%, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0.0) 70%)'}} />
          <div className="absolute inset-0 flex items-center justify-center font-extrabold text-gaming-accent" style={{textShadow:'0 0 18px rgba(59,130,246,0.65)'}}>GG</div>
        </div>
      )}
      <div className="flex flex-col leading-none">
        <span className="text-xl lg:text-2xl font-extrabold text-gaming-text tracking-wide">Games Galaxy</span>
        <span className="text-[10px] lg:text-xs text-gaming-accent font-semibold uppercase tracking-widest">Karthikeya</span>
      </div>
    </div>
  );
};

export default Logo;