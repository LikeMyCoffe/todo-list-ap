"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to track loading while checking authentication/session
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  // Determine if the current page is the login page
  const isAuthPage = pathname === '/login';

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session check:", session ? "Active session" : "No session");

        // Redirect logic based on authentication state and current page
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

    // Listen for authentication state changes (sign in/out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session ? "Has session" : "No session");

        if (event === 'SIGNED_IN') {
          // Redirect to home if user signs in on login page
          console.log("User signed in, refreshing...");
          if (isAuthPage) router.push('/');
        }

        if (event === 'SIGNED_OUT') {
          // Redirect to login if user signs out
          console.log("User signed out");
          if (!isAuthPage) router.push('/login');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, [isAuthPage, router, supabase]);

  // Show loading spinner while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Render children if authenticated or on login page
  return <>{children}</>;
}
