import pool from '../../db/index.js';
import { AppError } from '../../errors/AppError.js';
import type { User, CreateUserInput } from '../../types/userTypes.js';

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


// ---------------------------------------------------------------------------
// Write operations
// ---------------------------------------------------------------------------

/**
 * Insert a new user record into neon_auth.user.
 * Used by Admin to manually onboard a user into the system.
 *
 * Notes:
 *  - emailVerified defaults to false (user has not verified yet)
 *  - role defaults to 'User' if not provided by the admin
 *  - camelCase column names must be double-quoted in PostgreSQL
 *
 * @param data - Validated user input from the service layer
 * @returns The newly created user row
 */
const createAdminUser = async (data: CreateUserInput): Promise<User> => {
  try {
    const { rows } = await pool.query<User>(
      `INSERT INTO neon_auth.user
         (name, email, "emailVerified", image, role)
       VALUES
         ($1, $2, $3, $4, $5)
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
      [
        data.name,
        data.email,
        false,                    // emailVerified — false until user logs in
        data.image ?? null,       // image — optional
        data.role ?? 'User',      // role — defaults to 'User'
      ]
    );
    return rows[0];
  } catch (error) {
    throw new AppError('Database is unavailable', 503);
  }
};



export default { getAllUsers, createAdminUser };