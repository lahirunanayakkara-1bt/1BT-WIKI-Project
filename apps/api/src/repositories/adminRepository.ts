import pool from '../db/index.js';
import { AppError } from '../errors/AppError.js';
import type { User } from '../types/userTypes.js';

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

/**
 * Return all users ordered by creation date (newest first).
 * Column names are camelCase in neon_auth.user — must be double-quoted in SQL.
 */
const getAllUsers = async (): Promise<User[]> => {
  try {
    const { rows } = await pool.query<User>(
      `SELECT
         id,
         name,
         email,
         "emailVerified",
         image,
         "createdAt",
         "updatedAt",
         role,
         banned,
         "banReason",
         "banExpires"
       FROM neon_auth.user
       ORDER BY "createdAt" DESC`
    );
    return rows;
  } catch (error) {
    throw new AppError('Database is unavailable', 503);
  }
};

export default { getAllUsers };