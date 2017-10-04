const chalk = require('chalk');
const { format, delta } = require('./utils');

module.exports = class LoggerPlugin {
  apply(runner) {
    runner.plugin('start-worker', (worker) => {
      ['stdout', 'stderr'].forEach(name => worker.child[name].pipe(process[name]));
    });

    runner.plugin('start-run', (runPhase) => {
      runPhase.tasks.forEach((task) => {
        let start;

        task.plugin('start-task', () => {
          start = new Date();
          console.log(`[${format(start)}] ${chalk.black.bgGreen('Starting')} '${task.name}'...`);
        });

        task.plugin('succeed-task', () => {
          const [end, time] = delta(start);
          console.log(`[${format(end)}] ${chalk.black.bgCyan('Finished')} '${task.name}' after ${time} ms`);
        });

        task.plugin('failed-task', () => {
          const [end, time] = delta(start);
          console.log(`[${format(end)}] ${chalk.white.bgRed('Failed')} '${task.name}' after ${time} ms`);
        });
      });
    });
  }
};
