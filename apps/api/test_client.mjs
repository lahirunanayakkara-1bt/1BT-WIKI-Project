import { createAuthClient } from '@neondatabase/auth';
const authClient = createAuthClient('http://test');
console.log('CLIENT:', authClient);
