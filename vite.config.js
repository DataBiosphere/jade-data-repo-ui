import { defineConfig } from 'vite';
import dns from 'dns';
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

const proxyUrl = process.env.PROXY_URL || 'https://jade.datarepo-dev.broadinstitute.org';
const bigQueryApi = 'https://bigquery.googleapis.com';
const googleSheetsApi = 'https://sheets.googleapis.com';
const driveApi = 'https://www.googleapis.com';

dns.setDefaultResultOrder('verbatim');

const getPlugins = () => {
  const plugins = [react(), svgr(), tsconfigPaths()];
  if (process.env.DISABLE_ESLINT_PLUGIN !== 'true') {
    plugins.push(eslint({ lintOnStart: false }));
  }
  return plugins;
};

export default defineConfig({
  build: {
    outDir: 'build',
  },
  define: {
    'process.env': process.env,
  },
  optimizeDeps: {
    entries: ['cypress/**/*'],
  },
  plugins: getPlugins(),
  server: {
    port: 3000,
    host: 'localhost',
    open: true,
    watch: {
      ignored: ['!**/node_modules/**'],
    },
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
