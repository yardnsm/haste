'use strict';

const {unprocessedModules} = require('../../config/project');

require('babel-register')({
  only: unprocessedModules(),
  plugins: [
    require.resolve('babel-plugin-transform-es2015-modules-commonjs')
  ]
});
