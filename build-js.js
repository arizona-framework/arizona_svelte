import { build } from 'esbuild';
import sveltePlugin from 'esbuild-svelte';

const isDev = process.env.NODE_ENV !== 'production';

await build({
  entryPoints: ['assets/js/main.js'],
  bundle: true,
  outfile: 'priv/static/assets/app.js',
  minify: !isDev,
  define: {
    'process.env.NODE_ENV': isDev ? '"development"' : '"production"'
  },
  alias: {
    '@arizona-framework/client': './_checkouts/arizona/priv/static/assets/js/arizona.min.js'
  },
  plugins: [
    sveltePlugin({
      compilerOptions: {
        css: 'injected',
        dev: isDev
      }
    })
  ]
});

console.log('JavaScript build complete!');