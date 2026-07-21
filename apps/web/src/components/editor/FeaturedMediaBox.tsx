'use client';

import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { useEditorDraft } from '@/components/editor/EditorDraftContext';
import { cn } from '@/lib/utils';

export function FeaturedMediaBox() {
  const { uploadImage, featuredImageUrl, setFeaturedImageUrl } = useEditorDraft();
  const [displayInFeed, setDisplayInFeed] = useState(true);
  const [pinToTop, setPinToTop] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const Checkbox = ({ checked, onChange, label }: {
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#CC0000] transition-colors">{label}</span>
      <div 
        className={cn(
          'w-5 h-5 rounded flex items-center justify-center transition-colors border',
          checked
            ? 'bg-[#CC0000] border-[#CC0000]'
            : 'bg-white border-[#E5E7EB] group-hover:border-[#CC0000]/50'
        )}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
      </div>
      {/* Hidden native checkbox to handle standard events, though we control it manually */}
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileUrl = await uploadImage(file);
      setFeaturedImageUrl(fileUrl);
      // TODO: Backend persistence needed once Prisma migration + featured-image
      // schema field lands. Currently the backend has no way to persist "this
      // attachment is the featured image" — it's just a regular attachment row.
      // Track which attachment URL is the featured one in FRONTEND state only
      // for now.
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be re-selected
      e.target.value = '';
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setFeaturedImageUrl(null);
    setUploadError(null);
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm mt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Featured Media</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Header Image</span>
      </div>

      {isUploading ? (
        <div className="relative mb-6 flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-[#CC0000]/30 bg-red-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 text-[#CC0000] animate-spin" />
            <span className="text-xs font-medium text-[#CC0000]">Uploading...</span>
          </div>
        </div>
      ) : featuredImageUrl ? (
        <div className="relative mb-6 h-32 w-full overflow-hidden rounded-lg group border border-[#E5E7EB]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={featuredImageUrl} alt="Featured" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          
          <button 
            onClick={removeImage}
            className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/60"
            title="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className="relative mb-6 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] transition-colors hover:border-[#CC0000]/50 hover:bg-[#F3F4F6] group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm mb-2 group-hover:scale-110 transition-transform">
            <svg className="h-4 w-4 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xs font-medium text-[#6B7280]">Upload Image</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageUpload}
            className="sr-only"
          />
        </label>
      )}

      {uploadError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
          <p className="text-xs text-red-600">{uploadError}</p>
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Distribution Options</h4>
      </div>

      <div className="flex flex-col gap-4">
        <Checkbox 
          checked={displayInFeed} 
          onChange={() => setDisplayInFeed(!displayInFeed)} 
          label="Display in main feed" 
        />
        <Checkbox 
          checked={pinToTop} 
          onChange={() => setPinToTop(!pinToTop)} 
          label="Pin to top of blog" 
        />
      </div>
    </div>
  );
}
