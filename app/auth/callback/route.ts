import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Handles the OAuth callback GET request.
 * Exchanges the authorization code for a session using Supabase Auth,
 * then redirects the user to the app's origin.
 * @param request The incoming HTTP request containing the OAuth code.
 * @returns A redirect response to the app's origin.
 */
export async function GET(request: Request) {
  // Parse the request URL and extract the 'code' query parameter
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Get the cookie store and initialize the Supabase client
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      // Exchange the authorization code for a Supabase session
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      // Log any errors that occur during the exchange
      console.error('Error exchanging code for session:', error);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
}
