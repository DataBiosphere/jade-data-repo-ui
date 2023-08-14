import { devServer } from '@cypress/vite-dev-server';
import { defineConfig } from 'cypress';
import customViteConfig from './vite.config';

export default defineConfig({
  component: {
    src: ['./src/components'],
    devServer(devServerConfig) {
      return devServer({
        ...devServerConfig,
        framework: 'react',
        bundler: 'vite',
        viteConfig: customViteConfig,
      });
    },
    specPattern: 'src/**/*test.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/index.js',
  },
  projectId: 'e6ttjx',
  viewportWidth: 1920,
  viewportHeight: 1080,
  defaultCommandTimeout: 60000,
  requestTimeout: 120000,
});
