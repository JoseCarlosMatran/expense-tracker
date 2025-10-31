import { NextResponse } from 'next/server';
import { z } from 'zod';
import slugify from 'slugify';
import { getOpenAIClient } from '@/lib/ai/openai';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route';

const schema = z.object({
  topic: z.string().optional(),
  language: z.enum(['es', 'en']).default('es'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { topic, language } = schema.parse(body);

    const openai = getOpenAIClient();
    const supabase = createSupabaseRouteHandlerClient();

    const prompt = topic
      ? `Escribe un artículo de blog sobre ${topic} aplicado a automatización empresarial con IA generativa.`
      : 'Genera un artículo de blog sobre los beneficios de implementar automatización y chatbots con IA generativa en empresas globales.';

    const completion = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: `Eres un experto en IA y automatización de GlobalGoods Up. Genera un artículo estructurado (título, resumen, 4 secciones y conclusión) en idioma ${language === 'es' ? 'español' : 'inglés'} y usando un tono profesional accesible.`,
        },
        { role: 'user', content: prompt },
      ],
    });

    const output = completion.output_text ?? '';
    const [titleLine, ...rest] = output.split('\n').filter(Boolean);
    const title = titleLine?.replace(/^#+\s*/, '') || 'Automatización con IA generativa';
    const excerpt = rest.slice(0, 3).join(' ').slice(0, 260);
    const content = rest.join('\n');

    const slug = slugify(`${title}-${Date.now()}`, { lower: true, strict: true });

    const { error } = await supabase.from('blog_posts').insert({
      title,
      slug,
      excerpt,
      content,
      language,
      published_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[blog-generate] failed to save', error);
      return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
    }

    return NextResponse.json({ title, slug });
  } catch (error) {
    console.error('[blog-generate] error', error);
    return NextResponse.json({ error: 'Unable to generate article' }, { status: 500 });
  }
}
