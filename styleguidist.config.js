const { version } = require('./package.json');
const path = require('path');

module.exports = {
  title: 'Learn@Home Frontend',
  version,
  components: ['./src/[A-Z]*.js', './src/**/[A-Z]*.js'],
  ignore: ['./src/**/[A-Z]*.test.js'],
  require: [path.resolve(__dirname, 'styleguidist.setup.js')],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss?$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(jpg|png|svg)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 25000,
            },
          },
        },
      ],
    },
  },
};
