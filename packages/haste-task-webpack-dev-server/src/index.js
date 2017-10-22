const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');

module.exports = ({ configPath, port = 3200, hostname = 'localhost' }) => () => {
  return new Promise((resolve) => {
    const app = express();
    const config = require(configPath);
    const compiler = webpack(config);

    app.use(webpackDevMiddleware(compiler));
    app.use(express.static('dist/statics'));

    app.listen(port, hostname, resolve);
  });
};
