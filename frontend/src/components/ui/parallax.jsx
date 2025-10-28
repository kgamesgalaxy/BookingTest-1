import React, { useRef } from 'react';

// Mouse-follow parallax container with child depth layers (data-depth attribute)
export const Parallax = ({ children, strength = 20, className = '' }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
    const dy = (e.clientY - cy) / rect.height; // -0.5..0.5

    const layers = el.querySelectorAll('[data-depth]');
    layers.forEach((node) => {
      const depth = parseFloat(node.getAttribute('data-depth') || '0');
      const tx = -dx * strength * depth;
      const ty = -dy * strength * depth;
      node.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    const layers = el.querySelectorAll('[data-depth]');
    layers.forEach((node) => {
      node.style.transform = 'translate3d(0,0,0)';
    });
  };

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

export default Parallax;


