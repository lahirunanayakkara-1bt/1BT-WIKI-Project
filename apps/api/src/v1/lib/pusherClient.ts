// apps/api/src/v1/lib/pusherClient.ts
//
// Pusher server SDK singleton.
// Credentials are read exclusively from environment variables — never hardcoded.
// Pattern mirrors b2Client.ts in the same directory.

import Pusher from 'pusher';

const pusherClient = new Pusher({
  appId: process.env.PUSHER_APP_ID ?? '',
  key: process.env.PUSHER_KEY ?? '',
  secret: process.env.PUSHER_SECRET ?? '',
  cluster: process.env.PUSHER_CLUSTER ?? '',
  useTLS: true,
});

export default pusherClient;
