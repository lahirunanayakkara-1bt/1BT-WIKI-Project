// apps/api/src/services/profileService.ts

import UserRepository from '../repositories/userRepository.js';
import { AppError } from '../errors/AppError.js';
import type { UserProfile } from '../types/userTypes.js';

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/**
 * Fetch the authenticated user's own profile.
 *
 * Business rules:
 *  - Throws AppError 404 if the user record cannot be found.
 *  - Maps raw DB columns to the safe `UserProfile` shape:
 *      image   → avatarUrl   (domain alias; null if not set)
 *      !banned → isActive    (null `banned` is treated as active/false)
 *  - Never leaks sensitive fields (emailVerified, banReason, banExpires, etc.)
 *
 * @param userId - The authenticated user's id (from req.user.userId)
 * @returns Safe UserProfile object
 * @throws AppError 404 — user record not found
 */
const getProfile = async (userId: string): Promise<UserProfile> => {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Map raw DB row → safe outward-facing shape
  const profile: UserProfile = {
    id:        user.id,
    name:      user.name,
    email:     user.email,          // read-only; managed by Google / Neon Auth
    avatarUrl: user.image,          // DB column `image` aliased to `avatarUrl`
    role:      user.role,
    isActive:  user.banned !== true, // null or false → active; true → inactive
    createdAt: user.createdAt,
  };

  return profile;
};

export default { getProfile };
