// apps/api/src/services/__tests__/notificationService.test.ts

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { CreateNotificationInput } from '../../types/notificationTypes.js';

// ── ESM mock registration — must be before any import of the service ────────

const mockCreate = jest.fn<any>();

await jest.unstable_mockModule('../../repositories/notificationRepository.js', () => ({
  default: { create: mockCreate },
}));

// Import AFTER mock is registered (ESM requirement)
const { default: notificationService } = await import(
  '../notificationService.js'
);

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const samplePayload: CreateNotificationInput = {
  recipientId:               'user-uuid-1',
  notificationTitle:         'Article approved',
  notificationReferenceType: 'article',
  referenceId:               'article-uuid-1',
  notificationType:          'success',
  message:                   'Your article has been approved.',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('NotificationService.send', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call repository.create() with the exact payload', async () => {
    // Arrange
    mockCreate.mockResolvedValue({
      id:                        'notif-uuid-1',
      ...samplePayload,
      isRead:                    false,
      readAt:                    null,
      deletedAt:                 null,
      createdAt:                 new Date('2026-07-01T00:00:00.000Z'),
    });

    // Act
    await notificationService.send(samplePayload);

    // Assert
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(samplePayload);
  });

  it('should propagate repository errors (does not catch them)', async () => {
    // Arrange
    const dbError = new Error('Database is unavailable');
    mockCreate.mockRejectedValue(dbError);

    // Act + Assert
    await expect(notificationService.send(samplePayload)).rejects.toThrow(
      'Database is unavailable',
    );

    expect(mockCreate).toHaveBeenCalledTimes(1);
  });
});
