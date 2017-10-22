const HappyPack = require('happypack');

const happyThreadPool = HappyPack.ThreadPool({size: 5}); // eslint-disable-line

function createHappyPlugin(id, loaders) {
  return new HappyPack({
    id,
    loaders,
    threadPool: happyThreadPool,
    tempDir: 'target/.happypath',
    enabled: process.env.HAPPY !== '0',
    cache: process.env.HAPPY_CACHE !== '0',
    verbose: process.env.HAPPY_VERBOSE === '1',
  });
}

module.exports = {
  createHappyPlugin,
};
