const path = require('path');
const { merge } = require('lodash/fp');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { cssModulesPattren } = require('yoshi-runtime');

module.exports = (separateCss, cssModules, tpaStyle, projectName) => {
  const cssLoaderOptions = {
    camelCase: true,
    sourceMap: !!separateCss,
    localIdentName: cssModulesPattren(),
    hashPrefix: projectName,
    modules: cssModules,
    importLoaders: tpaStyle ? 4 : 3
  };

  const lessLoaderOptions = {
    sourceMap: true,
    paths: ['.', 'node_modules']
  };

  const globalRegex = /\.global.less$/;

  const getLessRule = (ruleConfig, loaderConfig) => merge(ruleConfig, {
    test: /\.less$/,
    use: clientLoader(separateCss, { loader: 'style-loader', options: { singleton: true } }, [
      {
        loader: 'css-loader',
        options: merge(cssLoaderOptions, loaderConfig)
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: path.join(__dirname, '..', '..', 'config', 'postcss.config.js')
          },
          sourceMap: true
        }
      },
      ...tpaStyle ? ['wix-tpa-style-loader'] : [],
      {
        loader: 'less-loader',
        options: lessLoaderOptions
      }
    ])
  });

  return {
    client: [
      getLessRule({ include: globalRegex }, { modules: false }),
      getLessRule({ exclude: globalRegex })
    ],
    specs: {
      test: /\.less$/,
      use: [
        {
          loader: 'css-loader/locals',
          options: cssLoaderOptions
        },
        ...tpaStyle ? ['wix-tpa-style-loader'] : [],
        {
          loader: 'less-loader',
          options: lessLoaderOptions
        }
      ]
    }
  };
};

function clientLoader(separateCss, l1, l2) {
  return separateCss ? ExtractTextPlugin.extract({ fallback: l1, use: l2 }) : [l1].concat(l2);
}
