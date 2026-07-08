// apps/api/src/services/notificationService.ts

import NotificationRepository from '../repositories/notificationRepository.js';
import type { CreateNotificationInput } from '../types/notificationTypes.js';

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Notification service — thin orchestration layer over the repository.
 *
 * `send()` is designed to be called fire-and-forget by other services:
 *
 *   notificationService.send(payload).catch(err => console.error(err));
 *
 * Errors propagate normally (not swallowed here) so the caller can decide
 * whether to log or ignore them.
 */
class NotificationService {
  /**
   * Persist a new notification in the database.
   *
   * @param payload - Fields required to create the notification row
   */
  async send(payload: CreateNotificationInput): Promise<void> {
    await NotificationRepository.create(payload);
  }
}

export default new NotificationService();
