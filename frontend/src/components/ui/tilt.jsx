import React, { useRef } from 'react';

// Lightweight 3D tilt with glare. No external deps.
export const Tilt = ({
  children,
  maxTilt = 12,
  glare = true,
  scale = 1.02,
  className = '',
}) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 2 - 1; // -1..1
    const py = (y / rect.height) * 2 - 1; // -1..1

    const tiltX = -(py * maxTilt);
    const tiltY = px * maxTilt;

    el.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;

    if (glare) {
      const glareEl = el.querySelector('[data-tilt-glare]');
      if (glareEl) {
        const angle = Math.atan2(py, px) * (180 / Math.PI) + 180;
        const intensity = Math.max(Math.abs(px), Math.abs(py));
        glareEl.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${0.18 * intensity}) 0%, rgba(255,255,255,0) 80%)`;
      }
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    const glareEl = el.querySelector('[data-tilt-glare]');
    if (glareEl) glareEl.style.background = 'transparent';
  };

  return (
    <div
      ref={ref}
      className={`relative will-change-transform transition-transform duration-200 ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {glare && (
        <div
          data-tilt-glare
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ transform: 'translateZ(1px)' }}
        />
      )}
      <div style={{ transform: 'translateZ(2px)' }}>{children}</div>
    </div>
  );
};

export default Tilt;


