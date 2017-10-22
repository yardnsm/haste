'use strict';

const {runIndividualTranspiler} = require('../../config/project');
const {isTypescriptProject, isBabelProject} = require('../utils');

if (runIndividualTranspiler()) {
  runtimeTranspiler();
}

function runtimeTranspiler() {
  if (isTypescriptProject()) {
    require('./ts-node-register');
  } else if (isBabelProject()) {
    require('./babel-register');
  }
}
