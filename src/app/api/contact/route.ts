import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const supabase = createSupabaseRouteHandlerClient();

    const { error } = await supabase.from('contact_requests').insert({
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
    });

    if (error) {
      console.error('[contact] failed to insert', error);
      return NextResponse.json({ error: 'Failed to save contact request' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] error', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
