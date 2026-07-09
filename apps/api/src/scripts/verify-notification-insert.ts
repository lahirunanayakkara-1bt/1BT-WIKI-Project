import pool from '../db/index.js';
import notificationService from '../services/notificationService.js';
import { randomUUID } from 'crypto';

async function run() {
  try {
    // 1. Get a real user ID
    const userRes = await pool.query('SELECT id FROM neon_auth.user LIMIT 1');
    if (userRes.rowCount === 0) {
      throw new Error('No users found in neon_auth.user table to use as a recipient_id.');
    }
    const recipientId = userRes.rows[0].id;
    console.log(`Using real recipient_id: ${recipientId}`);

    // 2. Call send()
    const fakeReferenceId = randomUUID();
    console.log('Sending notification...');
    const result = await notificationService.send({
      recipientId: recipientId,
      notificationTitle: 'Test Live Insert',
      notificationReferenceType: 'article',
      referenceId: fakeReferenceId,
      notificationType: 'info',
      message: 'This is a live test insert'
    });

    console.log('Send resolved.');

    // 3. Query the DB directly to confirm
    const checkRes = await pool.query(
      'SELECT * FROM notifications WHERE recipient_id = $1 ORDER BY created_at DESC LIMIT 1',
      [recipientId]
    );

    if (checkRes.rowCount === 0) {
      throw new Error('Notification was not found in the database after send() resolved!');
    }

    const insertedRow = checkRes.rows[0];
    console.log('\n--- REAL DB ROW ---');
    console.log(insertedRow);
    console.log('-------------------\n');

    // 4. Clean up
    console.log(`Deleting row with id: ${insertedRow.id}`);
    await pool.query('DELETE FROM notifications WHERE id = $1', [insertedRow.id]);
    console.log('Deleted successfully.');

  } catch (err) {
    console.error('\n❌ SCRIPT FAILED ❌');
    console.error(err);
  } finally {
    // Close pool so script exits
    await pool.end();
  }
}

run();
