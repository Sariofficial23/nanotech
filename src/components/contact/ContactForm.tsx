import { useEffect, useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { hasAnyContact } from '../../config/site';
import { clearContactIntent, onContactIntent } from '../../lib/contactIntent';
import { INTERESTS, leadSchema, type Lead, type LeadInput } from '../../lib/leadSchema';
import { formatUzPhone, PHONE_PREFIX } from '../../lib/phone';
import { LeadSubmitError, submitLead, type LeadErrorReason } from '../../lib/submitLead';
import { Button } from '../ui/Button';
import Field from './Field';
import { inputClasses } from './inputClasses';

type Status = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; reason: LeadErrorReason };

const EMPTY: LeadInput = { name: '', phone: '', interest: '' as LeadInput['interest'], comment: '', website: '' };

const ERROR_TEXT: Record<LeadErrorReason, string> = {
  network: 'So‘rov yuborilmadi: internet aloqasini tekshirib, qayta urinib ko‘ring.',
  invalid: 'So‘rov yuborilmadi: kiritilgan ma’lumotlarni tekshirib, qayta yuboring.',
  'not-configured': 'So‘rovni hozircha yuborib bo‘lmadi. Iltimos, keyinroq qayta urinib ko‘ring.',
  server: 'So‘rovni yuborishda xatolik yuz berdi. Iltimos, birozdan so‘ng qayta urinib ko‘ring.',
};

export default function ContactForm() {
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

  const onSubmit = async (lead: Lead) => {
    setStatus({ kind: 'idle' });
    try {
      await submitLead(lead);
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
    <div className="relative rounded-[1.75rem] bg-white p-6 text-ink shadow-[0_40px_100px_-40px_rgb(0_0_0/0.6)] sm:p-9">
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
            <span className="grid h-16 w-16 place-items-center rounded-full bg-brand">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-semibold">So‘rovingiz yuborildi</h3>
            <p className="mt-3 max-w-sm leading-relaxed text-muted">
              Rahmat! So‘rovingiz qabul qilindi. Ko‘rib chiqilgach, siz bilan bog‘lanamiz.
            </p>
            <Button variant="outline" className="mt-8" onClick={() => setStatus({ kind: 'idle' })}>
              Yana so‘rov yuborish
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
                So‘rov qoldiring
              </h3>
              <p className="mt-1.5 text-muted">Barcha maydonlar, izohdan tashqari, to‘ldirilishi shart.</p>
            </div>

            <Field id="name" label="Ism" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Ismingiz"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describedBy('name')}
                className={inputClasses(Boolean(errors.name)) + ' h-12'}
                {...register('name')}
              />
            </Field>

            <Field id="phone" label="Telefon raqami" error={errors.phone?.message} hint="Masalan: +998 90 123 45 67">
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

            <Field id="interest" label="Qiziqish yo‘nalishi" error={errors.interest?.message}>
              <div className="relative">
                <select
                  id="interest"
                  aria-invalid={Boolean(errors.interest)}
                  aria-describedby={describedBy('interest')}
                  className={inputClasses(Boolean(errors.interest)) + ' h-12 appearance-none pr-11'}
                  {...register('interest')}
                >
                  <option value="" disabled>
                    Tanlang
                  </option>
                  {INTERESTS.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-ink/50"
                />
              </div>
            </Field>

            <Field id="comment" label="Izoh" optional error={errors.comment?.message}>
              <textarea
                id="comment"
                rows={4}
                placeholder="Masalan: maydon joylashuvi yoki savolingiz"
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
                  <div role="alert" className="flex gap-3 rounded-xl border border-danger/25 bg-danger/5 p-4 text-sm text-danger">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <p>
                      {ERROR_TEXT[status.reason]}
                      {hasAnyContact && ' Yoki rasmiy kontaktlarimiz orqali bevosita bog‘laning.'}
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
                  Yuborilmoqda…
                </span>
              ) : (
                'So‘rov yuborish'
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
