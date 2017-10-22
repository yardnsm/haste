const LoggerPlugin = require('haste-plugin-logger');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, tasks } = configure({
    plugins: [
      new LoggerPlugin(),
    ],
  });

  const { read, eslint } = tasks;

  await run(
    read({ pattern: `${paths.src}/**/*.js` }),
    eslint()
  );
};
