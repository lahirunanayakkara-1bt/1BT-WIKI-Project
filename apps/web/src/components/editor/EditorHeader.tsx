'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft } from 'lucide-react';

interface EditorHeaderProps {
  mode: 'compose' | 'preview';
  setMode: (mode: 'compose' | 'preview') => void;
}

export function EditorHeader({ mode, setMode }: EditorHeaderProps) {
  const statusDotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Pulse animation for the sync status dot
    gsap.to(statusDotRef.current, {
      opacity: 0.4,
      scale: 1.2,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }, []);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-[#E5E7EB] bg-white px-6 shrink-0 relative z-20 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-[#E5E7EB] pr-6">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="h-10 w-10 bg-[#CC0000] rounded flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs font-black leading-none">1BT</span>
            </div>
            <span className="text-[#6B7280] font-semibold text-base leading-none tracking-tight">WIKI</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Editor Workspace
            </span>
          </div>
        </div>

        <button className="flex h-8 w-8 items-center justify-center rounded text-[#6B7280] hover:bg-[#F0F0F0] hover:text-[#1A1A1A] transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#F5F5F5] px-3 py-1">
          <div ref={statusDotRef} className="h-2 w-2 rounded-full bg-[#22C55E]" />
          <span className="text-xs font-medium text-[#6B7280]">Draft Saved at 10:41:11 AM</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Mode Toggles */}
        <div className="flex rounded-lg border border-[#E5E7EB] bg-white p-1 shadow-sm">
          <button
            onClick={() => setMode('compose')}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
              mode === 'compose'
                ? 'bg-red-50 text-[#CC0000]'
                : 'text-[#6B7280] hover:bg-[#F0F0F0] hover:text-[#1A1A1A]'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Compose
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
              mode === 'preview'
                ? 'bg-gray-100 text-[#1A1A1A]'
                : 'text-[#6B7280] hover:bg-[#F0F0F0] hover:text-[#1A1A1A]'
            }`}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Preview
          </button>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F0F0F0] transition-colors shadow-sm">
          <svg className="h-4 w-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Revert to Draft
        </button>

        <button className="rounded-lg bg-[#CC0000] px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-[#A80000] disabled:bg-[#d34d4d] transition-colors">
          Publish Article
        </button>
      </div>
    </header>
  );
}
