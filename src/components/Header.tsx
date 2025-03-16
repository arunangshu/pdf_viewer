import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1A1A2E, #24243e)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  borderBottom: '1px solid rgba(0, 191, 255, 0.1)',
}));

const GlassyToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(10px)',
    zIndex: -1,
  }
}));

const Logo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    fontSize: '32px',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  background: 'linear-gradient(90deg, #00BFFF, #0099CC)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  letterSpacing: '1px',
}));

const Header: React.FC = () => {
  return (
    <StyledAppBar position="sticky">
      <GlassyToolbar>
        <Logo>
          <PictureAsPdfIcon />
          <Title variant="h6">PDF Viewer</Title>
        </Logo>
      </GlassyToolbar>
    </StyledAppBar>
  );
};

export default Header; 