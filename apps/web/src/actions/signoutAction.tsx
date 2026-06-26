'use server';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function signOutAction() {
  await auth.signOut();
  redirect('/signin');
}