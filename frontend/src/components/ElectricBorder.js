import React, { useRef, useEffect, useMemo } from 'react';

const ElectricBorder = ({
  children,
  color = '#7df9ff',
  speed = 1,
  chaos = 0.5,
  thickness = 2,
  style = {},
  className = ''
}) => {
  const turbulenceRef = useRef(null);
  const animationRef = useRef(null);
  const filterId = useMemo(() => `turbulent-displace-${Math.random().toString(36).substr(2, 9)}`, []);

  useEffect(() => {
    if (!turbulenceRef.current) return;

    let baseFrequency = 0.02;
    const animationSpeed = speed * 0.001;

    const animate = () => {
      baseFrequency += animationSpeed;
      if (turbulenceRef.current) {
        turbulenceRef.current.setAttribute('baseFrequency', `${baseFrequency} 0.02`);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, chaos]);

  const lightColor = color;
  const gradientColor = `${color}66`;
  const borderRadius = style.borderRadius || 16;

  return (
    <div
      className={`electric-border-container ${className}`}
      style={{
        position: 'relative',
        padding: `${thickness}px`,
        borderRadius: `${borderRadius}px`,
        background: `linear-gradient(-30deg, ${gradientColor}, transparent, ${gradientColor}), linear-gradient(to bottom, #1a1a1a, #1a1a1a)`,
        ...style
      }}
    >
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              ref={turbulenceRef}
              type="turbulence"
              baseFrequency="0.02 0.02"
              numOctaves="2"
              result="turbulence"
              seed="2"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={chaos * 10}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            border: `${thickness}px solid ${color}80`,
            borderRadius: `${borderRadius}px`,
            paddingRight: '4px',
            paddingBottom: '4px'
          }}
        >
          <div
            className="electric-border-main"
            style={{
              borderRadius: `${borderRadius}px`,
              border: `${thickness}px solid ${color}`,
              marginTop: '-4px',
              marginLeft: '-4px',
              filter: `url(#${filterId})`,
              position: 'relative',
              background: 'transparent',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                border: `${thickness}px solid ${color}99`,
                borderRadius: `${borderRadius}px`,
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                filter: 'blur(1px)',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                border: `${thickness}px solid ${lightColor}`,
                borderRadius: `${borderRadius}px`,
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                filter: 'blur(4px)',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                borderRadius: `${borderRadius}px`,
                opacity: 1,
                mixBlendMode: 'overlay',
                transform: 'scale(1.1)',
                filter: 'blur(16px)',
                background: 'linear-gradient(-30deg, white, transparent 30%, transparent 70%, white)',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                borderRadius: `${borderRadius}px`,
                opacity: 0.5,
                mixBlendMode: 'overlay',
                transform: 'scale(1.1)',
                filter: 'blur(16px)',
                background: 'linear-gradient(-30deg, white, transparent 30%, transparent 70%, white)',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                borderRadius: `${borderRadius}px`,
                filter: 'blur(32px)',
                transform: 'scale(1.1)',
                opacity: 0.3,
                zIndex: -1,
                background: `linear-gradient(-30deg, ${lightColor}, transparent, ${color})`,
                pointerEvents: 'none'
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricBorder;