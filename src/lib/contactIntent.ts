import type { Interest } from './leadSchema';

// Lets any "contact us" button pre-select the form's interest and jump to the form.
// The form is lazy-loaded, so the last request is also kept until the form mounts and reads it.
const EVENT = 'nanotech:contact-intent';
let pending: Interest | null = null;

export function requestContact(interest?: Interest) {
  if (interest) {
    pending = interest;
    window.dispatchEvent(new CustomEvent<Interest>(EVENT, { detail: interest }));
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('aloqa')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function onContactIntent(handler: (interest: Interest) => void) {
  if (pending) handler(pending);
  const listener = (e: Event) => handler((e as CustomEvent<Interest>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function clearContactIntent() {
  pending = null;
  productPending = null;
}

let productPending: string | null = null;
const PRODUCT_EVENT = 'nanotex:product-intent';
export function requestProductContact(name: string) {
  productPending = name;
  window.dispatchEvent(new CustomEvent<string>(PRODUCT_EVENT, { detail: name }));
  requestContact('kompaniya');
}
export function onProductContact(handler: (name: string) => void) {
  if (productPending) handler(productPending);
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail);
  window.addEventListener(PRODUCT_EVENT, listener);
  return () => window.removeEventListener(PRODUCT_EVENT, listener);
}
