// apps/api/src/v1/lib/pusherClient.ts
//
// Pusher server SDK singleton.
// Credentials are read exclusively from environment variables — never hardcoded.
// Pattern mirrors b2Client.ts in the same directory.

import Pusher from 'pusher';

const {
  PUSHER_APP_ID,
  PUSHER_KEY,
  PUSHER_SECRET,
  PUSHER_CLUSTER,
} = process.env;

if (!PUSHER_APP_ID || !PUSHER_KEY || !PUSHER_SECRET || !PUSHER_CLUSTER) {
  throw new Error(
    'Missing one or more required Pusher environment variables (PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER).'
  );
}

const pusherClient = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
  useTLS: true,
});

export default pusherClient;
