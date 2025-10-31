'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  message: z.string().min(10),
});

type ContactValues = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const { t } = useI18n();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      setStatus('idle');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      setStatus('success');
      reset();
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400">{t('contact.form.name')}</label>
          <input
            {...register('name')}
            className="mt-2 w-full rounded-2xl border border-slate-800/60 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-ggup-secondary focus:outline-none"
            placeholder="María López"
          />
          {errors.name && <p className="mt-1 text-xs text-ggup-danger">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400">{t('contact.form.email')}</label>
          <input
            {...register('email')}
            type="email"
            className="mt-2 w-full rounded-2xl border border-slate-800/60 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-ggup-secondary focus:outline-none"
            placeholder="tu@empresa.com"
          />
          {errors.email && <p className="mt-1 text-xs text-ggup-danger">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-400">{t('contact.form.company')}</label>
          <input
            {...register('company')}
            className="mt-2 w-full rounded-2xl border border-slate-800/60 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-ggup-secondary focus:outline-none"
            placeholder="Global Inc."
          />
          {errors.company && <p className="mt-1 text-xs text-ggup-danger">{errors.company.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-wide text-slate-400">{t('contact.form.message')}</label>
          <textarea
            {...register('message')}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-slate-800/60 bg-slate-950/60 px-4 py-3 text-sm text-white focus:border-ggup-secondary focus:outline-none"
            placeholder="Cuéntanos sobre tu proyecto y objetivos."
          />
          {errors.message && <p className="mt-1 text-xs text-ggup-danger">{errors.message.message}</p>}
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {t('contact.form.submit')}
      </button>
      {status === 'success' && <p className="text-sm text-ggup-success">{t('contact.form.success')}</p>}
      {status === 'error' && <p className="text-sm text-ggup-danger">{t('contact.form.error')}</p>}
    </form>
  );
};

export default ContactForm;
