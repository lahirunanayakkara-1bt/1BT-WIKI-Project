import { Pool } from 'pg';
import 'dotenv/config';

if (!process.env.VERCEL_DATABASE_URL) {
  throw new Error('VERCEL_DATABASE_URL environment variable is not set');
}

export const pool = new Pool({
  connectionString: process.env.VERCEL_DATABASE_URL,
  max: 10,                    // max concurrent connections
  idleTimeoutMillis: 30000,   // close idle connections after 30s
  connectionTimeoutMillis: 5000,
  ssl: { rejectUnauthorized: false }, // required for Neon
});

// Verify connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to Neon PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
  process.exit(1);
});

export default pool;