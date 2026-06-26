'use server';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function signInSocialAction() {
  const { data, error } = await auth.signIn.social({
    provider: "google",
    requestSignUp: false,
    callbackURL: "/",
    errorCallbackURL: "/signin",
  });
  if (error) {
    console.error('Social sign-in error:', error);
    // redirect('/signin?error=Invalid email or password. Please try again.');
  }
  redirect(data?.url || '/signin?error=Invalid email or password. Please try again.');
}