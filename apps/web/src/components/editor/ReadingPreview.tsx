'use client';

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export function ReadingPreview() {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    gsap.fromTo(
      '.preview-container',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-4xl';
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#F5F5F5] pb-20">
      {/* Simulator Toolbar */}
      <div className="sticky top-0 z-10 flex justify-center border-b border-[#E5E7EB] bg-white py-3 shadow-sm">
        <div className="flex rounded-lg border border-[#E5E7EB] bg-[#F5F5F5] p-1">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-2 rounded px-4 py-1.5 text-sm font-semibold transition-colors ${
              viewport === 'desktop' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            <Monitor className="h-4 w-4" /> Desktop
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-2 rounded px-4 py-1.5 text-sm font-semibold transition-colors ${
              viewport === 'tablet' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            <Tablet className="h-4 w-4" /> Tablet
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-2 rounded px-4 py-1.5 text-sm font-semibold transition-colors ${
              viewport === 'mobile' ? 'bg-white text-[#1A1A1A] shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A1A]'
            }`}
          >
            <Smartphone className="h-4 w-4" /> Mobile
          </button>
        </div>
      </div>

      {/* Simulator Canvas */}
      <div className="flex-1 overflow-y-auto py-10 px-4 flex justify-center preview-container">
        <article
          className={`w-full ${getViewportWidth()} rounded-2xl bg-white shadow-xl border border-[#E5E7EB] overflow-hidden transition-all duration-500 ease-out`}
        >
          {/* Header Image */}
          <div className="w-full h-64 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
          
          <div className="p-10 md:p-14">
            {/* Tags */}
            <div className="mb-6 flex gap-2">
              <span className="font-bold text-[#CC0000] text-sm">#Design</span>
              <span className="font-bold text-[#CC0000] text-sm">#Craftsmanship</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight mb-8">
              Crafting Interfaces with Purpose and Intent
            </h1>

            {/* Author Meta Row */}
            <div className="flex items-center gap-4 mb-10 border-b border-[#E5E7EB] pb-8">
              <div className="h-12 w-12 rounded-full bg-[#F0F0F0] border-2 border-white shadow flex items-center justify-center text-[#CC0000] font-bold">
                SM
              </div>
              <div>
                <p className="font-bold text-[#1A1A1A]">Sanjith Malindu</p>
                <p className="text-sm text-[#6B7280]">Lead Designer • Jul 15, 2026</p>
              </div>
            </div>

            {/* Simulated Rich Text Content */}
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-[#1A1A1A] prose-p:text-[#1A1A1A] prose-a:text-[#CC0000]">
              <h2>A Checklist for Quality Layouts</h2>
              <ul>
                <li><strong>Restrained Typography:</strong> Pair modern geometric display fonts for headings with highly legible, clean sans-serif body text.</li>
                <li><strong>Generous Negative Space:</strong> Allow elements to breathe; avoid cluttering the margins and rails with unnecessary logs, indicators, or status labels.</li>
                <li><strong>Tactile Interaction:</strong> Provide clear visual feedback on hover, focus, and click transitions so user action is immediately reinforced.</li>
              </ul>
              <p>When you focus on the visual quality of execution rather than sheer volume of widgets, you build digital products that feel genuinely crafted, fluid, and robust.</p>
              
              <blockquote>
                &quot;Good design is obvious. Great design is transparent.&quot; — Joe Sparano
              </blockquote>

              <p>The primary goal is to ensure the reader is immersed in the content without distractions. Notice how the reading width changes based on the viewport simulator above.</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
