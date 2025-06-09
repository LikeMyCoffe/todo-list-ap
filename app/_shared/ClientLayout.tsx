"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabaseClient] = useState(() => createClientComponentClient());
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for active session first
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const isAuthPage = pathname === '/login';
        if (session?.user && isAuthPage) {
          router.push('/');
        } else if (!session?.user && !isAuthPage) {
          router.push('/login');
        }
      } catch {
        // error intentionally ignored
      }
    };
    checkSession();
    // Set up auth state change listener
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event) => {
        const isAuthPage = pathname === '/login';
        if (event === 'SIGNED_IN') {
          if (isAuthPage) router.push('/');
        }
        if (event === 'SIGNED_OUT') {
          if (!isAuthPage) router.push('/login');
        }
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router, supabaseClient]);

  return (
    <div>
      {/* Your layout components, e.g., header, footer, etc. */}
      {children}
    </div>
  );
}
