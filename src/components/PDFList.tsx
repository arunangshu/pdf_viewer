import React from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import PDFCard from './PDFCard';
import { usePDF } from '../contexts/PDFContext';

const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  minHeight: '300px',
  borderRadius: '12px',
  backgroundColor: 'rgba(0, 191, 255, 0.05)',
  border: `1px dashed ${theme.palette.primary.main}`,
}));

const PDFList: React.FC = () => {
  const { pdfFiles, loading, error, viewPDF, downloadPDF, deletePDF } = usePDF();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', color: 'error.main', padding: 3 }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (pdfFiles.length === 0) {
    return (
      <EmptyStateContainer>
        <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
          No PDF Files Yet
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          Upload your first PDF by dragging and dropping it in the upload area above.
        </Typography>
      </EmptyStateContainer>
    );
  }

  return (
    <Grid container spacing={3}>
      {pdfFiles.map((pdf) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={pdf.id}>
          <PDFCard
            pdf={pdf}
            onView={viewPDF}
            onDownload={downloadPDF}
            onDelete={deletePDF}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PDFList; 