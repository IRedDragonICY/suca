import { createTheme } from '@mui/material/styles';

// Modern Material You (Material 3) theme with enhanced aesthetics
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4',
      light: '#E8DEF8',
      dark: '#21005D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71',
      light: '#E8DEF8',
      dark: '#1D192B',
      contrastText: '#FFFFFF',
    },

    error: {
      main: '#BA1A1A',
      light: '#F9DEDC',
      dark: '#93000A',
    },
    warning: {
      main: '#825500',
      light: '#F7BC1C',
      dark: '#412D00',
    },
    info: {
      main: '#006A6B',
      light: '#97F0F1',
      dark: '#004F50',
    },
    success: {
      main: '#006E1C',
      light: '#6EE547',
      dark: '#004711',
    },
    background: {
      default: '#FEF7FF',
      paper: '#FFFBFE',
    },
    text: {
      primary: '#1C1B1F',
      secondary: '#49454F',
    },
    action: {
      hover: 'rgba(103, 80, 164, 0.08)',
      selected: 'rgba(103, 80, 164, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 400,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 400,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: '0.02em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.43,
      letterSpacing: '0.02em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.03em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.43,
      letterSpacing: '0.1em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.33,
      letterSpacing: '0.03em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 1.33,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 24,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 28px',
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(103, 80, 164, 0.2)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6750A4 0%, #7C4DFF 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5A47A6 0%, #6B3FE6 100%)',
            boxShadow: '0px 4px 12px rgba(103, 80, 164, 0.3)',
          },
        },
        outlined: {
          border: '2px solid',
          '&:hover': {
            border: '2px solid',
            background: 'rgba(103, 80, 164, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0px 2px 16px rgba(103, 80, 164, 0.08)',
          border: '1px solid rgba(103, 80, 164, 0.12)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 8px 32px rgba(103, 80, 164, 0.16)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6750A4',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: '#6750A4',
                boxShadow: '0 0 0 4px rgba(103, 80, 164, 0.1)',
              },
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 16px rgba(103, 80, 164, 0.08)',
        },
        elevation4: {
          boxShadow: '0px 8px 32px rgba(103, 80, 164, 0.12)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          letterSpacing: '0.02em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Dark theme variant with enhanced Material You aesthetics
export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF',
      light: '#E8DEF8',
      dark: '#381E72',
      contrastText: '#1C1B1F',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#E8DEF8',
      dark: '#332D41',
      contrastText: '#1C1B1F',
    },
    error: {
      main: '#F2B8B5',
      light: '#F9DEDC',
      dark: '#8C1D18',
    },
    warning: {
      main: '#F9D71C',
      light: '#FFF9C4',
      dark: '#412D00',
    },
    info: {
      main: '#97F0F1',
      light: '#B3E5FC',
      dark: '#004F50',
    },
    success: {
      main: '#6EE547',
      light: '#C8E6C9',
      dark: '#004711',
    },
    background: {
      default: '#1C1B1F',
      paper: '#2B2930',
    },
    text: {
      primary: '#E6E1E5',
      secondary: '#CAC4D0',
    },
    action: {
      hover: 'rgba(208, 188, 255, 0.08)',
      selected: 'rgba(208, 188, 255, 0.12)',
    },
  },
  components: {
    ...theme.components,
    MuiButton: {
      styleOverrides: {
        ...theme.components?.MuiButton?.styleOverrides,
        contained: {
          background: 'linear-gradient(135deg, #D0BCFF 0%, #CCC2DC 100%)',
          color: '#1C1B1F',
          '&:hover': {
            background: 'linear-gradient(135deg, #B9A7FF 0%, #B5ABCB 100%)',
            boxShadow: '0px 4px 12px rgba(208, 188, 255, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.6)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#D0BCFF',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: '#D0BCFF',
                boxShadow: '0 0 0 4px rgba(208, 188, 255, 0.1)',
              },
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.3)',
        },
        elevation4: {
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
    },
  },
}); 