'use client';

import { useMemo } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import type { Session } from '@supabase/supabase-js';
import { useI18n } from '@/contexts/I18nContext';
import type { Database } from '@/types/supabase';

export type AdminData = {
  session: Session | null;
  users: Database['public']['Tables']['profiles']['Row'][];
  services: Database['public']['Tables']['services']['Row'][];
  plans: Database['public']['Tables']['subscriptions']['Row'][];
  posts: Array<Pick<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'title' | 'published_at' | 'created_at'>>;
};

type AdminViewProps = {
  data: AdminData;
};

const AdminView = ({ data }: AdminViewProps) => {
  const { t } = useI18n();
  const session = useSession() ?? data.session;
  const supabase = useSupabaseClient<Database>();

  const isAuthorized = useMemo(() => data.users.some(user => user.id === session?.user.id && user.role === 'admin'), [data.users, session?.user.id]);

  const handleSignIn = async () => {
    const email = prompt('Introduce tu correo corporativo');
    if (!email) return;
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    alert('Revisa tu bandeja de entrada para continuar.');
  };

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold text-white">{t('admin.title')}</h1>
        <p className="text-lg text-slate-300">{t('admin.subtitle')}</p>
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

  if (!isAuthorized) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold text-white">Acceso restringido</h1>
        <p className="text-lg text-slate-300">Solicita al equipo de GlobalGoods Up que habilite tu perfil como administrador.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-16">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">{t('admin.title')}</h1>
        <p className="text-lg text-slate-300">{t('admin.subtitle')}</p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-white">{t('admin.users')}</h2>
          <ul className="mt-4 space-y-3">
            {data.users.map(user => (
              <li key={user.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                <p className="font-semibold">{user.full_name ?? user.email}</p>
                <p className="text-xs text-slate-400">{user.role} • {new Date(user.created_at).toLocaleDateString('es-ES')}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-white">{t('admin.services')}</h2>
          <ul className="mt-4 space-y-3">
            {data.services.map(service => (
              <li key={service.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                <p className="font-semibold">{service.name}</p>
                <p className="text-xs text-slate-400">{service.status} • {new Date(service.created_at).toLocaleDateString('es-ES')}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-white">{t('admin.pricing')}</h2>
          <ul className="mt-4 space-y-3">
            {data.plans.map(plan => (
              <li key={plan.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                <p className="font-semibold">{plan.plan}</p>
                <p className="text-xs text-slate-400">{plan.status} • {new Date(plan.created_at).toLocaleDateString('es-ES')}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-white">{t('admin.blog')}</h2>
          <ul className="mt-4 space-y-3">
            {data.posts.map(post => (
              <li key={post.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
                <p className="font-semibold">{post.title}</p>
                <p className="text-xs text-slate-400">
                  {post.published_at ? 'Publicado' : 'Borrador'} • {new Date(post.created_at).toLocaleDateString('es-ES')}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminView;
