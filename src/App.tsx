import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Box, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PDFProvider } from './contexts/PDFContext';
import theme from './styles/theme';
import GlobalStyles from './styles/globalStyles';
import Header from './components/Header';
import PDFUploader from './components/PDFUploader';
import PDFList from './components/PDFList';
import PDFViewer from './components/PDFViewer';
import { usePDF } from './contexts/PDFContext';

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

const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: 'rgba(0, 191, 255, 0.1)',
  margin: theme.spacing(3, 0),
}));

const AppContent: React.FC = () => {
  const { currentPDF } = usePDF();
  const [showViewer, setShowViewer] = useState<boolean>(false);

  // Show viewer when a PDF is selected
  React.useEffect(() => {
    if (currentPDF) {
      setShowViewer(true);
    }
  }, [currentPDF]);

  const handleCloseViewer = () => {
    setShowViewer(false);
  };

  return (
    <>
      <Header />
      <MainContainer maxWidth="lg">
        <Section>
          <SectionTitle variant="h5">Upload PDF</SectionTitle>
          <PDFUploader />
        </Section>

        <StyledDivider />

        <Section>
          <SectionTitle variant="h5">My PDF Library</SectionTitle>
          <PDFList />
        </Section>
      </MainContainer>

      {showViewer && currentPDF && (
        <PDFViewer onClose={handleCloseViewer} />
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles />
      <PDFProvider>
        <AppContent />
      </PDFProvider>
    </ThemeProvider>
  );
};

export default App;
