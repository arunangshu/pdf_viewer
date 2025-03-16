import React from 'react';
import { GlobalStyles as MuiGlobalStyles } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

const GlobalStyles: React.FC = () => {
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';
  
  return (
    <MuiGlobalStyles
      styles={{
        // Base styles
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        'html, body': {
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0)',
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        'body': {
          lineHeight: 1.6,
          overflowX: 'hidden',
          transition: 'all 0.3s ease',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        
        // Custom scrollbar
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-thumb': {
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(0, 191, 255, 0.5), rgba(0, 150, 255, 0.5))' 
            : 'linear-gradient(135deg, rgba(0, 191, 255, 0.3), rgba(0, 150, 255, 0.3))',
          borderRadius: '10px',
          transition: 'all 0.3s ease',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(0, 191, 255, 0.7), rgba(0, 150, 255, 0.7))' 
            : 'linear-gradient(135deg, rgba(0, 191, 255, 0.5), rgba(0, 150, 255, 0.5))',
        },
        
        // Animations
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        '@keyframes slideInUp': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        
        // Animation classes
        '.fade-in': {
          animation: 'fadeIn 0.3s ease forwards',
        },
        '.slide-up': {
          animation: 'slideInUp 0.3s ease forwards',
        },
        '.pulse': {
          animation: 'pulse 2s infinite',
        },
        
        // Background patterns
        'body::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: isDarkMode 
            ? 'radial-gradient(circle at 90% 10%, rgba(0, 191, 255, 0.1), transparent 20%), radial-gradient(circle at 10% 90%, rgba(0, 191, 255, 0.1), transparent 20%)'
            : 'radial-gradient(circle at 90% 10%, rgba(0, 191, 255, 0.05), transparent 20%), radial-gradient(circle at 10% 90%, rgba(0, 191, 255, 0.05), transparent 20%)',
          backgroundAttachment: 'fixed',
          zIndex: -1,
          pointerEvents: 'none',
        },
        
        // Drag and drop styles
        '.dragging': {
          borderColor: '#33CCFF !important',
          boxShadow: '0 0 30px rgba(0, 191, 255, 0.6) !important',
          transform: 'scale(1.02) !important',
        },
        '.dragging::before': {
          opacity: '0.3 !important',
        },
      }}
    />
  );
};

export default GlobalStyles; 