import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/saira/900-italic.css';
import '@fontsource/barlow/600.css';
import '@fontsource/montserrat/800-italic.css';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
