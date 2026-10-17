import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Fills %SITE_URL% in index.html (Open Graph needs absolute URLs).
// Without VITE_SITE_URL the og:url tag is dropped and og:image stays relative.
function siteUrl(url: string | undefined): Plugin {
  const base = url?.trim().replace(/\/+$/, '') ?? '';
  return {
    name: 'nanotech-site-url',
    transformIndexHtml(html) {
      if (base) return html.replaceAll('%SITE_URL%', base);
      return html.replace(/\s*<meta property="og:url"[^>]*>/, '').replaceAll('%SITE_URL%', '');
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // On Vercel, fall back to the production domain it provides.
  const url = env.VITE_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return {
    plugins: [react(), tailwindcss(), siteUrl(url)],
    server: { port: 5180 },
  };
});
