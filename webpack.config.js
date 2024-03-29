var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        use: [{ loader: 'babel-loader' }]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{ loader: 'url-loader', options: { limit: 10000 } }],
      },
      {
        test: /\.woff2(\?\S*)?$/,
        use: [{ loader: 'url-loader?limit=100000&mimetype=application/font-woff2' }]
      },
      {
        test: /\.woff(\?\S*)?$/,
        use: [{ loader: 'url-loader?limit=100000&mimetype=application/font-woff' }]
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: [{ loader: 'file-loader' }],
      },
    ]
  },
  devServer: {
    historyApiFallback: true,
  }
};

module.exports = config;
