import { Theme, ThemeOptions } from '@mui/material';
import type React from 'react';

// Update the Typography's variant prop options
declare module '@mui/material/Skeleton' {
  interface SkeletonPropsVariantOverrides {
    pill: true;
  }

  interface SkeletonClasses {
    pill: string;
  }
}

export const feedbackTheme = (theme: Theme): ThemeOptions => ({
  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(4, 3),
        },
      },
    },

    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
        variant: 'rounded',
      },
      styleOverrides: {
        text: {
          borderRadius: 6,
          transform: 'scale(1, 0.75)',
        },
        pill: {
          borderRadius: 9999,
        },
      },
    },
  },
});
