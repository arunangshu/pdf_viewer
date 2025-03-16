import React, { useState, useRef, useEffect } from 'react';
import { CssBaseline, Container, Box, Typography, Button, Snackbar, Alert, Tabs, Tab, IconButton, Paper } from '@mui/material';
import { styled, alpha, useTheme as useMuiTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import GlobalStyles from './styles/globalStyles';
import Header from './components/Header';
import PDFViewer from './components/PDFViewer';
import PDFLibrary from './components/PDFLibrary';
import pdfDatabaseService from './services/pdfDatabase';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import BackgroundAnimation from './components/BackgroundAnimation';

const MainContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  paddingTop: theme.spacing(2),
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.primary.dark,
  fontWeight: 600,
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -5,
    left: 0,
    width: '100%',
    height: 2,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(90deg, #00BFFF, transparent)'
      : 'linear-gradient(90deg, #0D47A1, transparent)',
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius * 2,
  border: `2px dashed ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(36, 36, 62, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
    : '0 4px 20px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out, box-shadow 0.5s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at center, ${theme.palette.primary.main}10, transparent 70%)`,
    opacity: 0,
    transition: 'opacity 0.5s ease',
    zIndex: 0,
  },
  '&:hover': {
    borderColor: theme.palette.primary.light,
    boxShadow: `0 0 30px ${theme.palette.primary.main}60`,
    transform: 'translateY(-5px)',
    '&::before': {
      opacity: 0.2,
    },
  },
}));

const UploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: 60,
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  filter: theme.palette.mode === 'dark'
    ? 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.5))'
    : 'drop-shadow(0 0 8px rgba(13, 71, 161, 0.5))',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pdf-tabpanel-${index}`}
      aria-labelledby={`pdf-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

// Theme toggle button component
const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  
  return (
    <IconButton 
      onClick={toggleTheme} 
      color="inherit"
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        backgroundColor: 'primary.main',
        color: 'white',
        boxShadow: 3,
        zIndex: 1000,
        '&:hover': {
          backgroundColor: 'primary.dark',
        }
      }}
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};

const AppContent: React.FC = () => {
  const { mode } = useTheme();
  const theme = useMuiTheme();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });
  const [tabValue, setTabValue] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type === 'application/pdf') {
      setPdfFile(file);
      setShowViewer(true);
      
      // Save to database
      try {
        await pdfDatabaseService.addPDF(file);
        setNotification({
          open: true,
          message: 'PDF uploaded and saved to library',
          type: 'success',
        });
      } catch (error) {
        console.error('Error saving PDF to database:', error);
        setNotification({
          open: true,
          message: 'PDF uploaded but could not be saved to library',
          type: 'error',
        });
      }
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

  const handleSelectFromLibrary = (file: File) => {
    setPdfFile(file);
    setShowViewer(true);
  };

  return (
    <>
      <CssBaseline />
      <GlobalStyles />
      <BackgroundAnimation />
      <Header />
      <MainContainer maxWidth="lg">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth" 
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Upload PDF" />
          <Tab label="PDF Library" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Section>
            <SectionTitle variant="h5">Upload PDF</SectionTitle>
            <UploadBox
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={isDragging ? 'dragging' : ''}
            >
              <CloudUploadIcon 
                sx={{ 
                  fontSize: 60, 
                  color: 'primary.main',
                  mb: 2,
                  filter: theme => theme.palette.mode === 'dark' 
                    ? 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.5))'
                    : 'drop-shadow(0 0 8px rgba(13, 71, 161, 0.5))',
                  position: 'relative',
                  zIndex: 1
                }} 
              />
              <Typography variant="h6" component="div" gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
                Drag & Drop your PDF file here
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ position: 'relative', zIndex: 1 }}>
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
            <Section className="slide-up">
              <SectionTitle variant="h5">Selected PDF: {pdfFile.name}</SectionTitle>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setShowViewer(true)}
                sx={{ mt: 2 }}
              >
                View PDF
              </Button>
            </Section>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PDFLibrary onSelectPDF={handleSelectFromLibrary} />
        </TabPanel>
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
      
      <ThemeToggle />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
