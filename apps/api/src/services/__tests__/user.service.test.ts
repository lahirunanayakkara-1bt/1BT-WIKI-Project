// apps/api/src/services/__tests__/user.service.test.ts

import UserService from '../userService.js';
import UserRepository from '../../repositories/userRepository.js';

// Mock the entire repository — no real DB calls
jest.mock('../../repositories/userRepository.js');

const mockedRepo = UserRepository as jest.Mocked<typeof UserRepository>;

describe('UserService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────
  describe('getAll', () => {

    it('should return all users from repository', async () => {
      // Arrange
      const mockUsers = [
        { id: 1, name: 'Malindu', email: 'malindu@1billiontech.com' },
        { id: 2, name: 'Lahiru', email: 'lahiru@1billiontech.com' },
      ];
      mockedRepo.getAll.mockResolvedValue(mockUsers);

      // Act
      const result = await UserService.getAll();

      // Assert
      expect(mockedRepo.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      mockedRepo.getAll.mockResolvedValue([]);

      // Act
      const result = await UserService.getAll();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

  });

  // ─────────────────────────────────────────
  describe('create', () => {

    it('should create and return a new user', async () => {
      // Arrange
      const input = { name: 'Chathurika', email: 'chathurika@1billiontech.com' };
      const mockCreated = { id: 3, ...input };
      mockedRepo.create.mockResolvedValue(mockCreated);

      // Act
      const result = await UserService.create(input);

      // Assert
      expect(mockedRepo.create).toHaveBeenCalledWith(input);
      expect(result).toHaveProperty('id');
      expect(result).toEqual(mockCreated);
    });

    it('should use Anonymous when name is not provided', async () => {
      // Arrange
      const input = { email: 'test@1billiontech.com' };
      const mockCreated = { id: 4, name: 'Anonymous', email: 'test@1billiontech.com' };
      mockedRepo.create.mockResolvedValue(mockCreated);

      // Act
      const result = await UserService.create(input);

      // Assert
      expect(result.name).toBe('Anonymous');
      expect(result.email).toBe('test@1billiontech.com');
    });

  });

});