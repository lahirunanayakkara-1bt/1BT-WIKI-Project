// apps/api/src/services/__tests__/user.service.test.ts

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { User, CreateUserInput } from '../../types/userTypes.js';

// ESM mock — must be before any imports
await jest.unstable_mockModule('../../repositories/userRepository.js', () => ({
  default: {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    createAdminUser: jest.fn(),
    updateRole: jest.fn(),
    updateBanStatus: jest.fn(),
  },
}));

// Import AFTER mock is registered
const { default: UserService } = await import('../userService.js');
const { default: UserRepository } = await import('../../repositories/userRepository.js');

const mockedRepo = UserRepository as jest.Mocked<typeof UserRepository>;

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

describe('UserService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('adminCreateUser', () => {

    it('should create and return a new user', async () => {
      const input: CreateUserInput = {
        name: 'Chathurika',
        email: 'chathurika@1billiontech.com',
        role: 'User',
      };
      const mockCreated = makeUser({ id: '3', ...input });

      mockedRepo.findByEmail.mockResolvedValue(null);
      mockedRepo.createAdminUser.mockResolvedValue(mockCreated);

      const result = await UserService.adminCreateUser(input);

      expect(mockedRepo.findByEmail).toHaveBeenCalledWith('chathurika@1billiontech.com');
      expect(mockedRepo.createAdminUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Chathurika',
          email: 'chathurika@1billiontech.com',
          role: 'User',
        })
      );
      expect(result).toEqual(mockCreated);
    });

    it('should reject invalid email format', async () => {
      const input: CreateUserInput = {
        name: 'Invalid Email',
        email: 'not-an-email',
      };

      await expect(UserService.adminCreateUser(input)).rejects.toMatchObject({
        message: 'Email format is invalid',
      });

      expect(mockedRepo.findByEmail).not.toHaveBeenCalled();
      expect(mockedRepo.createAdminUser).not.toHaveBeenCalled();
    });

    it('should reject duplicate email with conflict', async () => {
      const input: CreateUserInput = {
        name: 'Duplicate',
        email: 'duplicate@1billiontech.com',
      };
      mockedRepo.findByEmail.mockResolvedValue(
        makeUser({ id: '4', email: 'duplicate@1billiontech.com' })
      );

      await expect(UserService.adminCreateUser(input)).rejects.toMatchObject({
        message: 'A user with this email already exists',
      });

      expect(mockedRepo.createAdminUser).not.toHaveBeenCalled();
    });

  });

  describe('updateUserRole', () => {

    it('should update a user role when the role is valid', async () => {
      const updatedUser = makeUser({ id: '9', role: 'Reviewer' });
      mockedRepo.findById.mockResolvedValue(makeUser({ id: '9', role: 'User' }));
      mockedRepo.updateRole.mockResolvedValue(updatedUser);

      const result = await UserService.updateUserRole('9', 'Reviewer');

      expect(mockedRepo.findById).toHaveBeenCalledWith('9');
      expect(mockedRepo.updateRole).toHaveBeenCalledWith('9', 'Reviewer');
      expect(result).toEqual(updatedUser);
    });

    it('should reject an invalid role', async () => {
      await expect(UserService.updateUserRole('9', 'SuperAdmin' as never)).rejects.toMatchObject({
        message: 'Role must be one of: Admin, Reviewer, User',
      });

      expect(mockedRepo.updateRole).not.toHaveBeenCalled();
    });

  });

  describe('updateUserBanStatus', () => {

    it('should deactivate a user when banned is true with reason', async () => {
      const updatedUser = makeUser({ id: '5', banned: true, banReason: 'policy violation' });
      mockedRepo.findById.mockResolvedValue(makeUser({ id: '5', banned: false, banReason: null }));
      mockedRepo.updateBanStatus.mockResolvedValue(updatedUser);

      const result = await UserService.updateUserBanStatus('5', {
        banned: true,
        banReason: 'policy violation',
      });

      expect(mockedRepo.findById).toHaveBeenCalledWith('5');
      expect(mockedRepo.updateBanStatus).toHaveBeenCalledWith('5', {
        banned: true,
        banReason: 'policy violation',
      });
      expect(result).toEqual(updatedUser);
    });

    it('should reactivate a user when banned is false', async () => {
      const updatedUser = makeUser({ id: '6', banned: false, banReason: null });
      mockedRepo.findById.mockResolvedValue(makeUser({ id: '6', banned: true, banReason: 'temporary block' }));
      mockedRepo.updateBanStatus.mockResolvedValue(updatedUser);

      const result = await UserService.updateUserBanStatus('6', {
        banned: false,
      });

      expect(mockedRepo.findById).toHaveBeenCalledWith('6');
      expect(mockedRepo.updateBanStatus).toHaveBeenCalledWith('6', {
        banned: false,
        banReason: null,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should reject banning without reason', async () => {
      mockedRepo.findById.mockResolvedValue(makeUser({ id: '7', banned: false, banReason: null }));

      await expect(UserService.updateUserBanStatus('7', {
        banned: true,
      })).rejects.toMatchObject({
        message: 'Ban reason is required when banning a user',
      });

      expect(mockedRepo.updateBanStatus).not.toHaveBeenCalled();
    });

  });

});
