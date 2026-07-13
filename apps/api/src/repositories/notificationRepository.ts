// apps/api/src/repositories/notificationRepository.ts

import pool from '../db/index.js';
import { AppError } from '../errors/AppError.js';
import type {
  Notification,
  CreateNotificationInput,
} from '../types/notificationTypes.js';

// ---------------------------------------------------------------------------
// Row → Entity mapper (snake_case DB columns → camelCase TS interface)
// ---------------------------------------------------------------------------

interface NotificationRow {
  id: string;
  recipient_id: string;
  notification_title: string;
  notification_reference_type: string;
  reference_id: string;
  notification_type: string;
  message: string;
  is_read: boolean;
  read_at: Date | null;
  deleted_at: Date | null;
  created_at: Date;
}

const mapRow = (row: NotificationRow): Notification => ({
  id: row.id,
  recipientId: row.recipient_id,
  notificationTitle: row.notification_title,
  notificationReferenceType: row.notification_reference_type as Notification['notificationReferenceType'],
  referenceId: row.reference_id,
  notificationType: row.notification_type as Notification['notificationType'],
  message: row.message,
  isRead: row.is_read,
  readAt: row.read_at,
  deletedAt: row.deleted_at,
  createdAt: row.created_at,
});

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

/**
 * Insert a new notification row and return the mapped entity.
 * is_read defaults to FALSE, read_at defaults to NULL (DB defaults).
 */
const create = async (input: CreateNotificationInput): Promise<Notification> => {
  try {
    const { rows } = await pool.query<NotificationRow>(
      `INSERT INTO notifications
         (recipient_id, notification_title, notification_reference_type,
          reference_id, notification_type, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING
         id,
         recipient_id,
         notification_title,
         notification_reference_type,
         reference_id,
         notification_type,
         message,
         is_read,
         read_at,
         deleted_at,
         created_at`,
      [
        input.recipientId,
        input.notificationTitle,
        input.notificationReferenceType,
        input.referenceId,
        input.notificationType,
        input.message,
      ],
    );

    return mapRow(rows[0]);
  } catch (error) {
    throw new AppError('Database is unavailable', 503);
  }
};

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/**
 * Find a single notification by its primary key.
 * Excludes soft-deleted rows (deleted_at IS NULL).
 * Returns null when no match is found.
 */
const findById = async (id: string): Promise<Notification | null> => {
  try {
    const { rows } = await pool.query<NotificationRow>(
      `SELECT
         id,
         recipient_id,
         notification_title,
         notification_reference_type,
         reference_id,
         notification_type,
         message,
         is_read,
         read_at,
         deleted_at,
         created_at
       FROM notifications
       WHERE id = $1
         AND deleted_at IS NULL
       LIMIT 1`,
      [id],
    );

    return rows[0] ? mapRow(rows[0]) : null;
  } catch (error) {
    throw new AppError('Database is unavailable', 503);
  }
};

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

/**
 * Return paginated notifications for a recipient.
 * Excludes soft-deleted rows (deleted_at IS NULL).
 * Returns an empty array when no rows match.
 */
const list = async (
  recipientId: string,
  options: { limit: number; offset: number },
): Promise<Notification[]> => {
  try {
    const { rows } = await pool.query<NotificationRow>(
      `SELECT
         id,
         recipient_id,
         notification_title,
         notification_reference_type,
         reference_id,
         notification_type,
         message,
         is_read,
         read_at,
         deleted_at,
         created_at
       FROM notifications
       WHERE recipient_id = $1
         AND deleted_at IS NULL
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [recipientId, options.limit, options.offset],
    );

    return rows.map(mapRow);
  } catch (error) {
    throw new AppError('Database is unavailable', 503);
  }
};

const markAsRead = async (
  id: string,
  recipientId: string,
): Promise<Notification | null> => {
  try {
    const { rows } = await pool.query<NotificationRow>(
      `UPDATE notifications
      SET is_read = true,
      read_at = NOW()
      WHERE id = $1
      AND recipient_id = $2
      AND deleted_at IS NULL
      RETURNING
        id,
        recipient_id,
        notification_title,
        message,
        is_read,
        read_at,
        deleted_at,
        created_at`,
      [id, recipientId],
    );

    return rows[0] ? mapRow(rows[0]) : null;

  } catch (error) {

    throw new AppError('Database is unavailable', 503);
  }
};

export default { create, findById, list, markAsRead };

