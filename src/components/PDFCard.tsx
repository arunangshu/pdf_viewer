import React from 'react';
import { Card, CardContent, CardActions, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import { PDFFile } from '../types';
import { formatFileSize, formatDate } from '../utils/helpers';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  background: 'linear-gradient(145deg, #1e1e3f, #1A1A2E)',
  border: '1px solid rgba(0, 191, 255, 0.1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 191, 255, 0.2)',
  },
}));

const ThumbnailContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '180px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: '#1A1A2E',
}));

const Thumbnail = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const CardContentStyled = styled(CardContent)({
  flexGrow: 1,
  paddingBottom: '8px',
});

const ActionButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
    color: theme.palette.primary.light,
  },
}));

interface PDFCardProps {
  pdf: PDFFile;
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

const PDFCard: React.FC<PDFCardProps> = ({ pdf, onView, onDownload, onDelete }) => {
  const { id, name, size, created, thumbnail } = pdf;

  return (
    <StyledCard className="fade-in">
      <ThumbnailContainer>
        <Thumbnail src={thumbnail} alt={name} />
      </ThumbnailContainer>
      
      <CardContentStyled>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          noWrap
          sx={{
            color: '#EAEAEA',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          {name}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Size: {formatFileSize(size)}
        </Typography>
        
        <Typography variant="body2" color="textSecondary">
          Added: {formatDate(created)}
        </Typography>
      </CardContentStyled>
      
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px' }}>
        <Tooltip title="View">
          <ActionButton onClick={() => onView(id)} aria-label="view" size="small">
            <VisibilityIcon />
          </ActionButton>
        </Tooltip>
        
        <Tooltip title="Download">
          <ActionButton onClick={() => onDownload(id)} aria-label="download" size="small">
            <GetAppIcon />
          </ActionButton>
        </Tooltip>
        
        <Tooltip title="Delete">
          <ActionButton 
            onClick={() => onDelete(id)} 
            aria-label="delete" 
            size="small"
            sx={{ color: '#FF4C4C' }}
          >
            <DeleteIcon />
          </ActionButton>
        </Tooltip>
      </CardActions>
    </StyledCard>
  );
};

export default PDFCard; 