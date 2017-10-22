const helpers = require('./happyPackHelpers');

module.exports = (isAngularProject) => {
  // we need to remove ng loader for non angular apps
  const loaders = [
    isAngularProject && {
      loader: 'ng-annotate-loader'
    },
    {
      loader: 'babel-loader'
    }
  ].filter(it => it);

  return helpers.createHappyPlugin('js', loaders);
};
