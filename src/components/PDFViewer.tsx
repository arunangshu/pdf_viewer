import React, { useEffect, useState } from 'react';
import { Box, IconButton, CircularProgress, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { usePDF } from '../contexts/PDFContext';

// Configure PDF.js worker
// Use a fixed URL that we know is reliable
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

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

const NavButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  gap: theme.spacing(2),
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

const PageInfo = styled(Typography)(({ theme }) => ({
  backgroundColor: 'rgba(26, 26, 46, 0.7)',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.primary.main,
}));

const NavigationButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: 'rgba(26, 26, 46, 0.7)',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
  },
  '&.Mui-disabled': {
    color: 'rgba(0, 191, 255, 0.3)',
  },
}));

interface PDFViewerProps {
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ onClose }) => {
  const { currentPDF, loading } = usePDF();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfData, setPdfData] = useState<{ data: ArrayBuffer } | null>(null);

  useEffect(() => {
    if (currentPDF) {
      console.log('Current PDF:', currentPDF);
      setPdfData({ data: currentPDF.data });
    }
  }, [currentPDF]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handlePrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  const handleNextPage = () => {
    if (numPages) {
      setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
    }
  };

  const handleClose = () => {
    setPdfData(null);
    onClose();
  };

  if (!currentPDF || !pdfData) {
    return null;
  }

  console.log('PDF Data:', pdfData);

  return (
    <ViewerContainer>
      <CloseButton onClick={handleClose} aria-label="close">
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
                maxHeight: '80vh',
                overflow: 'auto',
                backgroundColor: '#24243e',
                borderRadius: 2,
                border: '1px solid rgba(0, 191, 255, 0.1)',
              }}
            >
              <Document
                file={pdfData}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<CircularProgress color="primary" />}
                error={
                  <Typography color="error" align="center">
                    Failed to load PDF file. Please try again.
                  </Typography>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  scale={1.2}
                  loading={<CircularProgress color="primary" />}
                />
              </Document>
            </Paper>

            <NavButtons>
              <NavigationButton
                onClick={handlePrevPage}
                disabled={pageNumber <= 1}
                aria-label="previous page"
              >
                <ChevronLeftIcon />
              </NavigationButton>

              <PageInfo variant="body2">
                Page {pageNumber} of {numPages}
              </PageInfo>

              <NavigationButton
                onClick={handleNextPage}
                disabled={numPages !== null && pageNumber >= numPages}
                aria-label="next page"
              >
                <ChevronRightIcon />
              </NavigationButton>
            </NavButtons>
          </>
        )}
      </PDFContainer>
    </ViewerContainer>
  );
};

export default PDFViewer; 