import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env files (e.g., .env, .env.production) so we can validate required vars at build-time.
  const env = loadEnv(mode, process.cwd(), '');

  const hasSupabase = Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);

  if (!hasSupabase) {
    const msg = 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Set them before building the app.';
    // During CI/deploy we want a hard failure so deployment logs clearly show the cause.
    // Most CI providers set the CI environment variable to "true". In that case throw to abort the build.
    if (process.env.CI) {
      // Throwing here will make the build fail with a clear error in CI logs.
      throw new Error(msg);
    }

    // For local dev builds, warn so developers see the issue but can still run the dev server.
    // The app will still show a runtime message explaining the missing env.
    // eslint-disable-next-line no-console
    console.warn(`vite: ${msg}`);
  }

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      // Reduce noisy warnings about large chunks; adjust as needed for your project.
      chunkSizeWarningLimit: 2000, // in kB
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
