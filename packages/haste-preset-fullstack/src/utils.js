const { mergeWith } = require('lodash/fp');
const fs = require('fs');
const process = require('process');
const path = require('path');
const mkdirp = require('mkdirp');
const glob = require('glob');
const project = require('../config/project');

const readDir = module.exports.readDir = patterns =>
  [].concat(patterns).reduce((acc, pattern) =>
    acc.concat(glob.sync(pattern)), []);

module.exports.copyFile = (source, target) => new Promise((resolve, reject) => {
  const done = err => err ? reject(err) : resolve();

  const rd = fs.createReadStream(source)
    .on('error', err => done(err));

  const wr = fs.createWriteStream(target)
    .on('error', err => done(err))
    .on('close', err => done(err));

  rd.pipe(wr);
});

const exists = module.exports.exists = patterns => !!readDir(patterns).length;

const tryRequire = module.exports.tryRequire = (name) => {
  try {
    return require(name);
  } catch (ex) {
    if (ex.code === 'MODULE_NOT_FOUND') {
      return null;
    }
    throw ex;
  }
};

function concatCustomizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

function logIfAny(log) {
  if (log) {
    console.log(log);
  }
}

module.exports.noop = () => {};

module.exports.logIfAny = logIfAny;

module.exports.mergeByConcat = mergeWith(concatCustomizer);

module.exports.suffix = suffix => (str) => {
  const hasSuffix = str.lastIndexOf(suffix) === str.length - suffix.length;
  return hasSuffix ? str : str + suffix;
};

module.exports.isTypescriptProject = () =>
  !!tryRequire(path.resolve('tsconfig.json'));

module.exports.isBabelProject = () => {
  return !!glob.sync(path.resolve('.babelrc')).length || !!project.babel();
};

module.exports.writeFile = (targetFileName, data) => {
  mkdirp.sync(path.dirname(targetFileName));
  fs.writeFileSync(path.resolve(targetFileName), data);
};

module.exports.isSingleEntry = entry => typeof entry === 'string' || Array.isArray(entry);

module.exports.watchMode = (value) => {
  if (value !== undefined) {
    process.env.WIX_NODE_BUILD_WATCH_MODE = value;
  }
  return !!process.env.WIX_NODE_BUILD_WATCH_MODE;
};

module.exports.inTeamCity = () =>
  process.env.BUILD_NUMBER || process.env.TEAMCITY_VERSION;

module.exports.isProduction = () => (process.env.NODE_ENV || '').toLowerCase() === 'production';

module.exports.filterNoise = (comp) => {
  comp.plugin('done', (stats) => {
    logIfAny(stats.toString({
      colors: true,
      hash: false,
      chunks: false,
      assets: false,
      children: false,
      version: false,
      timings: false,
      modules: false
    }));
    mkdirp.sync(path.resolve('target'));
    fs.writeFileSync('target/webpack-stats.json', JSON.stringify(stats.toJson()));
  });

  return comp;
};

module.exports.shouldRunWebpack = (webpackConfig) => {
  const defaultEntryPath = path.join(webpackConfig.context, project.defaultEntry());
  return project.entry() || exists(`${defaultEntryPath}.{js,jsx,ts,tsx}`);
};
