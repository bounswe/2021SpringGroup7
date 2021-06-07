const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("./config/application.json");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: config.API_URL,
      pathRewrite: { "^/api": "/" },
      changeOrigin: true,
    })
  );
};
