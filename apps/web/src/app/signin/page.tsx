'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInSocialAction } from '@/actions/signinAction';
import { authClient } from '@/lib/auth/client';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try{
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        errorCallbackURL: '/signin',
      })

      router.push('/');
    }catch(e){
      console.error('Error during social sign-in:', e);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
          onClick={async () => {
            setIsLoading(true);
            await handleClick();
            setIsLoading(false);
          }}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {isLoading ? 'Signing in...' : 'Sign In with Google'}
        </button>
    </div>
  );
}
