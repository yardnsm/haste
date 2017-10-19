const path = require('path');

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

const mochaSetupPath = path.join(process.cwd(), 'test/mocha-setup.js');
const setupPath = path.join(process.cwd(), 'test/setup.js');

const allSourcesButExternalModules = (filePath) => {
  filePath = path.normalize(filePath);
  return filePath.startsWith(process.cwd()) && !filePath.includes('node_modules');
};

require('babel-register')({
  only: (filePath) => {
    const result = ['react-router/es', 'wix-style-react/src']
      .map(m => new RegExp(`node_modules/${m}`))
      .some(regex => regex.test(filePath));

    return result || allSourcesButExternalModules(filePath);
  },
  plugins: [
    require.resolve('babel-plugin-transform-es2015-modules-commonjs')
  ]
});

function conditionedProxy(predicate = () => {}) {
  return new Proxy({}, {
    get: (target, name) =>
      predicate(name) ? conditionedProxy() : name
  });
}

function mockCssModules(module) {
  module.exports = conditionedProxy(name => name === 'default');
}

function mockMediaModules(module) {
  module.exports = path.basename(module.filename);
}

require.extensions['.css'] = mockCssModules;
require.extensions['.scss'] = mockCssModules;
require.extensions['.less'] = mockCssModules;

require.extensions['.png'] = mockMediaModules;
require.extensions['.svg'] = mockMediaModules;
require.extensions['.jpg'] = mockMediaModules;
require.extensions['.jpeg'] = mockMediaModules;
require.extensions['.gif'] = mockMediaModules;

require.extensions['.wav'] = mockMediaModules;
require.extensions['.mp3'] = mockMediaModules;

tryRequire(mochaSetupPath);
tryRequire(setupPath);
