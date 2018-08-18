import CleanWebpackPlugin from 'clean-webpack-plugin';
import { Configuration } from 'webpack';

const commonConfig: Configuration = {
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },

  externals: {},
  plugins: [new CleanWebpackPlugin('dist', { exclude: ['.gitignore'] })],
};

const devConfig: Configuration = {
  ...commonConfig,
  devtool: 'source-map',
  mode: 'development',
};

const prodConfig: Configuration = {
  ...commonConfig,
  devtool: 'source-map',
  mode: 'production',
};

export default (process.env.NODE_ENV === 'production' ? prodConfig : devConfig);
