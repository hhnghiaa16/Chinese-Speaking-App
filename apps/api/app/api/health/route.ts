import { isSupabaseConfigured } from '@/lib/supabase';
import { ok, optionsResponse } from '@/lib/http';

export function GET() {
  return ok({
    status: 'ok',
    service: 'lanapp-api',
    runtime: 'nextjs',
    supabaseConfigured: isSupabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
}

export function OPTIONS() {
  return optionsResponse();
}
