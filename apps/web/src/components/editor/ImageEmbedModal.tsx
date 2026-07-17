'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, Image as ImageIcon, UploadCloud, Link as LinkIcon, Search, Loader2 } from 'lucide-react';
import { useEditorDraft } from './EditorDraftContext';

interface ImageEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImageEmbedModal({ isOpen, onClose }: ImageEmbedModalProps) {
  const { uploadImage, insertEditorImage } = useEditorDraft();
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'url'>('preset');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [webUrl, setWebUrl] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!overlayRef.current || !modalRef.current) return;

    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
      gsap.fromTo(
        modalRef.current,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
      gsap.to(modalRef.current, { y: 20, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' });
    }
  }, [isOpen]);

  if (!isOpen) {
    // We still render it invisible to let GSAP animate out, but React will unmount if we completely hide.
    // However, with our GSAP logic, pointerEvents 'none' hides it enough for now. 
    // In a production app, we'd wait for animation to complete before unmounting.
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const fileUrl = await uploadImage(file);
      insertEditorImage(fileUrl);
      onClose();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be re-selected
      e.target.value = '';
    }
  };

  const handleEmbedUrl = () => {
    const trimmedUrl = webUrl.trim();
    if (!trimmedUrl) return;

    insertEditorImage(trimmedUrl);
    setWebUrl('');
    onClose();
  };

  const TabButton = ({ id, icon: Icon, label }: {
    id: 'preset' | 'upload' | 'url';
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-4 text-sm font-semibold transition-colors ${
        activeTab === id
          ? 'border-[#CC0000] text-[#CC0000]'
          : 'border-transparent text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A]/60 backdrop-blur-sm opacity-0 pointer-events-none"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-lg font-bold text-[#1A1A1A] font-display">Embed Image</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#6B7280] hover:bg-[#F0F0F0] hover:text-[#1A1A1A] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex w-full border-b border-[#E5E7EB] bg-[#F5F5F5]/50 px-2">
          <TabButton id="preset" icon={ImageIcon} label="Preset Stock" />
          <TabButton id="upload" icon={UploadCloud} label="Upload File" />
          <TabButton id="url" icon={LinkIcon} label="Web URL" />
        </div>

        <div className="p-6">
          {activeTab === 'preset' && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search stock library..."
                  className="w-full rounded-lg border border-[#E5E7EB] bg-[#F5F5F5] py-3 pl-10 pr-4 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000] transition-all"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 h-64 overflow-y-auto pr-2 custom-scrollbar">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg bg-gray-200"
                  >
                    <div className={`absolute inset-0 transition-transform duration-500 group-hover:scale-110 bg-gradient-to-br ${
                      i % 3 === 0 ? 'from-blue-400 to-purple-500' :
                      i % 2 === 0 ? 'from-orange-400 to-pink-500' : 'from-green-400 to-teal-500'
                    }`} />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            isUploading ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#CC0000]/30 bg-red-50">
                <Loader2 className="mb-4 h-10 w-10 text-[#CC0000] animate-spin" />
                <p className="text-sm font-bold text-[#CC0000]">Uploading image...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <label className="relative flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-[#F5F5F5] transition-colors hover:border-[#CC0000] hover:bg-red-50 cursor-pointer">
                  <UploadCloud className="mb-4 h-10 w-10 text-[#9CA3AF]" />
                  <p className="mb-1 text-sm font-bold text-[#1A1A1A]">Click to upload or drag and drop</p>
                  <p className="text-xs text-[#6B7280]">PNG, JPG, WebP or GIF (max. 5MB)</p>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileUpload}
                  />
                </label>
                {uploadError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                    <p className="text-xs text-red-600">{uploadError}</p>
                  </div>
                )}
              </div>
            )
          )}

          {activeTab === 'url' && (
            <div className="flex h-64 flex-col justify-center gap-4">
              <label className="text-sm font-semibold text-[#1A1A1A]">Image URL</label>
              <input
                type="text"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border border-[#E5E7EB] bg-[#F5F5F5] py-3 px-4 text-sm text-[#1A1A1A] placeholder-[#9CA3AF] focus:border-[#CC0000] focus:outline-none focus:ring-1 focus:ring-[#CC0000] transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEmbedUrl();
                }}
              />
              <button
                onClick={handleEmbedUrl}
                disabled={!webUrl.trim()}
                className="self-end rounded-lg bg-[#CC0000] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#A80000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Embed Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
