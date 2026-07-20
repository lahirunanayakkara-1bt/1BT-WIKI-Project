import type { SaveStatus } from '@/components/editor/EditorDraftContext';

export type { SaveStatus };

export const getStatusDotColor = (status: SaveStatus): string => {
  switch (status) {
    case 'saving':
      return 'bg-[#EAB308]';
    case 'saved':
      return 'bg-[#22C55E]';
    case 'error':
      return 'bg-[#EF4444]';
    default:
      return 'bg-[#9CA3AF]';
  }
};

export const getStatusText = (status: SaveStatus, lastSavedAt: Date | null): string => {
  switch (status) {
    case 'saving':
      return 'Saving...';
    case 'saved': {
      if (lastSavedAt) {
        return `Draft saved at ${lastSavedAt.toLocaleTimeString()}`;
      }
      return 'Draft saved';
    }
    case 'error':
      return 'Save failed';
    default:
      return 'Unsaved';
  }
};
