'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, Save } from 'lucide-react';
import { useEditorDraft } from './EditorDraftContext';
import { getStatusDotColor, getStatusText } from '@/lib/utils/saveStatus';

interface EditorHeaderProps {
  mode: 'compose' | 'preview';
  setMode: (mode: 'compose' | 'preview') => void;
}

export function EditorHeader({ mode, setMode }: EditorHeaderProps) {
  const { saveStatus, lastSavedAt, lastError, saveDraft } = useEditorDraft();
  const statusDotRef = useRef<HTMLDivElement>(null);

  // Animate the status dot based on save state
  useGSAP(() => {
    if (!statusDotRef.current) return;

    gsap.killTweensOf(statusDotRef.current);

    if (saveStatus === 'saving') {
      gsap.to(statusDotRef.current, {
        opacity: 0.4,
        scale: 1.3,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    } else if (saveStatus === 'saved') {
      gsap.to(statusDotRef.current, {
        opacity: 0.4,
        scale: 1.2,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    } else {
      // idle or error — no pulse
      gsap.set(statusDotRef.current, { opacity: 1, scale: 1 });
    }
  }, [saveStatus]);


  const handleSaveDraft = async () => {
    try {
      await saveDraft();
    } catch {
      // Error state is already set in context
    }
  };

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
          <div ref={statusDotRef} className={`h-2 w-2 rounded-full ${getStatusDotColor(saveStatus)}`} />
          <span
            className="text-xs font-medium text-[#6B7280] max-w-[200px] truncate"
            title={saveStatus === 'error' && lastError ? lastError : undefined}
          >
            {getStatusText(saveStatus, lastSavedAt)}
          </span>
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

        {/* Save Draft button (Correction 3: replaces the removed "Revert to Draft") */}
        <button
          onClick={handleSaveDraft}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#1A1A1A] hover:bg-[#F0F0F0] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 text-[#6B7280]" />
          Save Draft
        </button>

        <button className="rounded-lg bg-[#CC0000] px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-[#A80000] disabled:bg-[#d34d4d] transition-colors">
          Publish Article
        </button>
      </div>
    </header>
  );
}
