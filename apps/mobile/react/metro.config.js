const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../../..');

const config = {
  watchFolders: [
    path.resolve(monorepoRoot, 'packages'),
    path.resolve(monorepoRoot, 'node_modules'),
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    alias: {
      '@monorepo-ektm/types': path.resolve(monorepoRoot, 'packages/types'),
      '@monorepo-ektm/utils': path.resolve(monorepoRoot, 'packages/utils'),
      '@monorepo-ektm/database': path.resolve(monorepoRoot, 'packages/database'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
