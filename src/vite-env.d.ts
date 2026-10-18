/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_CONTACT_PHONE?: string;
  readonly VITE_CONTACT_TELEGRAM?: string;
  readonly VITE_CONTACT_INSTAGRAM?: string;
  readonly VITE_LEAD_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
