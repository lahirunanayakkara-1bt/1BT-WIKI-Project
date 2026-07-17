'use client';

import React from 'react';
import { Clock, FileText, Hash } from 'lucide-react';
import { useEditorDraft } from './EditorDraftContext';

export function PublishingSettingsBox() {
  const { wordCount, charCount, lastSavedAt, articleId } = useEditorDraft();

  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const formatLastModified = () => {
    if (!lastSavedAt) return 'Not saved yet';
    return lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Publishing Settings</h3>
        <span className="rounded border border-[#6B7280]/30 bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">
          Draft
        </span>
      </div>

      {/* Draft Status Box */}
      <div className="mb-8 rounded-lg bg-[#F5F5F5] p-5 border border-[#E5E7EB]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">Draft Status</span>
          <span className={`text-sm font-bold ${
            articleId ? 'text-[#22C55E]' : 'text-[#9CA3AF]'
          }`}>
            {articleId ? 'Saved' : 'New'}
          </span>
        </div>
        <p className="text-xs text-[#6B7280] leading-relaxed mt-2">
          {articleId
            ? 'Your draft has been saved to the server. Changes are auto-saved after 3 seconds of inactivity.'
            : 'Start writing to create a new draft. The draft will be saved when you set a title or upload an image.'
          }
        </p>
      </div>

      {/* Stats List */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Words count</span>
          </div>
          <span className="text-sm font-bold text-[#1A1A1A]">{wordCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <Hash className="h-4 w-4" />
            <span className="text-sm font-medium">Characters count</span>
          </div>
          <span className="text-sm font-bold text-[#1A1A1A]">{charCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <Clock className="h-4 w-4 text-[#CC0000]" />
            <span className="text-sm font-medium">Estimated Read Time</span>
          </div>
          <span className="text-sm font-bold text-[#1A1A1A]">{readTime} min</span>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <span className="text-sm font-medium text-[#6B7280]">Last Modified</span>
          <span className="text-sm font-bold text-[#1A1A1A]">{formatLastModified()}</span>
        </div>
      </div>
    </div>
  );
}
