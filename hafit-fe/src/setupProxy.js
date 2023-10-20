const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://13.124.127.102:8080/",
      changeOrigin: true,
    })
  );
};
