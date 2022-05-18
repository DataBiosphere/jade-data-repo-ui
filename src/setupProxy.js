//eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyUrl = process.env.PROXY_URL || 'http://localhost:8080';
const bigQueryApi = 'https://bigquery.googleapis.com';
const googleSheetsApi = 'https://sheets.googleapis.com';
const driveApi = 'https://www.googleapis.com';

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
    '/oauth2',
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
  app.use(
    '/googlesheets',
    createProxyMiddleware({
      target: googleSheetsApi,
      changeOrigin: true,
      pathRewrite: { '^/googlesheets': '' }
    }),
  );
  app.use(
    '/drive',
    createProxyMiddleware({
      target: driveApi,
      changeOrigin: true,
    }),
  );
};
