import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .single();

  if (!data) {
    return {};
  }

  return {
    title: `${data.title} | GlobalGoods Up`,
    description: data.excerpt,
    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: data.cover_image ? [{ url: data.cover_image }] : undefined,
    },
  };
}

async function getPost(slug: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  return data;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-wide text-ggup-secondary">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString(post.language === 'es' ? 'es-ES' : 'en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })
            : 'Draft'}
        </p>
        <h1 className="text-4xl font-semibold text-white">{post.title}</h1>
        <p className="text-lg text-slate-300">{post.excerpt}</p>
      </header>
      <div className="prose prose-invert max-w-none">
        {post.content?.split('\n').map((paragraph: string) => (
          <p key={paragraph.slice(0, 20)}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
