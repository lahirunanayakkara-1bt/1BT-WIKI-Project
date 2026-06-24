// apps/api/src/__tests__/integration/users.integration.test.ts

import { jest, describe, it, expect, beforeAll } from '@jest/globals';

// ESM requires unstable_mockModule — jest.mock() doesn't hoist in ESM
await jest.unstable_mockModule('../../db.js', () => ({
  default: {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    connect: jest.fn(),
    end: jest.fn(),
  },
  pool: {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    connect: jest.fn(),
    end: jest.fn(),
  },
}));

// Import AFTER mock is registered
const { default: app, appReady } = await import('../../app.js');
const { default: request } = await import('supertest');

// Get reference to the mock query function
const { default: pool } = await import('../../db.js');
const mockQuery = pool.query as jest.Mock;

describe('Integration — Users API', () => {

  beforeAll(async () => {
    await appReady;
  });

  it('GET /api/users/getAll should return 200', async () => {
    // Arrange
    mockQuery.mockResolvedValueOnce({ rows: [] });

    // Act
    const response = await request(app).get('/api/users/getAll');

    // Assert
    expect(response.status).toBe(200);
  });

  it('GET /api/users/getAll should return JSON content type', async () => {
    // Arrange
    mockQuery.mockResolvedValueOnce({ rows: [] });

    // Act
    const response = await request(app).get('/api/users/getAll');

    // Assert
    expect(response.headers['content-type']).toMatch(/json/);
  });

  it('GET /api/users/getAll should return an array', async () => {
    // Arrange
    mockQuery.mockResolvedValueOnce({ rows: [] });

    // Act
    const response = await request(app).get('/api/users/getAll');

    // Assert
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/users with empty body should return 201', async () => {
    // Arrange
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 1, name: 'Anonymous', email: null }],
    });

    // Act
    const response = await request(app)
      .post('/api/users')
      .send({});

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

});