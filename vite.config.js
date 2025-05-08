import { defineConfig } from 'vite';

export default defineConfig({
  // Base path for assets in production
  base: '/',

  // Build options
  build: {
    // Output directory for build
    outDir: 'dist',

    // Enable rollup option to copy index.html and all HTML files to dist
    rollupOptions: {
      input: {
        main: './index.html',
        cart: './cart.html',
        notFound: './404.html',
      },
    },
  },

  // Server options
  server: {
    port: 3000,
    open: true,
  },
});
