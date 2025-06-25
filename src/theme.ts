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
      main: '#F7BC1C',
      light: '#FFF9C4',
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
      focus: 'rgba(103, 80, 164, 0.12)',
    },
    divider: 'rgba(28, 27, 31, 0.12)',
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
      letterSpacing: '0.02em',
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
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          fontSize: '0.875rem',
          letterSpacing: '0.02em',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 1px 4px rgba(103, 80, 164, 0.2)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 2px 8px rgba(103, 80, 164, 0.3)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            background: 'rgba(103, 80, 164, 0.08)',
          },
        },
        sizeLarge: {
          padding: '12px 28px',
          fontSize: '0.95rem',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(103, 80, 164, 0.12)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
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
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#49454F',
            '&.Mui-focused': {
              color: '#6750A4',
            },
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
        elevation0: {
          border: '1px solid rgba(28, 27, 31, 0.12)',
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid transparent',
          '&:hover': {
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            backgroundColor: 'rgba(103, 80, 164, 0.08)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          letterSpacing: '0.02em',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: 48,
          '&:hover': {
            color: '#6750A4',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: 'rgba(103, 80, 164, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderBottom: '1px solid rgba(28, 27, 31, 0.12)',
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(28, 27, 31, 0.12)',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          '&.Mui-expanded': {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(28, 27, 31, 0.12)',
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
      contrastText: '#381E72',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#E8DEF8',
      dark: '#332D41',
      contrastText: '#332D41',
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
      default: '#141218',
      paper: '#1C1B1F',
    },
    text: {
      primary: '#E6E1E5',
      secondary: '#CAC4D0',
    },
    action: {
      hover: 'rgba(208, 188, 255, 0.08)',
      selected: 'rgba(208, 188, 255, 0.12)',
      focus: 'rgba(208, 188, 255, 0.12)',
    },
    divider: 'rgba(230, 225, 229, 0.12)',
  },
  components: {
    ...theme.components,
    MuiButton: {
      styleOverrides: {
        ...theme.components?.MuiButton?.styleOverrides,
        contained: {
          backgroundColor: '#D0BCFF',
          color: '#381E72',
          '&:hover': {
            backgroundColor: '#E8DEF8',
            boxShadow: '0px 2px 8px rgba(208, 188, 255, 0.3)',
          },
        },
        outlined: {
          borderColor: '#938F99',
          color: '#D0BCFF',
          '&:hover': {
            borderColor: '#D0BCFF',
            backgroundColor: 'rgba(208, 188, 255, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid rgba(230, 225, 229, 0.12)',
          backgroundColor: '#1C1B1F',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: '#1C1B1F',
        },
        elevation0: {
          border: '1px solid rgba(230, 225, 229, 0.12)',
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&:hover': {
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)',
          },
        },
        outlined: {
          borderColor: '#938F99',
          '&:hover': {
            backgroundColor: 'rgba(208, 188, 255, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(230, 225, 229, 0.12)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(230, 225, 229, 0.12)',
          backgroundColor: '#1C1B1F',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(230, 225, 229, 0.12)',
        },
      },
    },
  },
}); 