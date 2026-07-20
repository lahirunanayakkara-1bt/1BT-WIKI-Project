'use client';

import React from 'react';
import { RichTextEditor } from './RichTextEditor';
import { PublishingSettingsBox } from './PublishingSettingsBox';
import { FeaturedMediaBox } from './FeaturedMediaBox';

interface ComposerViewProps {
  onOpenImageEmbed: () => void;
}

export function ComposerView({ onOpenImageEmbed }: ComposerViewProps) {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Panel (8 Columns) - Editor */}
        <div className="lg:col-span-8">
          <RichTextEditor onOpenImageEmbed={onOpenImageEmbed} />
        </div>

        {/* Right Panel (4 Columns) - Settings */}
        <div className="lg:col-span-4 flex flex-col">
          <PublishingSettingsBox />
          <FeaturedMediaBox />
        </div>
      </div>
    </div>
  );
}
