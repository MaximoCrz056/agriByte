
import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number; // Visibility threshold (0 to 1)
  delay?: number; // Delay in ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number; // Distance in px
  once?: boolean; // Whether animation should only happen once
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  threshold = 0.1,
  delay = 0,
  direction = 'up',
  distance = 20,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          
          if (once && entry.isIntersecting) {
            observer.unobserve(currentRef);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay, once]);

  // Initial transform based on direction
  let initialTransform = 'translateY(0)';
  if (direction === 'up') initialTransform = `translateY(${distance}px)`;
  if (direction === 'down') initialTransform = `translateY(-${distance}px)`;
  if (direction === 'left') initialTransform = `translateX(${distance}px)`;
  if (direction === 'right') initialTransform = `translateX(-${distance}px)`;
  if (direction === 'none') initialTransform = 'translateY(0)';

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) translateX(0)' : initialTransform,
        transition: `opacity 0.6s ease-out, transform 0.6s ease-out ${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
