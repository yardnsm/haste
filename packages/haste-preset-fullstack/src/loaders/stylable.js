const StylablePlugin = require('stylable-integration/webpack-plugin');

const stylableOptions = {
  injectBundleCss: true,
  filename: '[name].stylable.bundle.css',
  nsDelimiter: '--'
};

const stylableRegExp = /\.st\.css$/;

module.exports.stylableOptions = stylableOptions;
module.exports.stylableRegExp = stylableRegExp;

module.exports.plugin = function (options = stylableOptions) {
  return new StylablePlugin(options);
};

module.exports.rule = function (match = stylableRegExp) {
  return StylablePlugin.rule(match);
};
