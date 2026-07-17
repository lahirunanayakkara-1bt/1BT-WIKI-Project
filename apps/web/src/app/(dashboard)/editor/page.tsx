'use client';

import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { EditorDraftProvider } from '@/components/editor/EditorDraftContext';
import { EditorHeader } from '@/components/editor/EditorHeader';
import { DraftManagerSidebar } from '@/components/editor/DraftManagerSidebar';
import { ComposerView } from '@/components/editor/ComposerView';
import { ReadingPreview } from '@/components/editor/ReadingPreview';
import { ImageEmbedModal } from '@/components/editor/ImageEmbedModal';

export default function EditorWorkspacePage() {
  const [mode, setMode] = useState<'compose' | 'preview'>('compose');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Initialize smooth scrolling with Lenis (120Hz feel)
  useEffect(() => {
    const wrapper = document.getElementById('editor-scroll-container');
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
  }, []);

  return (
    <EditorDraftProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F5F5F5]">
        <EditorHeader mode={mode} setMode={setMode} />
        
        <div className="flex flex-1 overflow-hidden">
          <DraftManagerSidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
          
          <main className="flex-1 overflow-y-auto relative z-0" id="editor-scroll-container">
            <div className="min-h-full">
              {mode === 'compose' ? (
                <ComposerView onOpenImageEmbed={() => setIsImageModalOpen(true)} />
              ) : (
                <ReadingPreview />
              )}
            </div>
          </main>
        </div>

        <ImageEmbedModal 
          isOpen={isImageModalOpen} 
          onClose={() => setIsImageModalOpen(false)} 
        />
      </div>
    </EditorDraftProvider>
  );
}
