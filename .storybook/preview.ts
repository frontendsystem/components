import { withThemeByClassName } from '@storybook/addon-styling';
import { Preview } from '@storybook/react';

import '../global.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true,
    hideNoControlsWarning: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['Components', 'Utilities'],
    },
  },
  chromatic: { disable: true },
};

// to allow switching b/w light & dark themes.
export const decorators = [
  withThemeByClassName({
    themes: {
      light: '',
      dark: 'dark',
    },
    defaultTheme: 'light',
  }),
];

const preview: Preview = {
  parameters: {},
};

export default preview;
