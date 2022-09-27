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

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 'auto',
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 'auto',
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
          '&:focus': {
            boxShadow: 'none !important',
          },
        },
      },
    },
  },
});
