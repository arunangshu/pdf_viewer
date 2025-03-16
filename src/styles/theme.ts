import { createTheme } from '@mui/material/styles';

// Theme based on "Dark Mode with Neon Accents"
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00BFFF', // Bright neon teal
    },
    secondary: {
      main: '#1A1A2E', // Deep navy blue
    },
    background: {
      default: '#1A1A2E', // Deep navy blue for backgrounds
      paper: '#24243e', // Slightly lighter than the background
    },
    text: {
      primary: '#EAEAEA', // Light gray for primary text
      secondary: '#B0B0B0', // Dark gray for secondary text
    },
    error: {
      main: '#FF4C4C', // Bright red for error messages
    },
    success: {
      main: '#4CAF50', // Bright green for success messages
    },
  },
  typography: {
    fontFamily: '"Roboto", "Poppins", sans-serif',
    h1: {
      fontSize: '24px',
      fontWeight: 700,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 700,
    },
    h3: {
      fontSize: '18px',
      fontWeight: 700,
    },
    body1: {
      fontSize: '16px',
    },
    body2: {
      fontSize: '14px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 191, 255, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0, 191, 255, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: '#B0B0B0',
            },
            '&:hover fieldset': {
              borderColor: '#00BFFF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00BFFF',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#B0B0B0',
          },
        },
      },
    },
  },
});

export default theme; 