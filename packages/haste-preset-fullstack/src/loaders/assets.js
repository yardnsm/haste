module.exports = () => ({
  test: /^(?:(?!inline\.svg).)*\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|wav|mp3)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    name: '[path][name].[ext]?[hash]',
    limit: 10000
  }
});
