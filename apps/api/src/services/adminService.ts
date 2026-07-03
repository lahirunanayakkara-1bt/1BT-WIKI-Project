import adminRepository from '../repositories/adminRepository.js';
import { AppError } from '../errors/AppError.js';
import type {
  User,
  CreateUserInput,
  UserRole,
  UpdateUserBanInput,
} from '../types/userTypes.js';

// Accepted role values
const VALID_ROLES: UserRole[] = ['Admin', 'Reviewer', 'User'];

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Return the full list of users in the system. */
const getAllUsers = async (): Promise<User[]> => {
  return adminRepository.getAllUsers();
};

export default { getAllUsers };