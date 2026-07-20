'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function useLenisScroll(containerId: string): void {
  useEffect(() => {
    const wrapper = document.getElementById(containerId);
    if (!wrapper) return;

    const lenis = new Lenis({
      wrapper: wrapper as HTMLElement,
      content: wrapper.firstElementChild as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [containerId]);
}
