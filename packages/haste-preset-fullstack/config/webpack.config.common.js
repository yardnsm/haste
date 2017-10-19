

const path = require('path');

const context = path.resolve('./src');
const projectConfig = require('./project');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const stylable = require('../lib/loaders/stylable');

const config = {
  context,

  output: getOutput(),

  resolve: {
    modules: [
      'node_modules',
      context
    ],

    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    symlinks: false
  },

  resolveLoader: {
    modules: [path.join(__dirname, '..', 'node_modules'), 'node_modules']
  },

  plugins: [
    new CaseSensitivePathsPlugin(),
    require('../lib/plugins/babelHappyPack')(projectConfig.isAngularProject()),
    stylable.plugin()
  ],

  module: {
    rules: [
      require('../lib/loaders/babel')(),
      require('../lib/loaders/typescript')(projectConfig.isAngularProject()),
      require('../lib/loaders/graphql')(),
      require('../lib/loaders/assets')(),
      require('../lib/loaders/svg')(),
      require('../lib/loaders/html')(),
      require('../lib/loaders/raw')(),
      stylable.rule()
    ]
  },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    __dirname: true
  },

  devtool: 'source-map',

  externals: projectConfig.externals()
};

function getOutput() {
  const libraryExports = projectConfig.exports();
  const output = {
    path: path.resolve('./dist'),
    pathinfo: true
  };

  if (libraryExports) {
    return Object.assign({}, output, {
      library: libraryExports,
      libraryTarget: 'umd'
    });
  }

  return output;
}

module.exports = config;
