import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const ViewerContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  zIndex: 1300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

const PDFContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '90%',
  width: '90%',
  position: 'relative',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 20,
  right: 20,
  color: theme.palette.primary.main,
  backgroundColor: 'rgba(26, 26, 46, 0.7)',
  '&:hover': {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
  },
}));

const StyledIframe = styled('iframe')(({ theme }) => ({
  width: '100%',
  height: '100%',
  border: 'none',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#24243e',
}));

interface PDFViewerProps {
  file: File | null;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress color="primary" />
            <Typography color="primary">Loading PDF...</Typography>
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