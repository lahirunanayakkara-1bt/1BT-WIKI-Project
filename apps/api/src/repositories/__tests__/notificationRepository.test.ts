// apps/api/src/repositories/__tests__/notificationRepository.test.ts

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type {
  Notification,
  CreateNotificationInput,
} from '../../types/notificationTypes.js';

// ── ESM mock registration — must be before any import of the repository ─────

const mockQuery = jest.fn<any>();

await jest.unstable_mockModule('../../db/index.js', () => ({
  default: { query: mockQuery },
}));

// Import AFTER mock is registered (ESM requirement)
const { default: NotificationRepository } = await import(
  '../notificationRepository.js'
);

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

/** A raw DB row as returned by pg (snake_case columns). */
const makeDbRow = (overrides: Record<string, unknown> = {}) => ({
  id:                           'notif-uuid-1',
  recipient_id:                 'user-uuid-1',
  notification_title:           'Article approved',
  notification_reference_type:  'article',
  reference_id:                 'article-uuid-1',
  notification_type:            'success',
  message:                      'Your article has been approved.',
  is_read:                      false,
  read_at:                      null,
  deleted_at:                   null,
  created_at:                   new Date('2026-07-01T00:00:00.000Z'),
  ...overrides,
});

/** The expected camelCase entity after mapping. */
const expectedEntity: Notification = {
  id:                        'notif-uuid-1',
  recipientId:               'user-uuid-1',
  notificationTitle:         'Article approved',
  notificationReferenceType: 'article',
  referenceId:               'article-uuid-1',
  notificationType:          'success',
  message:                   'Your article has been approved.',
  isRead:                    false,
  readAt:                    null,
  deletedAt:                 null,
  createdAt:                 new Date('2026-07-01T00:00:00.000Z'),
};

const sampleInput: CreateNotificationInput = {
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

describe('NotificationRepository.create', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build correct parameterized SQL and return mapped entity', async () => {
    // Arrange
    mockQuery.mockResolvedValue({ rows: [makeDbRow()] });

    // Act
    const result = await NotificationRepository.create(sampleInput);

    // Assert — query called with parameterized SQL
    expect(mockQuery).toHaveBeenCalledTimes(1);

    const [sql, params] = mockQuery.mock.calls[0] as [string, string[]];
    expect(sql).toContain('INSERT INTO notifications');
    expect(sql).toContain('$1');
    expect(sql).toContain('$6');
    expect(sql).toContain('RETURNING');
    expect(params).toEqual([
      sampleInput.recipientId,
      sampleInput.notificationTitle,
      sampleInput.notificationReferenceType,
      sampleInput.referenceId,
      sampleInput.notificationType,
      sampleInput.message,
    ]);

    // Assert — returned entity is mapped to camelCase
    expect(result).toEqual(expectedEntity);
  });
});

describe('NotificationRepository.findById', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when no row is found', async () => {
    // Arrange
    mockQuery.mockResolvedValue({ rows: [] });

    // Act
    const result = await NotificationRepository.findById('nonexistent-id');

    // Assert
    expect(result).toBeNull();
    expect(mockQuery).toHaveBeenCalledTimes(1);
  });

  it('should exclude soft-deleted rows (deleted_at IS NULL in WHERE clause)', async () => {
    // Arrange
    mockQuery.mockResolvedValue({ rows: [] });

    // Act
    await NotificationRepository.findById('some-id');

    // Assert — SQL includes the soft-delete filter
    const [sql] = mockQuery.mock.calls[0] as [string];
    expect(sql).toContain('deleted_at IS NULL');
  });

  it('should return mapped entity when a matching row is found', async () => {
    // Arrange
    mockQuery.mockResolvedValue({ rows: [makeDbRow()] });

    // Act
    const result = await NotificationRepository.findById('notif-uuid-1');

    // Assert
    expect(result).toEqual(expectedEntity);
    expect(mockQuery).toHaveBeenCalledTimes(1);

    const [, params] = mockQuery.mock.calls[0] as [string, string[]];
    expect(params).toEqual(['notif-uuid-1']);
  });
});
