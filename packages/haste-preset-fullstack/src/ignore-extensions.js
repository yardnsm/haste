const fs = require('fs');
const graphqlLoader = require('graphql-tag/loader');
const path = require('path');

function conditionedProxy(predicate = () => {}) {
  return new Proxy({}, {
    get: (target, name) =>
      predicate(name) ? conditionedProxy() : name
  });
}

function mockCssModules(module) {
  module.exports = conditionedProxy(name => name === 'default');
}

function loadGraphQLModules(module) {
  const query = fs.readFileSync(module.filename, 'utf-8');
  const scopedLoader = graphqlLoader.bind({ cacheable: noop });
  const output = scopedLoader(query);
  module.exports = eval(output); // eslint-disable-line no-eval
}

function mockMediaModules(module) {
  module.exports = path.basename(module.filename);
}

function noop() {}

require.extensions['.css'] = mockCssModules;
require.extensions['.scss'] = mockCssModules;
require.extensions['.less'] = mockCssModules;

require.extensions['.graphql'] = loadGraphQLModules;
require.extensions['.gql'] = loadGraphQLModules;

require.extensions['.png'] = mockMediaModules;
require.extensions['.svg'] = mockMediaModules;
require.extensions['.jpg'] = mockMediaModules;
require.extensions['.jpeg'] = mockMediaModules;
require.extensions['.gif'] = mockMediaModules;

require.extensions['.wav'] = mockMediaModules;
require.extensions['.mp3'] = mockMediaModules;
