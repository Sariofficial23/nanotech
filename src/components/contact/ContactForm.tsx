import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { hasAnyContact } from '../../config/site';
import { clearContactIntent, onContactIntent, onProductContact } from '../../lib/contactIntent';
import { useI18n } from '../../i18n/context';
import { INTERESTS, leadSchema, type Lead, type LeadInput, type ValidationCode } from '../../lib/leadSchema';
import { formatUzPhone, PHONE_PREFIX } from '../../lib/phone';
import { LeadSubmitError, submitLead, type LeadErrorReason } from '../../lib/submitLead';
import { Button } from '../ui/Button';
import Field from './Field';
import { inputClasses } from './inputClasses';

type Status = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; reason: LeadErrorReason };

const EMPTY: LeadInput = { name: '', phone: '', interest: '' as LeadInput['interest'], comment: '', website: '' };

export default function ContactForm() {
  const { t, lang } = useI18n();
  const f = t.form;
  // Zod messages are codes (see leadSchema); show them in the current language.
  const msg = (code?: string) => (code ? (f.validation[code as ValidationCode] ?? code) : undefined);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput, unknown, Lead>({
    resolver: zodResolver(leadSchema),
    defaultValues: EMPTY,
    mode: 'onTouched',
  });

  useEffect(
    () =>
      onContactIntent((interest) => {
        setValue('interest', interest, { shouldValidate: true });
        setStatus((s) => (s.kind === 'success' ? s : { kind: 'idle' }));
      }),
    [setValue],
  );

  useEffect(() => onProductContact((name) => {
    setValue('comment', name, { shouldValidate: true });
  }), [setValue]);

  const onSubmit = async (lead: Lead) => {
    setStatus({ kind: 'idle' });
    try {
      await submitLead(lead, lang);
      setStatus({ kind: 'success' });
      clearContactIntent();
      reset(EMPTY);
    } catch (err) {
      setStatus({ kind: 'error', reason: err instanceof LeadSubmitError ? err.reason : 'server' });
    }
  };

  const describedBy = (name: keyof LeadInput, hint = false) =>
    errors[name] ? `${name}-error` : hint ? `${name}-hint` : undefined;

  return (
    <div className="relative rounded-[1.75rem] border border-white/10 bg-ink-soft p-6 text-white shadow-[0_40px_100px_-40px_rgb(255_196_0/0.25)] sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status.kind === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            role="status"
            aria-live="polite"
            className="flex min-h-[26rem] flex-col items-center justify-center text-center"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-brand text-ink">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-semibold">{f.successTitle}</h3>
            <p className="mt-3 max-w-sm leading-relaxed text-white/65">
              {f.successText}
            </p>
            <Button variant="outline-light" className="mt-8" onClick={() => setStatus({ kind: 'idle' })}>
              {f.again}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            aria-labelledby="contact-form-title"
            className="space-y-5"
          >
            <div>
              <h3 id="contact-form-title" className="font-display text-2xl font-semibold">
                {f.title}
              </h3>
              <p className="mt-1.5 text-white/55">{f.subtitle}</p>
            </div>

            <Field id="name" label={f.name} error={msg(errors.name?.message)}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder={f.namePlaceholder}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy('name')}
                className={inputClasses(Boolean(errors.name)) + ' h-12'}
                {...register('name')}
              />
            </Field>

            <Field id="phone" label={f.phone} error={msg(errors.phone?.message)} hint={f.phoneHint}>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+998 __ ___ __ __"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy('phone', true)}
                className={inputClasses(Boolean(errors.phone)) + ' h-12 tabular-nums'}
                {...register('phone', {
                  onChange: (e: ChangeEvent<HTMLInputElement>) => setValue('phone', formatUzPhone(e.target.value)),
                })}
                onFocus={() => {
                  if (!getValues('phone')) setValue('phone', PHONE_PREFIX);
                }}
              />
            </Field>

            <Field id="interest" label={f.interest} error={msg(errors.interest?.message)}>
              <div className="relative">
                <select
                  id="interest"
                  aria-invalid={Boolean(errors.interest)}
                  aria-describedby={describedBy('interest')}
                  className={inputClasses(Boolean(errors.interest)) + ' h-12 appearance-none pr-11'}
                  {...register('interest')}
                >
                  <option value="" disabled className="text-ink">
                    {f.choose}
                  </option>
                  {INTERESTS.map((i) => (
                    <option key={i.value} value={i.value} className="text-ink">
                      {f.interests[i.value]}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-white/50"
                />
              </div>
            </Field>

            <Field id="comment" label={f.comment} optional error={msg(errors.comment?.message)}>
              <textarea
                id="comment"
                rows={4}
                placeholder={f.commentPlaceholder}
                aria-invalid={Boolean(errors.comment)}
                aria-describedby={describedBy('comment')}
                className={inputClasses(Boolean(errors.comment)) + ' resize-y py-3'}
                {...register('comment')}
              />
            </Field>

            {/* Honeypot — hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="website">Veb-sayt</label>
              <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
            </div>

            <AnimatePresence>
              {status.kind === 'error' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div role="alert" className="flex gap-3 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <p>
                      {f.errors[status.reason]}
                      {hasAnyContact && f.orContacts}
                      {import.meta.env.DEV && status.reason === 'not-configured' && (
                        <span className="mt-1 block text-xs opacity-80">
                          Dev: /api/lead javob bermadi — README’dagi “Arizalarni qabul qilishni ulash” bo‘limiga qarang.
                        </span>
                      )}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              icon={isSubmitting ? undefined : <ArrowRight className="h-4 w-4" />}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {f.sending}
                </span>
              ) : (
                f.submit
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
