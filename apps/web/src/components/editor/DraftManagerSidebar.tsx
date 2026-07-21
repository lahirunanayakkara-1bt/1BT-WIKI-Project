'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ChevronRight, Search, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserIcon } from '@/components/shared/icons/UserIcon';

interface DraftManagerSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const mockDrafts = [
  {
    id: 1,
    title: 'Crafting Interfaces with Purpose and...',
    snippet: 'Designing with intent. True craftsmanship in user interface desi...',
    status: 'LIVE',
    date: 'Jul 15',
    tag: '#Design'
  },
  {
    id: 2,
    title: 'State Management in 2026',
    snippet: 'Exploring the new primitives in React 19 and how they change...',
    status: 'DRAFT',
    date: 'Jul 14',
    tag: '#Technology'
  }
];

export function DraftManagerSidebar({ isOpen, toggleSidebar }: DraftManagerSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sidebarRef.current) return;

    if (isOpen) {
      gsap.to(sidebarRef.current, {
        width: 320,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(contentRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        delay: 0.1,
      });
    } else {
      gsap.to(contentRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.2,
      });
      gsap.to(sidebarRef.current, {
        width: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={sidebarRef}
      className="relative flex h-full shrink-0 flex-col border-r border-brand-border bg-white z-20"
      style={{ width: 320 }}
    >
      {/* Content Wrapper that clips when collapsed */}
      <div className="overflow-hidden w-full h-full">
        <div ref={contentRef} className="flex h-full w-[320px] flex-col p-5">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-red-hover transition-colors">
            <Plus className="h-4 w-4" /> Start New Draft
          </button>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles & stories..."
            className="w-full rounded-lg border border-brand-border bg-brand-bg py-2 pl-9 pr-3 text-sm text-brand-text-primary placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red transition-all"
          />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All Tags', '#Design', '#Craftsmanship', '#Writing'].map((tag, i) => (
            <button
              key={tag}
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                i === 0
                  ? 'bg-brand-red text-white'
                  : 'border border-brand-border bg-white text-brand-text-secondary hover:bg-brand-hover'
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-6 flex-1 overflow-y-auto">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-text-secondary">
            My Stories (2)
          </h3>
          <div className="flex flex-col gap-3">
            {mockDrafts.map((draft, i) => (
              <div
                key={draft.id}
                className={cn(
                  'group relative cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md',
                  i === 0
                    ? 'border-brand-red bg-white shadow-sm'
                    : 'border-brand-border bg-white hover:border-brand-red/50'
                )}
              >
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded p-1 text-brand-text-secondary hover:bg-brand-bg hover:text-brand-red">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h4 className="font-bold text-brand-text-primary line-clamp-1 pr-6">{draft.title}</h4>
                <p className="mt-1 text-xs text-brand-text-secondary line-clamp-2 leading-relaxed">
                  {draft.snippet}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-bold',
                        draft.status === 'LIVE'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-brand-bg text-brand-text-secondary'
                      )}
                    >
                      {draft.status}
                    </span>
                    <span className="text-xs text-gray-400">{draft.date}</span>
                  </div>
                  <span className="text-xs font-bold text-brand-red">{draft.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-brand-border pt-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-brand-red text-xs font-bold text-brand-red">
              <UserIcon className="h-3 w-3" />
            </div>
            <span className="text-xs font-medium text-brand-text-secondary">malinduyasanjith2001</span>
          </div>
          <span className="text-[10px] text-gray-400">v1.2</span>
        </div>
      </div>
    </div>

      {/* Toggle Button positioned on the edge, translating dynamically to stay visible */}
      <button
        onClick={toggleSidebar}
        className="absolute top-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-white text-brand-text-secondary shadow-md hover:text-brand-text-primary hover:bg-brand-hover transition-all duration-300"
        style={{ left: '100%', transform: isOpen ? 'translateX(-50%)' : 'translateX(25%)' }}
      >
        {isOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
      </button>
    </div>
  );
}
