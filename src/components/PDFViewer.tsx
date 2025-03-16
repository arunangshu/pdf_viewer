import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress, Typography, Paper, IconButton, Slider, TextField, Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

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
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
  marginTop: theme.spacing(2),
  backgroundColor: 'rgba(26, 26, 46, 0.7)',
  borderRadius: theme.shape.borderRadius,
  gap: theme.spacing(2),
}));

const ZoomSlider = styled(Slider)(({ theme }) => ({
  width: 150,
  color: theme.palette.primary.main,
  '& .MuiSlider-thumb': {
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiSlider-track': {
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(0, 191, 255, 0.3)',
  },
}));

const PageInput = styled(TextField)(({ theme }) => ({
  width: 70,
  '& .MuiInputBase-input': {
    color: theme.palette.primary.main,
    textAlign: 'center',
    padding: theme.spacing(0.5, 1),
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(0, 191, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: 'rgba(26, 26, 46, 0.5)',
  '&:hover': {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
  },
  '&.Mui-disabled': {
    color: 'rgba(0, 191, 255, 0.3)',
  },
}));

interface PDFViewerProps {
  file: File | null;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageInputValue, setPageInputValue] = useState<string>("1");
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Function to handle iframe load event
  const handleIframeLoad = () => {
    setLoading(false);
    try {
      // Try to get the total pages from the iframe
      if (iframeRef.current && iframeRef.current.contentWindow) {
        // We'll use a polling mechanism to wait for the PDF to load
        const checkPDFLoaded = setInterval(() => {
          const doc = iframeRef.current?.contentDocument;
          if (doc) {
            // Look for page indicators in the PDF viewer
            const pageIndicators = doc.querySelectorAll('.page');
            if (pageIndicators.length > 0) {
              setTotalPages(pageIndicators.length);
              clearInterval(checkPDFLoaded);
            }
          }
        }, 1000);

        // Clear the interval after 10 seconds to prevent infinite polling
        setTimeout(() => clearInterval(checkPDFLoaded), 10000);
      }
    } catch (error) {
      console.error('Error accessing iframe content:', error);
    }
  };

  // Function to handle zoom in
  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 10, 200));
  };

  // Function to handle zoom out
  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 10, 50));
  };

  // Function to handle zoom change from slider
  const handleZoomChange = (_event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  // Function to handle page input change
  const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputValue(event.target.value);
  };

  // Function to go to a specific page
  const goToPage = () => {
    const pageNum = parseInt(pageInputValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          // Try to navigate to the specific page
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            const pageElement = doc.querySelector(`.page[data-page-number="${pageNum}"]`);
            if (pageElement) {
              pageElement.scrollIntoView();
            }
          }
        }
      } catch (error) {
        console.error('Error navigating to page:', error);
      }
    }
  };

  // Function to handle next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      setPageInputValue((currentPage + 1).toString());
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            const pageElement = doc.querySelector(`.page[data-page-number="${currentPage + 1}"]`);
            if (pageElement) {
              pageElement.scrollIntoView();
            }
          }
        }
      } catch (error) {
        console.error('Error navigating to next page:', error);
      }
    }
  };

  // Function to handle previous page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      setPageInputValue((currentPage - 1).toString());
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            const pageElement = doc.querySelector(`.page[data-page-number="${currentPage - 1}"]`);
            if (pageElement) {
              pageElement.scrollIntoView();
            }
          }
        }
      } catch (error) {
        console.error('Error navigating to previous page:', error);
      }
    }
  };

  // Handle Enter key press in page input
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      goToPage();
    }
  };

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
          <>
            <Paper
              elevation={24}
              sx={{
                width: '100%',
                height: '80vh',
                backgroundColor: '#24243e',
                borderRadius: 2,
                border: '1px solid rgba(0, 191, 255, 0.1)',
                overflow: 'hidden',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center top',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              <StyledIframe 
                ref={iframeRef}
                src={`${fileUrl}#toolbar=0&navpanes=0`} 
                title="PDF Viewer"
                onLoad={handleIframeLoad}
              />
            </Paper>

            <ControlsContainer>
              <Tooltip title="Zoom Out">
                <ControlButton onClick={handleZoomOut} disabled={zoom <= 50}>
                  <ZoomOutIcon />
                </ControlButton>
              </Tooltip>
              
              <ZoomSlider
                value={zoom}
                onChange={handleZoomChange}
                min={50}
                max={200}
                step={10}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${value}%`}
              />
              
              <Tooltip title="Zoom In">
                <ControlButton onClick={handleZoomIn} disabled={zoom >= 200}>
                  <ZoomInIcon />
                </ControlButton>
              </Tooltip>

              <Box sx={{ mx: 2, height: '100%', width: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

              <Tooltip title="Previous Page">
                <ControlButton onClick={handlePrevPage} disabled={currentPage <= 1}>
                  <NavigateBeforeIcon />
                </ControlButton>
              </Tooltip>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PageInput
                  value={pageInputValue}
                  onChange={handlePageInputChange}
                  onKeyPress={handleKeyPress}
                  size="small"
                  variant="outlined"
                  inputProps={{ min: 1, max: totalPages }}
                />
                <Typography color="primary">/ {totalPages}</Typography>
              </Box>
              
              <Tooltip title="Next Page">
                <ControlButton onClick={handleNextPage} disabled={currentPage >= totalPages}>
                  <NavigateNextIcon />
                </ControlButton>
              </Tooltip>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="small" 
                onClick={goToPage}
                sx={{ ml: 1 }}
              >
                Go
              </Button>
            </ControlsContainer>
          </>
        )}
      </PDFContainer>
    </ViewerContainer>
  );
};

export default PDFViewer; 