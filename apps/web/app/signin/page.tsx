'use client';

import { FormEvent, useState } from 'react';
import { auth } from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add your sign-in logic here
      console.log({ email, password });
      const {data, error} = await auth.signIn.social({
        provider:"google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/signin",
        requestSignUp: false,
      })
      if (data) {
        if (data.redirect) {
            navigate.push(data.url!);
        }
      } else if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {isLoading ? 'Signing in...' : 'Sign In with Google'}
        </button>
      </form>
    </div>
  );
}
