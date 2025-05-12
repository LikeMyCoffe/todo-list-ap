'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState('sign-in'); // 'sign-in' or 'sign-up'
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      } else {
        alert('Check your email for the confirmation link!');
        setView('sign-in');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting sign in with:", email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
      } else {
        console.log("Sign in successful:", data.session ? "Has session" : "No session");
        router.push('/');
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Todo List App</h1>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            {view === 'sign-in' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {view === 'sign-in' ? (
            <>
              <div>
                <button
                  type="submit"
                  onClick={handleSignIn}
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={() => setView('sign-up')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {"Don't have an account? Sign up"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <button
                  type="submit"
                  onClick={handleSignUp}
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Signing up...' : 'Sign up'}
                </button>
              </div>
              <div className="text-sm text-center">
                <button
                  type="button"
                  onClick={() => setView('sign-in')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
