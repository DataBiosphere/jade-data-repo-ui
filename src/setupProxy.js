const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyUrl = process.env.PROXY_URL || 'http://localhost:8080';

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
};
