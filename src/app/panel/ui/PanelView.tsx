'use client';

import { useMemo } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Session } from '@supabase/supabase-js';
import { useI18n } from '@/contexts/I18nContext';
import type { Database } from '@/types/supabase';

export type PanelData = {
  session: Session | null;
  services: Pick<Database['public']['Tables']['services']['Row'], 'id' | 'name' | 'description'>[];
  invoices: Database['public']['Tables']['invoices']['Row'][];
  tickets: Database['public']['Tables']['tickets']['Row'][];
  messages: Database['public']['Tables']['messages']['Row'][];
};

type PanelViewProps = {
  data: PanelData;
};

const PanelView = ({ data }: PanelViewProps) => {
  const { t } = useI18n();
  const session = useSession() ?? data.session;
  const supabase = useSupabaseClient<Database>();

  const handleSignIn = async () => {
    const email = prompt('Introduce tu correo para recibir un enlace mágico');
    if (!email) return;
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/panel` } });
    alert('Revisa tu correo para continuar.');
  };

  const stats = useMemo(
    () => [
      { label: t('dashboard.services'), value: data.services.length.toString() },
      { label: t('dashboard.invoices'), value: data.invoices.length.toString() },
      { label: t('dashboard.tickets'), value: data.tickets.length.toString() },
    ],
    [data.services.length, data.invoices.length, data.tickets.length, t]
  );

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold text-white">{t('dashboard.title')}</h1>
        <p className="text-lg text-slate-300">{t('dashboard.subtitle')}</p>
        <button
          type="button"
          onClick={handleSignIn}
          className="ggup-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg"
        >
          {t('navigation.login')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">{t('dashboard.title')}</h1>
        <p className="text-lg text-slate-300">{t('dashboard.subtitle')}</p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {stats.map(stat => (
          <div key={stat.label} className="glass-panel p-6">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-white">{t('dashboard.services')}</h2>
          <ul className="mt-4 space-y-3">
            {data.services.length === 0 ? (
              <li className="text-sm text-slate-400">Aún no tienes servicios contratados.</li>
            ) : (
              data.services.map(service => (
                <li key={service.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-sm text-white">
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-xs text-slate-300">{service.description}</p>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-white">{t('dashboard.messages')}</h2>
          <ul className="mt-4 space-y-3">
            {data.messages.length === 0 ? (
              <li className="text-sm text-slate-400">Sin mensajes aún.</li>
            ) : (
              data.messages.map(message => (
                <li key={message.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                  <p className="text-xs uppercase tracking-wide text-ggup-secondary">{message.role}</p>
                  <p>{message.content}</p>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-white">{t('dashboard.invoices')}</h2>
          <ul className="mt-4 space-y-3">
            {data.invoices.length === 0 ? (
              <li className="text-sm text-slate-400">No hay facturas disponibles.</li>
            ) : (
              data.invoices.map(invoice => (
                <li key={invoice.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {invoice.amount / 100} {invoice.currency.toUpperCase()}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-slate-400">{invoice.status}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(invoice.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  {invoice.invoice_url ? (
                    <a href={invoice.invoice_url} className="text-xs text-ggup-secondary underline" target="_blank" rel="noreferrer">
                      Descargar
                    </a>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-white">{t('dashboard.tickets')}</h2>
          <ul className="mt-4 space-y-3">
            {data.tickets.length === 0 ? (
              <li className="text-sm text-slate-400">No hay tickets abiertos.</li>
            ) : (
              data.tickets.map(ticket => (
                <li key={ticket.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                  <p className="font-semibold">{ticket.subject}</p>
                  <p className="text-xs text-slate-400">
                    {ticket.status} • {ticket.priority}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PanelView;
