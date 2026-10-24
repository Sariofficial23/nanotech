import type { ReactNode } from 'react';
import { useI18n } from '../../i18n/context';

interface FieldProps {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export default function Field({ id, label, optional, error, hint, children }: FieldProps) {
  const { t } = useI18n();
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-semibold text-white">
        {label}
        {optional && <span className="text-xs font-normal text-white/45">{t.form.optional}</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-white/45">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
