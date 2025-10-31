import { createServerSupabaseClient } from '@/lib/supabase/server';
import PanelView, { type PanelData } from './ui/PanelView';

export const dynamic = 'force-dynamic';

async function fetchPanelData(): Promise<PanelData> {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      session: null,
      services: [],
      invoices: [],
      tickets: [],
      messages: [],
    };
  }

  const [servicesRes, invoicesRes, ticketsRes, messagesRes] = await Promise.all([
    supabase.from('services').select('id, name, description').limit(6),
    supabase
      .from('invoices')
      .select('id, amount, currency, status, created_at, invoice_url')
      .eq('profile_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('tickets')
      .select('id, subject, status, priority, created_at')
      .eq('profile_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('messages')
      .select('id, role, content, created_at')
      .eq('profile_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return {
    session,
    services: servicesRes.data ?? [],
    invoices: invoicesRes.data ?? [],
    tickets: ticketsRes.data ?? [],
    messages: messagesRes.data ?? [],
  };
}

export default async function PanelPage() {
  const data = await fetchPanelData();

  return <PanelView data={data} />;
}
