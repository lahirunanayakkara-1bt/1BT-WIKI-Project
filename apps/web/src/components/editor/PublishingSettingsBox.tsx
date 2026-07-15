'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Clock, FileText, Hash } from 'lucide-react';

export function PublishingSettingsBox() {
  const barRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Animate the progress bar width
    if (barRef.current) {
      gsap.fromTo(
        barRef.current,
        { width: '0%' },
        { width: '98%', duration: 1.5, ease: 'power3.out', delay: 0.5 }
      );
    }
  }, []);

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Publishing Settings</h3>
        <span className="rounded border border-[#22C55E]/30 bg-[#22C55E]/10 px-2 py-0.5 text-[10px] font-bold text-[#22C55E] uppercase tracking-wider">
          Live
        </span>
      </div>

      {/* SEO Score Box */}
      <div className="mb-8 rounded-lg bg-[#F5F5F5] p-5 border border-[#E5E7EB]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">SEO Quality Score</span>
          <span className="text-sm font-bold text-[#22C55E]">98/100</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB] mt-3 mb-4">
          <div ref={barRef} className="h-full bg-[#22C55E] rounded-full" />
        </div>

        <p className="text-xs text-[#6B7280] leading-relaxed">
          ✨ Fully optimized! Excellent length, titles, and classifications for search discoverability.
        </p>
      </div>

      {/* Stats List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Words count</span>
          </div>
          <span className="text-sm font-bold text-[#1A1A1A]">223</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <Hash className="h-4 w-4" />
            <span className="text-sm font-medium">Characters count</span>
          </div>
          <span className="text-sm font-bold text-[#1A1A1A]">1604</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <Clock className="h-4 w-4 text-[#CC0000]" />
            <span className="text-sm font-medium">Estimated Read Time</span>
          </div>
          <span className="text-sm font-bold text-[#1A1A1A]">1 min</span>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-sm font-medium text-[#6B7280]">Last Modified</span>
          <span className="text-sm font-bold text-[#1A1A1A]">10:41 AM</span>
        </div>
      </div>

      <button className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white py-3 text-sm font-bold text-[#1A1A1A] hover:bg-[#F0F0F0] transition-colors shadow-sm">
        <FileText className="h-4 w-4 text-[#6B7280]" />
        Revert to Draft
      </button>
    </div>
  );
}
