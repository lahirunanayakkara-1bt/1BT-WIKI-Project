'use server';
import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signInSocialAction() {
  const { error } = await auth.signIn.social({
    provider: "google",
    requestSignUp: false,
    callbackURL: "/",
    newUserCallbackURL: "/",
    errorCallbackURL: "/signin",
  });
  if (error) {
    console.error('Social sign-in error:', error);
    // redirect('/signin?error=Invalid email or password. Please try again.');
  }
  redirect('/');
}