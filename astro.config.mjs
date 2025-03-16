
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    icon({
      include: {
        lucide: ['*']
      }
    })
  ],
  site: 'https://astrocitrus.com',
  compressHTML: true,
  build: {
    assets: 'assets'
  }
});
