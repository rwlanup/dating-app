import type { Theme, ThemeOptions } from '@mui/material';
import type {} from '@mui/lab/themeAugmentation';

export const inputsTheme = (theme: Theme): ThemeOptions => {
  return {
    components: {
      MuiTextField: {
        defaultProps: {
          fullWidth: true,
        },
      },

      MuiSelect: {
        defaultProps: {
          fullWidth: true,
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            display: 'inline-block',
            marginBottom: theme.spacing(0.5),
          },
        },
      },

      MuiButtonBase: {
        styleOverrides: {
          root: {
            '&:focus': {
              boxShadow: `0 0 0 4px ${theme.palette.grey[200]}!important`,
            },
          },
        },
      },

      MuiFormHelperText: {
        defaultProps: {
          variant: 'standard',
        },
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
          disableFocusRipple: true,
          variant: 'contained',
        },
        styleOverrides: {
          root: {
            padding: theme.spacing(1, 4),
            borderRadius: 9999,
          },
        },
      },

      MuiLoadingButton: {
        defaultProps: {
          disableElevation: true,
          disableFocusRipple: true,
          variant: 'contained',
        },
      },
    },
  };
};
