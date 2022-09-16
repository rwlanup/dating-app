import { Theme, ThemeOptions } from '@mui/material';

export const navigationTheme = (theme: Theme): ThemeOptions => ({
  components: {
    MuiLink: {
      defaultProps: {
        variant: 'body',
        underline: 'hover',
        fontWeight: theme.typography.fontWeightMedium,
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:focus': {
            boxShadow: 'none !important',
          },
        },
      },
    },
  },
});
