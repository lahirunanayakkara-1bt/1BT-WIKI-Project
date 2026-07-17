'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Image as ImageIcon, Undo, Redo, X } from 'lucide-react';
import { useEditorDraft } from './EditorDraftContext';

interface RichTextEditorProps {
  onOpenImageEmbed: () => void;
}

const MenuBar = ({ editor, onOpenImageEmbed }: { editor: ReturnType<typeof useEditor>, onOpenImageEmbed: () => void }) => {
  if (!editor) return null;

  const ToolbarButton = ({ onClick, isActive, disabled, children }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded transition-colors ${
        isActive
          ? 'bg-[#CC0000]/10 text-[#CC0000]'
          : 'text-[#6B7280] hover:bg-[#F0F0F0] hover:text-[#1A1A1A]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-[#E5E7EB] bg-white p-2">
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')}>
        <Code className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-2 h-6 w-px bg-[#E5E7EB]" />

      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-2 h-6 w-px bg-[#E5E7EB]" />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-2 h-6 w-px bg-[#E5E7EB]" />

      <button
        onClick={onOpenImageEmbed}
        className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium text-[#1A1A1A] hover:bg-[#F0F0F0] transition-colors"
      >
        <ImageIcon className="h-4 w-4 text-[#CC0000]" />
        Embed Image
      </button>

      <div className="mx-2 h-6 w-px bg-[#E5E7EB]" />

      <div className="ml-auto flex items-center gap-1">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );
};

export function RichTextEditor({ onOpenImageEmbed }: RichTextEditorProps) {
  const {
    title,
    setTitle,
    tags,
    setTags,
    registerEditor,
    handleTitleBlur,
    notifyContentChanged,
  } = useEditorDraft();

  const popularTags = ['Technology', 'Design', 'Writing', 'Tutorial', 'Lifestyle', 'Productivity', 'Inspiration', 'Programming', 'Craftsmanship'];

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none p-6 min-h-[400px]',
      },
    },
    onUpdate: ({ editor: ed }) => {
      const text = ed.state.doc.textContent;
      const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
      const chars = text.length;
      notifyContentChanged(words, chars);
    },
  });

  // Register the TipTap editor instance in context so saveDraft/uploadImage
  // can call editor.getJSON()
  useEffect(() => {
    registerEditor(editor ?? null);
    return () => registerEditor(null);
  }, [editor, registerEditor]);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const addTag = (tagToAdd: string) => {
    if (!tags.includes(tagToAdd)) {
      setTags([...tags, tagToAdd]);
    }
  };

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm border border-[#E5E7EB] overflow-hidden">
      <div className="p-8 pb-4">
        <p className="text-xs font-bold tracking-widest text-[#6B7280] uppercase mb-2">Article Title</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Enter an inspiring title..."
          className="w-full bg-transparent text-4xl font-bold font-display text-[#1A1A1A] outline-none placeholder:text-[#9CA3AF] mb-8"
        />

        <p className="text-xs font-bold tracking-widest text-[#6B7280] uppercase mb-3">Tags & Classification</p>
        
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-[#F5F5F5] rounded-lg border border-[#E5E7EB]">
          {tags.map(tag => (
            <div key={tag} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium border border-[#E5E7EB] shadow-sm">
              <span className="text-[#CC0000]">#</span> {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 text-[#9CA3AF] hover:text-[#CC0000]">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <input 
            type="text" 
            placeholder="Add tag..." 
            className="bg-transparent text-sm outline-none px-2 text-[#1A1A1A] placeholder:text-[#9CA3AF] flex-1 min-w-[100px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                addTag(e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mr-2">Popular Suggestions:</span>
          {popularTags.map(tag => {
            const isSelected = tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => addTag(tag)}
                disabled={isSelected}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#CC0000] text-white opacity-50 cursor-not-allowed'
                    : 'border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#CC0000] hover:text-[#CC0000]'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-col border-t border-[#E5E7EB]">
        <div className="px-8 py-3 bg-[#F5F5F5] border-b border-[#E5E7EB]">
          <p className="text-xs font-bold tracking-widest text-[#6B7280] uppercase">Rich Story Content</p>
        </div>
        <MenuBar editor={editor} onOpenImageEmbed={onOpenImageEmbed} />
        <div className="bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
