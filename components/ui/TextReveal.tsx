import React, { useEffect, useRef, useState } from 'react';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Split text into words
  const words = children.split(" ");

  return (
    <div ref={elementRef} className={`flex flex-wrap gap-x-[0.25em] gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block align-top">
          <span 
            className={`inline-block transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
            style={{ 
                transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
                transitionDelay: `${delay + (i * 0.03)}s`
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </div>
  );
};