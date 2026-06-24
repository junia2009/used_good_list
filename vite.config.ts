import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const commit = (process.env.GITHUB_SHA ?? '').slice(0, 7) || 'local';
const buildDate = new Date().toISOString().slice(0, 10);

/**
 * デプロイ（CIビルド）ごとにバージョンを 0.0.1 ずつ上げる。
 * GitHub Actions の実行番号 N を 10進法でくり上げて major.minor.patch にする。
 * 例: 1→0.0.1, 10→0.1.0, 100→1.0.0。ローカルビルドは package.json の値。
 */
function deriveVersion(): string {
  const n = parseInt(process.env.GITHUB_RUN_NUMBER ?? '', 10);
  if (!Number.isFinite(n) || n <= 0) return pkg.version;
  return `${Math.floor(n / 100)}.${Math.floor(n / 10) % 10}.${n % 10}`;
}
const version = deriveVersion();

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_COMMIT__: JSON.stringify(commit),
    __APP_BUILD_DATE__: JSON.stringify(buildDate),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Totte',
        short_name: 'Totte',
        description: 'いつものやつを、みんなで共有',
        theme_color: '#c2703d',
        background_color: '#fbf8f3',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
