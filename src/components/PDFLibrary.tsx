import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  CardMedia,
  Paper
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import pdfDatabaseService, { PDFFile } from '../services/pdfDatabase';

const LibraryContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  width: '100%',
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: theme.shape.borderRadius * 2,
  backdropFilter: 'blur(20px)',
  padding: theme.spacing(1, 2),
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.3)'
    : '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const PDFCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  backgroundColor: alpha(
    theme.palette.background.paper, 
    theme.palette.mode === 'dark' ? 0.7 : 0.8
  ),
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius * 2,
  borderTop: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(0, 0, 0, 0.1)',
  borderLeft: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.5)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 5px 20px rgba(255, 255, 255, 0.3)'
    : '0 5px 20px rgba(0, 0, 0, 0.3)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 30px rgba(0, 191, 255, 0.2)'
      : '0 12px 30px rgba(0, 103, 199, 0.57)',
  },
}));

const PDFCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const NoResultsContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  width: '100%',
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 2,
  borderTop: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.5)',
  borderLeft: theme.palette.mode === 'dark'
    ? '1px solid rgba(255, 255, 255, 0.1)'
    : '1px solid rgba(255, 255, 255, 0.5)',
}));

const PDFThumbnail = styled(CardMedia)(({ theme }) => ({
  height: 280,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: alpha(
    theme.palette.mode === 'dark' ? '#1A1A2E' : '#F5F5F5', 
    0.5
  ),
  borderBottom: `1px solid ${theme.palette.divider}`,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 20px rgba(0, 0, 0, 0.3)'
    : '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: alpha(
      theme.palette.background.paper, 
      theme.palette.mode === 'dark' ? 0.8 : 0.9
    ),
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    borderTop: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.5)',
    borderLeft: theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 30px rgba(0, 0, 0, 0.5)'
      : '0 4px 30px rgba(0, 0, 0, 0.2)',
  },
}));

// Update PDFCard text colors to ensure proper contrast
const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const CardDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}));

interface PDFLibraryProps {
  onSelectPDF: (file: File) => void;
}

const PDFLibrary: React.FC<PDFLibraryProps> = ({ onSelectPDF }) => {
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [pdfToDelete, setPdfToDelete] = useState<PDFFile | null>(null);

  // Load PDFs from database
  useEffect(() => {
    const loadPDFs = async () => {
      try {
        setLoading(true);
        const allPdfs = await pdfDatabaseService.getAllPDFs();
        setPdfs(allPdfs);
      } catch (error) {
        console.error('Error loading PDFs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPDFs();
  }, []);

  // Handle search
  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await pdfDatabaseService.searchPDFs(searchQuery);
      setPdfs(results);
    } catch (error) {
      console.error('Error searching PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF selection
  const handleSelectPDF = async (pdf: PDFFile) => {
    try {
      // Convert ArrayBuffer to File
      const file = new File([pdf.data], pdf.name, { type: 'application/pdf' });
      onSelectPDF(file);
    } catch (error) {
      console.error('Error selecting PDF:', error);
    }
  };

  // Handle PDF deletion
  const handleDeletePDF = async () => {
    if (!pdfToDelete) return;
    
    try {
      await pdfDatabaseService.deletePDF(pdfToDelete.id);
      setPdfs(pdfs.filter(pdf => pdf.id !== pdfToDelete.id));
      setDeleteDialogOpen(false);
      setPdfToDelete(null);
    } catch (error) {
      console.error('Error deleting PDF:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <LibraryContainer>
      <Typography variant="h4" gutterBottom>
        PDF Library
      </Typography>
      
      <SearchContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search PDFs by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            ),
            sx: { backgroundColor: 'transparent', backdropFilter: 'none' }
          }}
        />
      </SearchContainer>

      {loading ? (
        <LoadingContainer>
          <CircularProgress color="primary" />
        </LoadingContainer>
      ) : pdfs.length === 0 ? (
        <NoResultsContainer>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No PDFs found
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Upload a PDF to get started
          </Typography>
        </NoResultsContainer>
      ) : (
        <Grid container spacing={3} className="slide-up">
          {pdfs.map((pdf, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={pdf.id} 
              sx={{ 
                animation: `fadeIn 0.3s ease forwards ${index * 0.1}s`,
                opacity: 0
              }}
            >
              <PDFCard>
                {/* <PDFThumbnail
                  image={pdf.thumbnail || ''}
                  title={pdf.name}
                  onClick={() => handleSelectPDF(pdf)}
                  sx={{ cursor: 'pointer' }}
                /> */}
                <PDFCardContent>
                  <CardTitle variant="h6" title={pdf.name}>
                    {pdf.name}
                  </CardTitle>
                  <CardDescription variant="body2">
                    Size: {formatFileSize(pdf.size)}
                  </CardDescription>
                  <CardDescription variant="body2">
                    Added: {formatDate(pdf.created)}
                  </CardDescription>
                  {pdf.lastAccessed && (
                    <CardDescription variant="body2">
                      Last viewed: {formatDate(pdf.lastAccessed)}
                    </CardDescription>
                  )}
                </PDFCardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleSelectPDF(pdf)}
                  >
                    View
                  </Button>
                  <IconButton
                    onClick={() => {
                      setPdfToDelete(pdf);
                      setDeleteDialogOpen(true);
                    }}
                    sx={{ 
                      color: 'error.main', 
                      '&:hover': {
                        color: 'error.dark',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </PDFCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <StyledDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete PDF</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{pdfToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeletePDF} color="error">
            Delete
          </Button>
        </DialogActions>
      </StyledDialog>
    </LibraryContainer>
  );
};

export default PDFLibrary; 