'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function PageAnimator() {
  useGSAP(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Hero entrance animation
    const tl = gsap.timeline();
    
    tl.fromTo('.hero-badge', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo('.hero-headline',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      "-=0.6"
    )
    .fromTo('.hero-subtext',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      "-=0.6"
    );

    // Feature Rows ScrollTrigger
    const rows = gsap.utils.toArray('.feature-row') as HTMLElement[];
    
    rows.forEach((row) => {
      const leftEl = row.querySelector('.feature-left');
      const rightEl = row.querySelector('.feature-right');
      
      if (leftEl && rightEl) {
        gsap.fromTo(leftEl,
          { x: -80, opacity: 0 },
          {
            x: 0, 
            opacity: 1, 
            duration: 1.1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%', // trigger when top of row hits 80% of viewport
            }
          }
        );
        
        gsap.fromTo(rightEl,
          { x: 80, opacity: 0 },
          {
            x: 0, 
            opacity: 1, 
            duration: 1.1, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%',
            }
          }
        );
      }
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null;
}
