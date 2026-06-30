// apps/api/src/services/__tests__/user.service.test.ts

import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import type { User, CreateUserInput } from '../../types/userTypes.js';

// ESM mock — must be before any imports
await jest.unstable_mockModule('../../repositories/userRepository.js', () => ({
  default: {
    getAll: jest.fn(),
    findByEmail: jest.fn(),
    createAdminUser: jest.fn(),
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

  describe('getAll', () => {

    it('should return all users from repository', async () => {
      const mockUsers: User[] = [
        makeUser({ id: '1', name: 'Malindu', email: 'malindu@1billiontech.com' }),
        makeUser({ id: '2', name: 'Lahiru', email: 'lahiru@1billiontech.com' }),
      ];

      mockedRepo.getAll.mockResolvedValue(mockUsers);

      const result = await UserService.getAll();

      expect(mockedRepo.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      mockedRepo.getAll.mockResolvedValue([]);

      const result = await UserService.getAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

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

});
