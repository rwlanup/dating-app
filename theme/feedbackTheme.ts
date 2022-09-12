import { Theme, ThemeOptions } from '@mui/material';

export const feedbackTheme = (theme: Theme): ThemeOptions => ({
  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(4, 3),
        },
      },
    },
  },
});
