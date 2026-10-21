import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import adapter from '@sveltejs/adapter-node';

const patchSvelteKitFetcher = {
  name: 'patch-sveltekit-fetcher',
  transform(code: string, id: string) {
    if (id.includes('fetcher.js')) {
      let modified = code;
      // Wrap window.fetch assignments in try-catch
      modified = modified.replace(
        /window\.fetch\s*=\s*\(/g,
        'try { window.fetch = ('
      );
      // Close the try blocks where fetch assignment functions end
      modified = modified.replace(
        /return native_fetch\(input,\s*init\);\s*\};/g,
        'return native_fetch(input, init);\n\t}; } catch (e) {}'
      );
      return modified;
    }
  }
};

export default defineConfig({
  plugins: [
    patchSvelteKitFetcher,
    sveltekit({
      adapter: adapter()
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true
  }
});
