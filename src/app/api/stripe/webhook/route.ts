import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeServerClient } from '@/lib/payments/stripe';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route';

export const runtime = 'edge';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    const stripe = getStripeServerClient();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('[stripe] invalid webhook signature', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createSupabaseRouteHandlerClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const plan = session.metadata?.plan ?? 'launch';

    if (customerEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();

      if (profile) {
        await supabase.from('subscriptions').insert({
          profile_id: profile.id,
          plan: plan as 'launch' | 'scale' | 'enterprise',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
