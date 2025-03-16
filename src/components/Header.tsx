import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useTheme } from '../contexts/ThemeContext';

const StyledAppBar = styled(AppBar)(({ theme }) => {
  const isDarkMode = theme.palette.mode === 'dark';
  return {
    background: isDarkMode
      ? 'linear-gradient(90deg, #1A1A2E, #24243e)'
      : 'linear-gradient(90deg, #FFFFFF, #F5F5F5)',
    boxShadow: isDarkMode
      ? '0 4px 20px rgba(0, 0, 0, 0.3)'
      : '0 4px 20px rgba(0, 0, 0, 0.1)',
    borderBottom: isDarkMode
      ? '1px solid rgba(0, 191, 255, 0.1)'
      : '1px solid rgba(0, 191, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    backgroundColor: alpha(
      isDarkMode ? '#1A1A2E' : '#FFFFFF',
      0.6
    ),
  };
});

const GlassyToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  padding: theme.spacing(1, 2),
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    fontSize: '32px',
    filter: 'drop-shadow(0 0 2px rgba(0, 191, 255, 0.5))',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'rotate(10deg) scale(1.1)',
    }
  },
}));

const Title = styled(Typography)(({ theme }) => {
  const isDarkMode = theme.palette.mode === 'dark';
  return {
    background: isDarkMode
      ? 'linear-gradient(90deg, #00BFFF, #0099CC)'
      : 'linear-gradient(90deg, #0088cc, #00BFFF)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 5s ease infinite',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
    letterSpacing: '1px',
    fontSize: '24px',
    textShadow: isDarkMode 
      ? '0 0 10px rgba(0, 191, 255, 0.3)' 
      : '0 0 10px rgba(0, 191, 255, 0.1)',
    '@keyframes gradientShift': {
      '0%': {
        backgroundPosition: '0% 50%'
      },
      '50%': {
        backgroundPosition: '100% 50%'
      },
      '100%': {
        backgroundPosition: '0% 50%'
      }
    },
  };
});

const Header: React.FC = () => {
  const { mode, toggleTheme } = useTheme();
  
  return (
    <StyledAppBar position="sticky">
      <GlassyToolbar>
        <Logo>
          <PictureAsPdfIcon />
          <Title variant="h6">PDF Viewer</Title>
        </Logo>
      </GlassyToolbar>
    </StyledAppBar>
  );
};

export default Header; 