'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Check, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
}

export function Toast({ visible, message, type = 'success' }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!toastRef.current) return;

    if (visible) {
      // Enter animation: slide up and fade in
      gsap.fromTo(
        toastRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.5)' }
      );
    } else {
      // Exit animation: slide down and fade out
      gsap.to(toastRef.current, {
        y: 10,
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in'
      });
    }
  }, [visible]);

  return (
    <div
      ref={toastRef}
      data-testid={`${type}-toast`}
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-3',
        'rounded-lg bg-brand-dark px-4 py-3 text-white shadow-xl',
        // Prevent interaction when invisible
        !visible && 'pointer-events-none'
      )}
      // Initial state before GSAP takes over
      style={{ opacity: 0 }}
    >
      <div className={cn(
        "flex h-5 w-5 items-center justify-center rounded-full",
        type === 'success' && "bg-[#22C55E]/20 text-[#22C55E]",
        type === 'error' && "bg-red-500/20 text-red-500",
        type === 'info' && "bg-blue-500/20 text-blue-500"
      )}>
        {type === 'success' && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
        {type === 'error' && <X className="h-3.5 w-3.5" strokeWidth={3} />}
        {type === 'info' && <Info className="h-3.5 w-3.5" strokeWidth={3} />}
      </div>
      <span className="text-sm font-semibold tracking-wide">{message}</span>
    </div>
  );
}
