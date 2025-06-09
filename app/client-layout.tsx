"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const isAuthPage = pathname === '/login';

  useEffect(() => {
    // Check for active session first
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session check:", session ? "Active session" : "No session");

        // Only redirect if we're sure about the authentication state
        if (session?.user && isAuthPage) {
          console.log("Redirecting to home - user is logged in");
          router.push('/');
        } else if (!session?.user && !isAuthPage) {
          console.log("Redirecting to login - no user found");
          router.push('/login');
        }

        setLoading(false);
      } catch (error) {
        console.error("Session check error:", error);
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session ? "Has session" : "No session");

        if (event === 'SIGNED_IN') {
          console.log("User signed in, refreshing...");
          if (isAuthPage) router.push('/');
        }

        if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          if (!isAuthPage) router.push('/login');
        }
      }
    );

    return () => {
      console.log("Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [isAuthPage, router, supabase]);

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
}
