import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import tailwindcss from '@tailwindcss/postcss';
import path from 'path';

// Mirrors local_modules/core/lib/adminpanel/vite.config.js: React and the
// adminizer shadcn components are provided by the admin panel at runtime
// (window.React / window.UIComponents), so they are externalized. Tailwind
// utilities used by the vendored assistant-ui components are compiled into
// globals.css and injected by the entry module (?inline import).
export default defineConfig({
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, 'assets'),
    emptyOutDir: true,
    lib: {
      entry: { OpenHarnessAgent: path.resolve(__dirname, 'ui-src/openharness-agent.tsx') },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].mjs',
        format: 'es',
      },
    },
  },
  css: {
    postcss: { plugins: [tailwindcss()] },
  },
  plugins: [
    react(),
    viteExternalsPlugin({
      '@/components/ui/button': 'UIComponents',
      '@/components/ui/badge': 'UIComponents',
      '@/components/ui/tooltip': 'UIComponents',
      '@/components/ui/dialog': 'UIComponents',
      '@/components/ui/avatar': 'UIComponents',
      '@/components/ui/collapsible': 'UIComponents',
    }),
  ],
  define: {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    alias: {
      // React is a window global. ESM facades with real named exports are
      // required because some deps re-export react (`export * from "react"`),
      // which vite-plugin-externals cannot express; the jsx-runtime shim
      // emulates the automatic JSX runtime via createElement.
      'react/jsx-runtime': path.resolve(__dirname, 'ui-src/jsx-runtime-shim.js'),
      'react/jsx-dev-runtime': path.resolve(__dirname, 'ui-src/jsx-runtime-shim.js'),
      'react-dom/client': path.resolve(__dirname, 'ui-src/react-dom-global-shim.js'),
      'react-dom': path.resolve(__dirname, 'ui-src/react-dom-global-shim.js'),
      react: path.resolve(__dirname, 'ui-src/react-global-shim.js'),
    },
  },
});
