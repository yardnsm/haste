module.exports = isAngularProject => ({
  test: /\.tsx?$/,
  exclude: /(node_modules)/,
  use: [...isAngularProject ? ['ng-annotate-loader'] : [], 'ts-loader?{"logLevel":"warn"}']
});
