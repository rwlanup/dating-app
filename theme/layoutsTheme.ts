import type { Theme, ThemeOptions } from '@mui/material';

export const layoutsTheme = (theme: Theme): ThemeOptions => ({
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
    },
  },
});
