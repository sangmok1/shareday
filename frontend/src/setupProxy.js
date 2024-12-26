const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying:', req.method, req.path);
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.status(500).json({
          error: 'Proxy Error',
          message: err.message
        });
      }
    })
  );
};
