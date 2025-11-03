const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@videos': './assets/videos',
          '@images': './assets/images',
          '@icons': './assets/icons',
          '@monorepo-ektm/types': path.resolve(__dirname, '../../packages/types'),
          '@monorepo-ektm/utils': path.resolve(__dirname, '../../packages/utils'),
          '@monorepo-ektm/database': path.resolve(__dirname, '../../packages/database'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
  ],
};
