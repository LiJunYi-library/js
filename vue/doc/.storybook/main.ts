import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  // stories: ['../src/**/*.stories.(js|jsx|ts|tsx|mdx)'],
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)' ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  // core: {
  //   builder: 'webpack5',
  // },
  viteFinal: async (config, { configType }) => {
    if(!config.optimizeDeps) return config;
    if(!config.optimizeDeps.include) return config;
    config.optimizeDeps.include = [
      ...config.optimizeDeps.include,
      'some-dependency',
    ];

    return config;
  },
}
export default config
