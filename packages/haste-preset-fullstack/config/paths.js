const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
  appDirectory,
  build: 'dist',
  target: 'target',
  statics: 'dist/statics',
  assets: 'src/assets',
  src: 'src',
  test: 'test',
  entry: './client.js',
  config: {
    webpack: {
      development: require.resolve('./webpack.config.dev'),
      production: require.resolve('./webpack.config.prod')
    }
  }
};
