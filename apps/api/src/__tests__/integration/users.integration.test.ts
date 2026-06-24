// apps/api/src/__tests__/integration/users.integration.test.ts

import request from 'supertest';
import app from '../../app.js';

// Mock the DB pool — no real Neon connection in CI
jest.mock('../../db.js', () => ({
  default: {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    connect: jest.fn(),
    end: jest.fn(),
  },
}));

describe('Integration — Users API', () => {

  it('GET /api/users/getAll should return 200', async () => {
    // Arrange + Act
    const response = await request(app).get('/api/users/getAll');

    // Assert
    expect(response.status).toBe(200);
  });

  it('GET /api/users/getAll should return JSON content type', async () => {
    // Arrange + Act
    const response = await request(app).get('/api/users/getAll');

    // Assert
    expect(response.headers['content-type']).toMatch(/json/);
  });

  it('GET /api/users/getAll should return an array', async () => {
    // Arrange + Act
    const response = await request(app).get('/api/users/getAll');

    // Assert
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('POST /api/users with empty body should return 201', async () => {
    // Arrange
    const mockPool = await import('../../db.js');
    (mockPool.default.query as jest.Mock).mockResolvedValueOnce({
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