import pool from '../db/index.js';
import { AppError } from '../errors/AppError.js';
import type { User, CreateUserInput } from '../types/userTypes.js';

/**
 * Find a single user by their email address.
 * Returns null when no match is found.
 */
const findByEmail = async (email: string): Promise<User | null> => {
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
       WHERE email = $1
       LIMIT 1`,
      [email]
    );
    return rows[0] ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Unable to look up user by email:', error instanceof Error ? error.message : error);
    return null;
  }
};

/**
 * Find a single user by their primary key (id).
 * Returns null when no match is found.
 */
const findById = async (userId: string): Promise<User | null> => {
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
       WHERE id = $1
       LIMIT 1`,
      [userId]
    );
    return rows[0] ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Unable to look up user by id:', error instanceof Error ? error.message : error);
    return null;
  }
};

const updateRole = async (id: string, role: string): Promise<User> => {
  try {
    const { rows } = await pool.query<User>(
      `UPDATE neon_auth.user
       SET role = $2,
           "updatedAt" = NOW()
       WHERE id = $1
       RETURNING
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
         "banExpires"`,
      [id, role]
    );
    return rows[0];
  } catch (error) {
    throw new AppError('Database is unavailable', 503);
  }
};

const updateBanStatus = async (
  id: string,
  data: { banned: boolean; banReason: string | null }
): Promise<User> => {
  try {
    const { rows } = await pool.query<User>(
      `UPDATE neon_auth.user
       SET banned = $2,
           "banReason" = $3,
           "updatedAt" = NOW()
       WHERE id = $1
       RETURNING
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
         "banExpires"`,
      [id, data.banned, data.banReason]
    );
    return rows[0];
  } catch (error) {
    throw new AppError('Database is unavailable', 503);
  }
};

const updateById = async (userId: string, updates: { name?: string; image?: string | null }): Promise<User | null> => {
  const setClauses: string[] = [];
  const values: any[] = [userId];

  if (updates.name !== undefined) {
    values.push(updates.name);
    setClauses.push(`name = $${values.length}`);
  }

  if (updates.image !== undefined) {
    values.push(updates.image);
    setClauses.push(`image = $${values.length}`);
  }

  if (setClauses.length === 0) {
    throw new AppError('no valid fields to update', 400);
  }

  try {
    const { rows } = await pool.query<User>(
      `UPDATE neon_auth.user
       SET ${setClauses.join(', ')},
           "updatedAt" = NOW()
       WHERE id = $1
       RETURNING
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
         "banExpires"`,
      values
    );
    return rows[0] ?? null;
  } catch (error) {
    throw new AppError('Database is unavailable', 503);
  }
};

export default { findByEmail, findById, updateRole, updateBanStatus, updateById };
