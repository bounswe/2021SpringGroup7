/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://flask:5000/api',
    pathRewrite: { '^/api': '/' },
    changeOrigin: true,
  })
);
// eslint-disable-next-line func-names
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(process.env.APP_PORT || 5000);