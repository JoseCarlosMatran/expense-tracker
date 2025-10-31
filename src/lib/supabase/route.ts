import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export const createSupabaseRouteHandlerClient = () =>
  createRouteHandlerClient<Database>({
    cookies,
  });

export type SupabaseRouteHandlerClient = ReturnType<typeof createSupabaseRouteHandlerClient>;
