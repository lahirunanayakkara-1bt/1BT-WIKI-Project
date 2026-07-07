// Tailwind v4 — theme tokens are defined in globals.css via @theme {}.
// This file remains for any v4-compatible plugin configuration if needed in future.
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
};

export default config;
