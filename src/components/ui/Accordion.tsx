import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface AccordionItem {
  question: string;
  answer: ReactNode;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-white/[0.04] sm:px-8 sm:py-6"
              >
                <span className="font-display text-lg font-semibold sm:text-xl">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,transform] duration-300',
                    isOpen ? 'rotate-45 border-brand bg-brand text-ink' : 'border-white/15 text-white group-hover:border-brand/60',
                  )}
                >
                  <Plus className="h-4 w-4" strokeWidth={2.25} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="max-w-3xl px-5 pb-6 text-base leading-relaxed text-white/65 sm:px-8 sm:pb-7 sm:text-lg">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
