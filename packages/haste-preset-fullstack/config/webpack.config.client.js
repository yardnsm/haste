const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { mergeByConcat, isSingleEntry, inTeamCity } = require('../src/utils');
const webpackConfigCommon = require('./webpack.config.common');
const projectConfig = require('./project');
const DynamicPublicPath = require('../src/plugins/dynamic-public-path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const { isObject } = require('lodash');

const defaultCommonsChunkConfig = {
  name: 'commons',
  minChunks: 2
};

const config = ({ debug, separateCss = projectConfig.separateCss(), analyze, disableModuleConcatenation } = {}) => {
  const disableModuleConcat = process.env.DISABLE_MODULE_CONCATENATION === 'true' || disableModuleConcatenation;
  const projectName = projectConfig.name();
  const cssModules = projectConfig.cssModules();
  const tpaStyle = projectConfig.tpaStyle();
  const useCommonsChunk = projectConfig.commonsChunk();
  const commonsChunkConfig = isObject(useCommonsChunk) ? useCommonsChunk : defaultCommonsChunkConfig;

  return mergeByConcat(webpackConfigCommon, {
    entry: getEntry(),

    module: {
      rules: [
        ...require('../src/loaders/sass')(separateCss, cssModules, tpaStyle, projectName).client,
        ...require('../src/loaders/less')(separateCss, cssModules, tpaStyle, projectName).client
      ]
    },

    plugins: [
      ...disableModuleConcat ? [] : [new webpack.optimize.ModuleConcatenationPlugin()],
      ...analyze ? [new BundleAnalyzerPlugin()] : [],
      ...useCommonsChunk ? [new webpack.optimize.CommonsChunkPlugin(commonsChunkConfig)] : [],

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new webpack.LoaderOptionsPlugin({
        minimize: !debug
      }),

      new DuplicatePackageCheckerPlugin({ verbose: true }),

      new DynamicPublicPath(),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': debug ? '"development"' : '"production"',
        'window.__CI_APP_VERSION__': process.env.ARTIFACT_VERSION ? `"${process.env.ARTIFACT_VERSION}"` : '"0.0.0"'
      }),

      ...!separateCss ? [] : [
        new ExtractTextPlugin(debug ? '[name].css' : '[name].min.css')
      ],

      ...debug ? [] : [
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          compress: {
            warnings: false,
          },
        })
      ],
    ],

    devtool: inTeamCity() ? 'source-map' : 'cheap-module-source-map',

    output: {
      umdNamedDefine: true,
      path: path.resolve('./dist/statics'),
      filename: debug ? '[name].bundle.js' : '[name].bundle.min.js',
      chunkFilename: debug ? '[name].chunk.js' : '[name].chunk.min.js',
      pathinfo: debug
    },

    target: 'web'
  });
};

function getEntry() {
  const entry = projectConfig.entry() || projectConfig.defaultEntry();
  return isSingleEntry(entry) ? { app: entry } : entry;
}

module.exports = config;
