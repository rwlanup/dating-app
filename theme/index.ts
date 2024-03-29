import { Color, createTheme } from '@mui/material';
import { surfacesTheme } from './surfacesTheme';
import { inputsTheme } from './inputsTheme';
import { dataDisplayTheme } from './dataDisplayTheme';
import { layoutsTheme } from './layoutsTheme';
import { feedbackTheme } from './feedbackTheme';
import { navigationTheme } from './navigationTheme';

declare module '@mui/material/styles' {
  interface PaletteColor extends Color {}
  interface SimplePaletteColorOptions {}
}

const baseTheme = createTheme({
  typography: {
    fontFamily: [
      'Cabin',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      '"Noto Sans"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(','),
    fontWeightMedium: 600,
    fontWeightRegular: 400,
    fontWeightBold: 700,
    button: {
      textTransform: 'none',
      fontSize: '1rem',
    },
  },

  shape: {
    borderRadius: 6,
  },

  palette: {
    common: {
      white: '#ffffff',
      black: '#080104',
    },

    text: {
      primary: '#080104',
      disabled: '#94a3b8',
      secondary: '#64748b',
    },

    primary: {
      main: '#db2777',
      light: '#f9a8d4',
      dark: '#9d174d',
      contrastText: '#ffffff',
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
    },

    secondary: {
      main: '#9333ea',
      light: '#d8b4fe',
      dark: '#6b21a8',
      contrastText: '#ffffff',
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },

    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#fff',
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },

    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#fff',
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
});

export const theme = createTheme(
  baseTheme,
  inputsTheme(baseTheme),
  dataDisplayTheme(baseTheme),
  surfacesTheme(baseTheme),
  layoutsTheme(baseTheme),
  feedbackTheme(baseTheme),
  navigationTheme(baseTheme)
);
