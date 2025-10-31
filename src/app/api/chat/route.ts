import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAIClient } from '@/lib/ai/openai';

const schema = z.object({
  message: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = schema.parse(body);

    const openai = getOpenAIClient();

    const completion = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'Eres GlobalGoods Up, un asistente experto en automatización empresarial. Ofrece respuestas breves, claras y sugiere agendar una demo cuando sea pertinente. Si el usuario solicita una reunión, responde indicando que enviaremos una invitación mediante Google Calendar.',
        },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.output_text ?? 'Estoy listo para ayudarte con automatización e IA.';

    // TODO: Integrate Google Calendar API to create events automatically using a service account.

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('[chat] error', error);
    return NextResponse.json({ error: 'Unable to process message' }, { status: 500 });
  }
}
