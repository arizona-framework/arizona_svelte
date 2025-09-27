import { spawn } from 'child_process';

const isDev = process.env.NODE_ENV !== 'production';

console.log(`Building CSS (${isDev ? 'development' : 'production'})...`);

const tailwindArgs = [
  'tailwindcss',
  '-i', './assets/css/app.css',
  '-o', './priv/static/assets/app.css'
];

if (!isDev) {
  tailwindArgs.push('--minify');
}

const tailwindProcess = spawn('npx', tailwindArgs, { stdio: 'inherit' });

tailwindProcess.on('close', (code) => {
  if (code === 0) {
    console.log('CSS build complete!');
  } else {
    console.error('CSS build failed');
    process.exit(1);
  }
});