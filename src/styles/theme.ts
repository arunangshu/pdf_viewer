import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Define custom theme properties for light and dark modes
const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  // Color definitions
  const darkPrimary = '#00BFFF'; // Bright teal for dark mode
  const lightPrimary = '#0D47A1'; // Navy blue for light mode
  
  return {
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? darkPrimary : lightPrimary,
        light: mode === 'dark' ? '#33CCFF' : '#2962FF',
        dark: mode === 'dark' ? '#0099CC' : '#002171',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: mode === 'dark' ? '#1A1A2E' : '#E3F2FD',
        light: mode === 'dark' ? '#24243e' : '#FFFFFF',
        dark: mode === 'dark' ? '#12121e' : '#BBDEFB',
        contrastText: mode === 'dark' ? '#FFFFFF' : '#000000',
      },
      background: {
        default: 'rgba(0, 0, 0, 0)',
        paper: mode === 'dark' ? '#000000' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#EAEAEA' : '#333333',
        secondary: mode === 'dark' ? '#B0B0B0' : '#666666',
      },
      error: {
        main: mode === 'dark' ? '#FF4C4C' : '#FF5252',
      },
      success: {
        main: '#4CAF50',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.01562em',
        color: mode === 'dark' ? '#EAEAEA' : '#333333',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.00833em',
        color: mode === 'dark' ? '#EAEAEA' : '#333333',
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        letterSpacing: '0em',
        color: mode === 'dark' ? '#EAEAEA' : '#333333',
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '0.00735em',
        color: mode === 'dark' ? '#EAEAEA' : '#333333',
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        letterSpacing: '0em',
        color: mode === 'dark' ? '#EAEAEA' : '#333333',
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        letterSpacing: '0.0075em',
        color: mode === 'dark' ? '#EAEAEA' : '#333333',
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        letterSpacing: '0.00938em',
        color: mode === 'dark' ? '#EAEAEA' : '#333333',
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        letterSpacing: '0.01071em',
        color: mode === 'dark' ? '#B0B0B0' : '#666666',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        letterSpacing: '0.03333em',
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: mode === 'dark' 
              ? '#1A1A2E'
              : '#FFFFFF',
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? 'rgba(36, 36, 62, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            boxShadow: mode === 'dark'
              ? '0 4px 20px rgba(0, 0, 0, 0.5)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)',
            borderTop: mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.5)',
            borderLeft: mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.5)',
            transition: 'all 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          },
          contained: {
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #00BFFF, #0095DA)'
              : 'linear-gradient(135deg, #0D47A1, #1976D2)',
            '&:hover': {
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #33CCFF, #00BFFF)'
                : 'linear-gradient(135deg, #1976D2, #0D47A1)',
              boxShadow: mode === 'dark'
                ? '0 4px 15px rgba(0, 191, 255, 0.4)'
                : '0 4px 15px rgba(13, 71, 161, 0.4)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            color: mode === 'dark' ? '#B0B0B0' : '#666666',
            '&.Mui-selected': {
              color: mode === 'dark' ? darkPrimary : lightPrimary,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: mode === 'dark' ? '#4a4a5e' : '#B0B0B0',
              },
              '&:hover fieldset': {
                borderColor: mode === 'dark' ? darkPrimary : lightPrimary,
              },
              '&.Mui-focused fieldset': {
                borderColor: mode === 'dark' ? darkPrimary : lightPrimary,
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#EAEAEA' : '#333333',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#EAEAEA' : '#333333',
          },
        },
      },
    },
  };
};

// Create the themes
export const darkTheme = createTheme(getDesignTokens('dark'));
export const lightTheme = createTheme(getDesignTokens('light'));

// Default theme for backward compatibility
const theme = darkTheme;
export default theme; 