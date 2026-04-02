[← Back](./index.md)

1. Копируем репозиторий в папку modules
2. Пробуем запустить

Для админайзера
добавить файлы

```vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/modules',
    emptyOutDir: true,
    cssCodeSplit: true,
    lib: {
      entry: {
        Settings: path.resolve(__dirname, 'adminizer/modules/Settings.tsx'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Prevent bundling of peer dependencies
      external: ['react', 'react-dom', '@inertiajs/react'],
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [
    // Use classic JSX runtime to emit React.createElement calls, relying on external React global
    react({
      jsxRuntime: 'classic'
    }),
    viteExternalsPlugin({
      react: 'React',
      'react-dom': 'ReactDOM',
    }),
  ],
  // Replace process.env.NODE_ENV in the bundle for production-only code paths
  define: {
    // Polyfill process.env for client code and replace NODE_ENV
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  }
});
```

```tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './adminizer/modules/**/*.{ts,tsx}',
    './adminizer/components/**/*.{ts,tsx}'
  ],
  theme: { extend: {} },
  plugins: [],
};

```

```./adminizer/modules/tailwind.css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

добавить в package.json

    "tsx": "^4.19.3",
    "vite": "^4.0.0",
    "vite-plugin-externals": "^0.6.2",
    "vitest": "^3.0.7",
    "tailwindcss": "^4.1.12",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "postcss": "^8.4.21",
    "@vitejs/plugin-react": "^4.5.2",
    "@inertiajs/react": "^1.1.0",
    "@tailwindcss/postcss": "^4.1.10",
далее npm i -f

сборка    vite build