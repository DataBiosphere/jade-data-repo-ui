import { devServer } from '@cypress/vite-dev-server';
import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';
import customViteConfig from './vite.config';

export default defineConfig({
  component: {
    devServer(devServerConfig) {
      return devServer({
        ...devServerConfig,
        framework: 'react',
        viteConfig: customViteConfig,
      });
    },
    specPattern: 'src/**/*test.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.js',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor());
    },
    specPattern: 'cypress/integration/**/*.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.js',
  },
  projectId: 'e6ttjx',
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 60000,
  requestTimeout: 120000,
});
