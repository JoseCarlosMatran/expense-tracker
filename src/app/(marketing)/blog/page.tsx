import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import BlogList from './ui/BlogList';

export const dynamic = 'force-dynamic';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, published_at, language')
      .order('published_at', { ascending: false })
      .limit(12);

    if (error) {
      console.error('[blog] error fetching posts', error);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error('[blog] unexpected error', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return <BlogList posts={posts} />;
}
