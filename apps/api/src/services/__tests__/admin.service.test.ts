// apps/api/src/services/__tests__/admin.service.test.ts
//
// Unit tests for AdminService — the service layer that sits between
// adminController and adminRepository.
//
// Strategy:
//   Mock adminRepository before importing AdminService so Jest replaces the
//   real DB calls with controllable fakes (ESM hoisting requirement).

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { User } from '../../types/userTypes.js';

// ---------------------------------------------------------------------------
// ESM mock — must be registered BEFORE any dynamic imports
// ---------------------------------------------------------------------------

await jest.unstable_mockModule('../../repositories/adminRepository.js', () => ({
  default: {
    getAllUsers: jest.fn(),
  },
}));

// ---------------------------------------------------------------------------
// Import AFTER mock is registered
// ---------------------------------------------------------------------------

const { default: AdminService }    = await import('../adminService.js');
const { default: AdminRepository } = await import('../../repositories/adminRepository.js');

const mockedRepo = AdminRepository as jest.Mocked<typeof AdminRepository>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: '1',
  name: 'Test User',
  email: 'test@1billiontech.com',
  emailVerified: false,
  image: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  role: 'User',
  banned: null,
  banReason: null,
  banExpires: null,
  ...overrides,
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AdminService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── getAllUsers ─────────────────────────────────────────────────────────────

  describe('getAllUsers', () => {

    it('should return all users from the repository', async () => {
      const mockUsers: User[] = [
        makeUser({ id: '1', name: 'Malindu', email: 'malindu@1billiontech.com' }),
        makeUser({ id: '2', name: 'Lahiru',  email: 'lahiru@1billiontech.com'  }),
      ];

      mockedRepo.getAllUsers.mockResolvedValue(mockUsers);

      const result = await AdminService.getAllUsers();

      expect(mockedRepo.getAllUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });

    it('should return an empty array when no users exist', async () => {
      mockedRepo.getAllUsers.mockResolvedValue([]);

      const result = await AdminService.getAllUsers();

      expect(mockedRepo.getAllUsers).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should propagate errors thrown by the repository', async () => {
      mockedRepo.getAllUsers.mockRejectedValue(
        Object.assign(new Error('Database is unavailable'), { statusCode: 503 })
      );

      await expect(AdminService.getAllUsers()).rejects.toMatchObject({
        message: 'Database is unavailable',
      });

      expect(mockedRepo.getAllUsers).toHaveBeenCalledTimes(1);
    });

  });

});
