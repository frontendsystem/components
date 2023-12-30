const path = require('path');

const convertTsConfigPathsToWebpackAliases = () => {
  const rootDir = path.resolve(__dirname, '../');
  const tsconfig = require('../tsconfig.json');
  const tsconfigPaths = Object.entries(tsconfig.compilerOptions.paths);

  return tsconfigPaths.reduce((aliases, [realPath, mappedPath]) => {
    aliases[realPath] = path.join(rootDir, mappedPath[0]);
    return aliases;
  }, {});
};

module.exports = {
  stories: ['../packages/components/**/*.stories.tsx', '../packages/core/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-storysource',
    {
      name: '@storybook/addon-styling',
      options: {
        postCss: true,
      },
    },
  ],

  webpackFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        ...convertTsConfigPathsToWebpackAliases(),
      },
    },
  }),

  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),

    options: {
      strictMode: true,
    },
  },

  docs: {
    autodocs: true,
  },
};

function getAbsolutePath(value) {
  return path.resolve(require.resolve(value), '..');
}
