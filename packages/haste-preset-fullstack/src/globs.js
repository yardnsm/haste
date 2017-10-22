const path = require('path');

const dist = 'dist';
const statics = path.join(dist, 'statics');
const test = 'test';
const base = `{app,src,bin,${test},testkit,stories}`;

module.exports = {
  base: () => base,
  statics: () => statics,
  babel: list => [path.join(list || base, '**', '*.js{,x}'), 'index.js'],
  specs: () => `${base}/**/*.spec.+(js|ts){,x}`,
  e2e: () => `${test}/**/*.e2e.{js,ts}`,
  singleModule: {
    clientDist: () => statics
  },
  multipleModules: {
    clientDist: () => dist
  },
  tslint: () => [`${base}/**/*.ts{,x}`],
  less: () => `${base}/**/*.less`
};
