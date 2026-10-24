import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource/saira/600.css';
import '@fontsource/saira/700.css';
import '@fontsource/saira/900-italic.css';
import '@fontsource/barlow/600.css';
import '@fontsource/montserrat/800-italic.css';
import './index.css';
import App from './App';
import I18nProvider from './i18n/I18nProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
