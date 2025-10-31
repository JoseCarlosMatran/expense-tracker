'use client';

import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';
import type { Database } from '@/types/supabase';

type BlogPost = Pick<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'title' | 'slug' | 'excerpt' | 'published_at' | 'language'>;

type BlogListProps = {
  posts: BlogPost[];
};

const BlogList = ({ posts }: BlogListProps) => {
  const { t, language } = useI18n();

  const filteredPosts = posts.filter(post => post.language === language);
  const displayPosts = filteredPosts.length ? filteredPosts : posts;

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 py-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold text-white">{t('blog.title')}</h1>
        <p className="text-lg text-slate-300">{t('blog.subtitle')}</p>
      </div>
      {displayPosts.length === 0 ? (
        <p className="text-center text-sm text-slate-400">{t('blog.empty')}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {displayPosts.map(post => (
            <article key={post.id} className="glass-panel flex flex-col justify-between p-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-wide text-ggup-secondary">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}
                </p>
                <h2 className="text-2xl font-semibold text-white">{post.title}</h2>
                <p className="text-sm text-slate-300">{post.excerpt}</p>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ggup-secondary transition hover:text-white"
              >
                {t('blog.cta')}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
