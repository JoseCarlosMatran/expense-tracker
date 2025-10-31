import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripeServerClient } from '@/lib/payments/stripe';

const schema = z.object({
  plan: z.enum(['launch', 'scale', 'enterprise']),
});

const PLAN_CONFIG = {
  launch: {
    name: 'Launch Plan',
    amount: 49900,
    description: 'Servicios esenciales de automatización con IA generativa.',
  },
  scale: {
    name: 'Scale Plan',
    amount: 149900,
    description: 'Automatizaciones avanzadas y dashboards generativos.',
  },
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan } = schema.parse(body);

    if (plan === 'enterprise') {
      return NextResponse.json({ checkoutUrl: '/contacto' }, { status: 200 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      return NextResponse.json({ error: 'Stripe publishable key missing' }, { status: 500 });
    }

    const config = PLAN_CONFIG[plan];
    const stripe = getStripeServerClient();

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${siteUrl}/panel?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/precios`,
      metadata: { plan },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            recurring: { interval: 'month' },
            unit_amount: config.amount,
            product_data: {
              name: config.name,
              description: config.description,
            },
          },
        },
      ],
    });

    return NextResponse.json({ sessionId: session.id, publishableKey });
  } catch (error) {
    console.error('[stripe] checkout error', error);
    return NextResponse.json({ error: 'Unable to create checkout session' }, { status: 500 });
  }
}
