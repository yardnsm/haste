const DashboardPlugin = require('haste-plugin-dashboard');
const paths = require('../../config/paths');

module.exports = async (configure) => {
  const { run, watch, tasks } = configure({
    persistent: true,
    plugins: [
      new DashboardPlugin({
        oneLinerTasks: true,
        tasks: ['server', 'webpack-dev-server', 'mocha']
      }),
    ],
  });

  const { clean, read, write, babel, sass, webpackDevServer, server, mocha } = tasks;

  await run(clean({ pattern: `${paths.build}/*` }));

  await Promise.all([
    run(
      read({ pattern: `{${paths.src},${paths.test}}/**/*.js` }),
      babel(),
      write({ target: paths.build })
    ),
    run(
      read({ pattern: `${paths.src}/**/*.scss` }),
      sass({
        includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
      }),
      write({ target: paths.build })
    ),
    run(
      read({
        pattern: [
          `${paths.assets}/**/*.*`,
          `${paths.src}/**/*.{ejs,html,vm}`,
          `${paths.src}/**/*.{css,json,d.ts}`,
        ]
      }),
      write({ target: paths.build })
    ),
    run(
      read({
        pattern: [
          `${paths.assets}/**/*.*`,
          `${paths.src}/**/*.{ejs,html,vm}`,
        ]
      }),
      write({ target: paths.statics })
    ),
    run(webpackDevServer({ configPath: paths.config.webpack.production })),
    run(
      read({ pattern: `${paths.src}/**/*.spec.js` }),
      mocha({
        require: [require.resolve('../../config/test-setup')],
        timeout: 30000,
      })
    )
  ]);

  await run(server({ serverPath: 'index.js' }));

  watch(`${paths.src}/**/*.js`, changed => run(
    read({ pattern: changed }),
    babel(),
    write({ target: paths.build }),
    server({ serverPath: 'index.js' })
  ));

  watch(`${paths.src}/**/*.scss`, changed => run(
    read({ pattern: changed }),
    sass({
      includePaths: ['node_modules', 'node_modules/compass-mixins/lib']
    }),
    write({ target: paths.build })
  ));

  watch(`${paths.src}/**/*.js`, () => run(
    read({ pattern: `${paths.src}/**/*.spec.js` }),
    mocha({ timeout: 30000 })
  ));
};
