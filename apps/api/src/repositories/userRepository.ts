import pool from '../db/index.js';

const getAll = async () => {
  const { rows } = await pool.query('SELECT id, name, email FROM users ORDER BY created_at DESC');
  return rows;
};

const create = async (data: { name?: string; email?: string }) => {
  const { rows } = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email',
    [data.name ?? 'Anonymous', data.email ?? null]
  );
  return rows[0];
};

export default { getAll, create };