'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: 'http://localhost:3000/signin/callback',
        errorCallbackURL: 'http://localhost:3000/signin',
        disableRedirect: false,
      });

      if (!error) {
        router.push('/');
      } else {
        console.error('Google sign-in error:', error);
      }
    } catch (e) {
      console.error('Error during social sign-in:', e);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-brand-bg)] px-4 py-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-[32px] bg-[var(--color-brand-surface)] shadow-[0_20px_70px_rgba(0,0,0,0.08)]">
        <div className="grid min-h-[560px] grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative hidden lg:flex items-center justify-center bg-[var(--color-brand-dark)]">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="/banner-video.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-6 px-10 text-center">
              <div className="relative h-24 w-24">
                <Image
                  src="/image.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="max-w-xs text-sm font-semibold uppercase tracking-[0.24em] text-white/80">
                Knowledge hub
              </p>
              <h2 className="text-3xl font-semibold text-white">
                Welcome to 1BT WIKI
              </h2>
              <p className="max-w-md text-sm leading-6 text-white/80">
                Browse internal guides, articles, and team knowledge once you sign in.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-8 py-12 sm:px-12 sm:py-16">
            <div className="max-w-md">
              <div className="mb-8 flex flex-col gap-2">
                <div className="relative w-14 h-8">
                  <Image
                    src="/image.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-text-secondary)]">
                  Welcome back
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-brand-text-primary)]">
                Sign in to continue
              </h1>
              <p className="mt-3 text-base leading-7 text-[var(--color-brand-text-secondary)]">
                Access your internal knowledge base and team resources.
              </p>

              <button
                type="button"
                onClick={async () => {
                  setIsLoading(true);
                  await handleClick();
                  setIsLoading(false);
                }}
                disabled={isLoading}
                className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-[var(--color-brand-red)] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-brand-red-hover)] disabled:cursor-not-allowed disabled:bg-[#d34d4d]"
              >
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}