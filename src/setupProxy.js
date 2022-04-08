//eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyUrl = process.env.PROXY_URL || 'http://localhost:8080';
const bigQueryApi = 'https://bigquery.googleapis.com';

module.exports = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: proxyUrl,
      changeOrigin: true,
    }),
  );
  app.use(
    '/configuration',
    createProxyMiddleware({
      target: proxyUrl,
      changeOrigin: true,
    }),
  );
  app.use(
    '/status',
    createProxyMiddleware({
      target: proxyUrl,
      changeOrigin: true,
    }),
  );
  app.use(
    '/bigquery',
    createProxyMiddleware({
      target: bigQueryApi,
      changeOrigin: true,
    }),
  );
};
