const path = require('path');
const { tryRequire, isTypescriptProject } = require('../src/utils');

const ext = isTypescriptProject() && !process.env.IN_WALLABY ? 'ts' : 'js';
const mochaSetupPath = path.join(process.cwd(), 'test', `mocha-setup.${ext}`);
const setupPath = path.join(process.cwd(), 'test', `setup.${ext}`);

if (!process.env.IN_WALLABY) {
  require('../src/require-hooks');
}

require('../src/ignore-extensions');

tryRequire(mochaSetupPath);
tryRequire(setupPath);
