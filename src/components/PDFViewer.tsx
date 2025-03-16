import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '../contexts/ThemeContext';

const ViewerContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(0, 0, 0, 0.9)'
    : 'rgba(0, 0, 0, 0.21)',
  backdropFilter: 'blur(5px)',
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
}));

const PDFContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '90%',
  width: '90%',
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 0 30px rgba(0, 0, 0, 0.5)'
    : '0 0 30px rgba(255, 255, 255, 0.3)',
  overflow: 'hidden',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: 20,
  color: 'white',
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(26, 26, 46, 0.7)'
    : 'rgba(26, 118, 255, 0.7)',
  borderRadius: '50%',
  padding: theme.spacing(1),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(26, 26, 46, 0.9)'
      : 'rgba(13, 71, 161, 0.9)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.2s ease',
}));

const StyledIframe = styled('iframe')(({ theme }) => ({
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' 
    ? '#24243e' 
    : '#f5f5f5',
  transition: 'background-color 0.3s ease',
}));

interface PDFViewerProps {
  file: File | null;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { mode } = useTheme();

  useEffect(() => {
    if (file) {
      // Create a URL for the file
      const url = URL.createObjectURL(file);
      console.log('Created URL for PDF:', url);
      setFileUrl(url);
      setLoading(false);
      
      // Clean up the URL when the component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  if (!file || !fileUrl) {
    return null;
  }

  return (
    <ViewerContainer>
      <CloseButton onClick={onClose} aria-label="close">
        <CloseIcon />
      </CloseButton>

      <PDFContainer>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            padding: 4,
            backgroundColor: mode === 'dark' ? 'rgba(36, 36, 62, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)'
          }}>
            <CircularProgress color="primary" />
            <Typography variant="body1" color="primary">Loading PDF...</Typography>
          </Box>
        ) : (
          <StyledIframe 
            src={fileUrl} 
            title="PDF Viewer"
            onLoad={() => setLoading(false)}
          />
        )}
      </PDFContainer>
    </ViewerContainer>
  );
};

export default PDFViewer; 