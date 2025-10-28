import React, { useEffect, useRef } from 'react';

export const ScrollReveal = ({ children, className = '', threshold = 0.15, once = true, effect = 'sr-fade-up' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add('sr-show');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show();
          if (once) io.disconnect();
        }
      });
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return (
    <div ref={ref} className={`${effect} ${className}`}>{children}</div>
  );
};

export default ScrollReveal;


