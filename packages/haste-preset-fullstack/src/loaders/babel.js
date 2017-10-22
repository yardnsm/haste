const { unprocessedModules } = require('../../config/project');

module.exports = () => ({
  test: /\.js?$/,
  loader: 'happypack/loader?id=js',
  include: unprocessedModules()
});
