import UserRepository from '../repositories/userRepository.js';
import { AppError } from '../errors/AppError.js';
import type { User, CreateUserInput, UserRole } from '../types/userTypes.js';

// Accepted role values
const VALID_ROLES: UserRole[] = ['Admin', 'Reviewer', 'User'];

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Return the full list of users in the system. */
const getAll = async (): Promise<User[]> => {
  return UserRepository.getAll();
};

// ---------------------------------------------------------------------------
// Admin operations
// ---------------------------------------------------------------------------

/**
 * Admin-only: onboard a new user into the system.
 *
 * Business rules:
 *  - name and email are required
 *  - email must be a valid format
 *  - role must be 'Admin', 'Reviewer', or 'User' (defaults to 'User')
 *  - duplicate emails are rejected with HTTP 409
 *
 * @param data - Input from the controller (name, email, role?, image?)
 * @returns The newly created user record
 * @throws AppError 400 — missing or invalid fields
 * @throws AppError 409 — email already exists
 */
const adminCreateUser = async (data: CreateUserInput): Promise<User> => {

  // --- Validate name ---
  if (!data.name || data.name.trim().length === 0) {
    throw new AppError('Name is required', 400);
  }

  // --- Validate email ---
  if (!data.email || data.email.trim().length === 0) {
    throw new AppError('Email is required', 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    throw new AppError('Email format is invalid', 400);
  }

  // --- Validate role (if provided) ---
  if (data.role && !VALID_ROLES.includes(data.role)) {
    throw new AppError(
      `Role must be one of: ${VALID_ROLES.join(', ')}`,
      400
    );
  }

  // --- Duplicate email check ---
  const existing = await UserRepository.findByEmail(data.email.toLowerCase().trim());
  if (existing) {
    throw new AppError('A user with this email already exists', 409);
  }

  // --- Persist ---
  return UserRepository.createAdminUser({
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    role: data.role ?? 'User',
    image: data.image?.trim() ?? undefined,
  });
};

export default { getAll, adminCreateUser };
