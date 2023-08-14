import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

const proxyUrl = process.env.PROXY_URL || 'https://jade.datarepo-dev.broadinstitute.org';
const bigQueryApi = 'https://bigquery.googleapis.com';
const googleSheetsApi = 'https://sheets.googleapis.com';
const driveApi = 'https://www.googleapis.com';

export default defineConfig({
  build: {
    outDir: 'build',
  },
  define: {
    'process.env': {},
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    svgr(),
    tsconfigPaths(),
    eslint(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: proxyUrl,
        changeOrigin: true,
      },
      '/configuration': {
        target: proxyUrl,
        changeOrigin: true,
      },
      '/status': {
        target: proxyUrl,
        changeOrigin: true,
      },
      '/oauth2': {
        target: proxyUrl,
        changeOrigin: true,
      },
      '/bigquery': {
        target: bigQueryApi,
        changeOrigin: true,
      },
      '/googlesheets': {
        target: googleSheetsApi,
        changeOrigin: true,
        pathRewrite: { '^/googlesheets': '' },
      },
      '/drive': {
        target: driveApi,
        changeOrigin: true,
      },
    },
  },
});
