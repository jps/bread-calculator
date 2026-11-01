// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Deployed to GitHub Pages with custom domain.
  site: 'https://bread.jspenc.com',

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});