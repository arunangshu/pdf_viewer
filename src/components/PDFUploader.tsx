import React, { useState, useRef } from 'react';
import { Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { usePDF } from '../contexts/PDFContext';

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

const PDFUploader: React.FC = () => {
  const { addPDF, loading } = usePDF();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      if (!file.type.includes('pdf')) {
        setNotification({
          open: true,
          message: 'Only PDF files are supported',
          type: 'error',
        });
        return;
      }

      await addPDF(file);
      setNotification({
        open: true,
        message: 'PDF uploaded successfully',
        type: 'success',
      });
    } catch (err: any) {
      setNotification({
        open: true,
        message: err.message || 'Failed to upload PDF',
        type: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <UploadBox
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isDragging ? '0 0 10px rgba(0, 191, 255, 0.5)' : 'none',
        }}
      >
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <>
            <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6" component="div" gutterBottom>
              Drag & Drop your PDF file here
            </Typography>
            <Typography variant="body2" color="textSecondary">
              or click to browse files
            </Typography>
            <VisuallyHiddenInput
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </>
        )}
      </UploadBox>

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
    </>
  );
};

export default PDFUploader; 