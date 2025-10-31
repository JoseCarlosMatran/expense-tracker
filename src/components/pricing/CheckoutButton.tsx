'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

type CheckoutButtonProps = {
  plan: 'launch' | 'scale' | 'enterprise';
};

export const CheckoutButton = ({ plan }: CheckoutButtonProps) => {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId, publishableKey, checkoutUrl } = await response.json();

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      if (!sessionId || !publishableKey) {
        throw new Error('Missing Stripe configuration');
      }

      const stripe = await loadStripe(publishableKey);

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error(error);
      alert('No pudimos iniciar el checkout. Verifica tu configuración de Stripe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className="w-full rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('pricing.cta')}
        </span>
      ) : (
        t('pricing.cta')
      )}
    </button>
  );
};

export default CheckoutButton;
