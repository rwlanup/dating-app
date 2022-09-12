import type { Theme, ThemeOptions } from '@mui/material';

export const surfacesTheme = (theme: Theme): ThemeOptions => {
  return {
    components: {
      MuiAppBar: {
        defaultProps: {
          variant: 'outlined',
        },
        variants: [
          {
            props: { variant: 'outlined' },
            style: {
              borderTopWidth: 0,
              borderRightWidth: 0,
              borderLeftWidth: 0,
            },
          },
        ],
      },
    },
  };
};
