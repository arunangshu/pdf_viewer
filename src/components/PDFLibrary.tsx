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
  CardMedia
} from '@mui/material';
import { styled } from '@mui/material/styles';
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
}));

const PDFCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const PDFCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
}));

const NoResultsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  width: '100%',
}));

const PDFThumbnail = styled(CardMedia)(({ theme }) => ({
  height: 280,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
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
          }}
        />
      </SearchContainer>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
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
        <Grid container spacing={3}>
          {pdfs.map((pdf) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={pdf.id}>
              <PDFCard>
                <PDFThumbnail
                  image={pdf.thumbnail || ''}
                  title={pdf.name}
                  onClick={() => handleSelectPDF(pdf)}
                  sx={{ cursor: 'pointer' }}
                />
                <PDFCardContent>
                  <Typography variant="h6" noWrap title={pdf.name}>
                    {pdf.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Size: {formatFileSize(pdf.size)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Added: {formatDate(pdf.created)}
                  </Typography>
                  {pdf.lastAccessed && (
                    <Typography variant="body2" color="textSecondary">
                      Last viewed: {formatDate(pdf.lastAccessed)}
                    </Typography>
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
                    color="error"
                    onClick={() => {
                      setPdfToDelete(pdf);
                      setDeleteDialogOpen(true);
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
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
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
      </Dialog>
    </LibraryContainer>
  );
};

export default PDFLibrary; 