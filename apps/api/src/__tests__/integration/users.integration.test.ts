// apps/api/src/__tests__/integration/users.integration.test.ts

import { jest, describe, it, expect, beforeAll } from '@jest/globals';

// ESM requires unstable_mockModule — jest.mock() doesn't hoist in ESM
await jest.unstable_mockModule('../../db/index.js', () => ({
  default: {
    query: jest.fn<any>().mockResolvedValue({ rows: [] }),
    connect: jest.fn(),
    end: jest.fn(),
  },
  pool: {
    query: jest.fn<any>().mockResolvedValue({ rows: [] }),
    connect: jest.fn(),
    end: jest.fn(),
  },
}));

// Import AFTER mock is registered
const { default: app, appReady } = await import('../../app.js');
const { default: request } = await import('supertest');

// Get reference to the mock query function
const { default: pool } = await import('../../db/index.js');
const mockQuery = pool.query as jest.Mock<any>;

describe('Integration — Users API', () => {

  beforeAll(async () => {
    await appReady;
  });

  it('GET /api/v1/users/getAll should return 200 with JSON success envelope', async () => {
    const mockUsers = [
      {
        id: '1',
        name: 'Malindu',
        email: 'malindu@1billiontech.com',
        emailVerified: false,
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'User',
        banned: null,
        banReason: null,
        banExpires: null,
      },
    ];

    mockQuery.mockResolvedValueOnce({ rows: mockUsers });

    const response = await request(app).get('/api/v1/users/getAll');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toEqual({ success: true, data: mockUsers });
  });

  it('POST /api/v1/admin/users should create a user and return 201', async () => {
    const mockCreatedUser = {
      id: '2',
      name: 'Chathurika',
      email: 'chathurika@1billiontech.com',
      emailVerified: false,
      image: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'User',
      banned: null,
      banReason: null,
      banExpires: null,
    };

    mockQuery.mockResolvedValueOnce({ rows: [] });
    mockQuery.mockResolvedValueOnce({ rows: [mockCreatedUser] });

    const response = await request(app)
      .post('/api/v1/admin/users')
      .send({ name: 'Chathurika', email: 'chathurika@1billiontech.com', role: 'User' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockCreatedUser);
    expect(response.body.message).toBe('User created successfully');
  });

  it('POST /api/v1/admin/users without name should return 400', async () => {
    const response = await request(app)
      .post('/api/v1/admin/users')
      .send({ email: 'missingname@1billiontech.com' });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Name is required');
  });

});
