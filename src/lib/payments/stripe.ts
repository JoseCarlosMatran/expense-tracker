import Stripe from 'stripe';

export const getStripeServerClient = () => {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }

  return new Stripe(key, {
    apiVersion: '2024-09-30.acacia',
    typescript: true,
  });
};

export type StripeClient = ReturnType<typeof getStripeServerClient>;
