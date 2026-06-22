import { NextRequest } from 'next/server';

import { supabaseAdmin } from './supabase';

/**
 * Parses the Authorization header from the request and verifies it using Supabase Admin.
 * Returns the user_id if valid, or null if invalid/missing.
 */
export async function verifyAuthToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      console.warn('[auth] Failed to verify token:', error?.message);
      return null;
    }

    return user.id;
  } catch (err) {
    console.error('[auth] Error verifying token:', err);
    return null;
  }
}
