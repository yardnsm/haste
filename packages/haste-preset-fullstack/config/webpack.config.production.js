const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const paths = require('./paths');

const context = path.resolve('./src');
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
const globalRegex = /\.global\.s?css$/;

const allSourcesButExternalModules = (filePath) => {
  filePath = path.normalize(filePath);
  return filePath.startsWith(process.cwd()) && !filePath.includes('node_modules');
};

module.exports = {
  context,

  entry: {
    app: paths.entry,
  },

  output: {
    path: path.resolve(paths.appDirectory, paths.statics),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    pathinfo: true,
  },

  resolve: {
    modules: ['node_modules', context],
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
    symlinks: false
  },

  resolveLoader: {
    modules: [path.join(__dirname, '..', 'node_modules'), 'node_modules']
  },

  plugins: [
    new CaseSensitivePathsPlugin(),

    new HappyPack({
      id: 'js',
      loaders: [
        {
          loader: 'babel-loader'
        }
      ],
      threadPool: happyThreadPool,
      tempDir: 'target/.happypath',
      enabled: process.env.HAPPY !== '0',
      cache: process.env.HAPPY_CACHE !== '0',
      verbose: process.env.HAPPY_VERBOSE === '1',
    }),
    // require('../lib/plugins/babelHappyPack')(projectConfig.isAngularProject()),

    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new webpack.LoaderOptionsPlugin({ minimize: false }),

    new DuplicatePackageCheckerPlugin({ verbose: true }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      'window.__CI_APP_VERSION__': process.env.ARTIFACT_VERSION ? `"${process.env.ARTIFACT_VERSION}"` : '"0.0.0"'
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: 'happypack/loader?id=js',
        include: (filePath) => {
          const result = ['react-router/es', 'wix-style-react/src']
            .map(m => new RegExp(`node_modules/${m}`))
            .some(regex => regex.test(filePath));

          return result || allSourcesButExternalModules(filePath);
        },
      },

      {
        test: /^(?:(?!inline\.svg).)*\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|wav|mp3)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          name: '[path][name].[ext]?[hash]',
          limit: 10000
        }
      },

      {
        test: /\.inline\.svg$/,
        loader: 'svg-inline-loader'
      },

      {
        test: /\.html$/,
        loader: 'html-loader'
      },

      {
        test: /\.md$/,
        loader: 'raw-loader'
      },

      {
        test: /\.s?css$/,
        include: globalRegex,
        use: [
          {
            loader: 'style-loader',
            options: { singleton: true }
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
              camelCase: true,
              sourceMap: false,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.join(__dirname, '..', '..', 'config', 'postcss.config.js'),
              },
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
            }
          }
        ]
      },

      {
        test: /\.s?css$/,
        exclude: globalRegex,
        use: [
          {
            loader: 'style-loader',
            options: { singleton: true }
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              sourceMap: false,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: require.resolve('./postcss.config.js'),
              },
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
            }
          }
        ]
      },

      // ...require('../lib/loaders/sass')(separateCss, cssModules, tpaStyle, projectName).client,
    ]
  },

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    __dirname: true
  },

  devtool: 'cheap-module-source-map',

  target: 'web',
};
