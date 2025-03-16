import React, { useState, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from './styles/theme';
import GlobalStyles from './styles/globalStyles';
import Header from './components/Header';
import PDFViewer from './components/PDFViewer';

const MainContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  paddingTop: theme.spacing(2),
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const UploadBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `2px dashed ${theme.palette.primary.main}`,
  backgroundColor: 'rgba(0, 191, 255, 0.05)',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    transform: 'scale(1.02)',
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const App: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setShowViewer(true);
      setNotification({
        open: true,
        message: 'PDF uploaded successfully',
        type: 'success',
      });
    } else {
      setNotification({
        open: true,
        message: 'Please upload a PDF file',
        type: 'error',
      });
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <Header />
      <MainContainer maxWidth="lg">
        <Section>
          <SectionTitle variant="h5">Upload PDF</SectionTitle>
          <UploadBox
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            sx={{
              transform: isDragging ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isDragging ? '0 0 10px rgba(0, 191, 255, 0.5)' : 'none',
            }}
          >
            <Typography variant="h6" component="div" gutterBottom>
              Drag & Drop your PDF file here
            </Typography>
            <Typography variant="body2" color="textSecondary">
              or click to browse files
            </Typography>
            <VisuallyHiddenInput
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
            />
          </UploadBox>
        </Section>

        {pdfFile && (
          <Section>
            <SectionTitle variant="h5">Selected PDF: {pdfFile.name}</SectionTitle>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setShowViewer(true)}
            >
              View PDF
            </Button>
          </Section>
        )}
      </MainContainer>

      {showViewer && pdfFile && (
        <PDFViewer file={pdfFile} onClose={handleCloseViewer} />
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
