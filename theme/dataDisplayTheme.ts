import type { Theme, ThemeOptions } from '@mui/material';
import type React from 'react';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    body: React.CSSProperties;
    subtitle: React.CSSProperties;
    content: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body?: React.CSSProperties;
    subtitle?: React.CSSProperties;
    content?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body1: false;
    body2: false;
    body: true;
    subtitle1: false;
    subtitle2: false;
    subtitle: true;
    overline: false;
    caption: false;
    content: true;
    h5: false;
    h6: false;
  }
}

export const dataDisplayTheme = (theme: Theme): ThemeOptions => {
  return {
    typography: {
      body: {
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeightRegular,
        lineHeight: 1.5,
        fontSize: '1rem',
      },

      content: {
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeightRegular,
        lineHeight: 1.5,
        fontSize: '0.875rem',
      },

      subtitle: {
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: '1.125rem',
        lineHeight: 28 / 18,
      },

      h1: {
        fontWeight: 700,
        fontSize: '1.75rem',
        lineHeight: 32 / 28,
        [theme.breakpoints.up('md')]: {
          fontSize: '3rem',
          lineHeight: 56 / 48,
        },
      },

      h2: {
        fontWeight: 700,
        fontSize: '1.5rem',
        lineHeight: 28 / 24,
        [theme.breakpoints.up('md')]: {
          fontSize: '2.75rem',
          lineHeight: 48 / 44,
        },
      },

      h3: {
        fontWeight: 700,
        fontSize: '1.375rem',
        lineHeight: 28 / 22,
        [theme.breakpoints.up('md')]: {
          fontSize: '1.75rem',
          lineHeight: 36 / 28,
        },
      },

      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
    },

    components: {
      MuiTypography: {
        styleOverrides: {
          paragraph: {
            fontSize: '1rem',
          },
        },
      },

      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.secondary.main,
          },
        },
      },
    },
  };
};
