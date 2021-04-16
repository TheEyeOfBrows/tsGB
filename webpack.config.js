const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: './index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|test)/,
        use: [{
          loader: 'ts-loader'
        }],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true,
    host: "localhost",
    port: 8080,
  }
};