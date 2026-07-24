'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function useLenisScroll(containerId?: string | null): void {
  useEffect(() => {
    let wrapper: HTMLElement | null = null;

    if (containerId) {
      wrapper = document.getElementById(containerId);
      if (!wrapper) return;
    }

    const baseOptions = {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical' as const,
      gestureOrientation: 'vertical' as const,
      smoothWheel: true,
      wheelMultiplier: 1,
    };

    const lenis = wrapper
      ? new Lenis({
          ...baseOptions,
          wrapper,
          content: wrapper.firstElementChild as HTMLElement,
        })
      : new Lenis(baseOptions);

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
