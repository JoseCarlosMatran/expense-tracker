import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminView, { type AdminData } from './ui/AdminView';

export const dynamic = 'force-dynamic';

async function fetchAdminData(): Promise<AdminData> {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      session: null,
      users: [],
      services: [],
      plans: [],
      posts: [],
    };
  }

  const profile = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const isAdmin = profile.data?.role === 'admin';

  if (!isAdmin) {
    return {
      session,
      users: [],
      services: [],
      plans: [],
      posts: [],
    };
  }

  const [usersRes, servicesRes, plansRes, postsRes] = await Promise.all([
    supabase.from('profiles').select('id, email, full_name, role, created_at').order('created_at', { ascending: false }).limit(20),
    supabase.from('services').select('id, name, status, created_at'),
    supabase.from('subscriptions').select('id, plan, status, created_at'),
    supabase.from('blog_posts').select('id, title, published_at, created_at').order('created_at', { ascending: false }).limit(12),
  ]);

  return {
    session,
    users: usersRes.data ?? [],
    services: servicesRes.data ?? [],
    plans: plansRes.data ?? [],
    posts: postsRes.data ?? [],
  };
}

export default async function AdminPage() {
  const data = await fetchAdminData();

  return <AdminView data={data} />;
}
