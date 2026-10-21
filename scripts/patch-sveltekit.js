import fs from 'fs';
import path from 'path';

const fetcherPath = path.resolve('node_modules/@sveltejs/kit/src/runtime/client/fetcher.js');
if (fs.existsSync(fetcherPath)) {
  let code = fs.readFileSync(fetcherPath, 'utf8');
  
  // Replace window.fetch assignments with try-catch wrapped versions
  code = code.replace(
    /\twindow\.fetch\s*=\s*\(input,\s*init\)\s*=>\s*\{([\s\S]*?)\n\t\};/g,
    '\ttry {\n\t\twindow.fetch = (input, init) => {$1\n\t\t};\n\t} catch (e) {}'
  );

  fs.writeFileSync(fetcherPath, code, 'utf8');
  console.log('Successfully patched SvelteKit fetcher.js');
}

const viteCache = path.resolve('node_modules/.vite');
if (fs.existsSync(viteCache)) {
  fs.rmSync(viteCache, { recursive: true, force: true });
  console.log('Cleared Vite cache');
}
