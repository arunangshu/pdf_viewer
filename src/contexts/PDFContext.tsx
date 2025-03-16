import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PDFFile, PDFContextType } from '../types';
import { pdfService } from '../services/pdfService';

// Create the context with default values
const PDFContext = createContext<PDFContextType>({
  pdfFiles: [],
  currentPDF: null,
  loading: false,
  error: null,
  addPDF: async () => {},
  viewPDF: async () => {},
  downloadPDF: async () => {},
  deletePDF: async () => {},
});

// Context provider component
export const PDFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [currentPDF, setCurrentPDF] = useState<PDFFile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load all PDFs on initial mount
  useEffect(() => {
    const loadPDFs = async () => {
      setLoading(true);
      try {
        const files = await pdfService.getAllPDFs();
        setPdfFiles(files);
      } catch (err) {
        console.error('Error loading PDFs:', err);
        setError('Failed to load PDFs');
      } finally {
        setLoading(false);
      }
    };

    loadPDFs();
  }, []);

  // Add a new PDF
  const addPDF = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      // Check if it's a PDF
      if (!file.type.includes('pdf')) {
        throw new Error('Only PDF files are supported');
      }
      
      const newPDF = await pdfService.addPDF(file);
      setPdfFiles(prevFiles => [...prevFiles, newPDF]);
      setCurrentPDF(newPDF);
    } catch (err: any) {
      console.error('Error adding PDF:', err);
      setError(err.message || 'Failed to add PDF');
    } finally {
      setLoading(false);
    }
  };

  // View a PDF
  const viewPDF = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const pdf = await pdfService.getPDF(id);
      if (pdf) {
        setCurrentPDF(pdf);
      } else {
        throw new Error('PDF not found');
      }
    } catch (err: any) {
      console.error('Error viewing PDF:', err);
      setError(err.message || 'Failed to view PDF');
    } finally {
      setLoading(false);
    }
  };

  // Download a PDF
  const downloadPDF = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await pdfService.downloadPDF(id);
    } catch (err: any) {
      console.error('Error downloading PDF:', err);
      setError(err.message || 'Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  // Delete a PDF
  const deletePDF = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await pdfService.deletePDF(id);
      setPdfFiles(prevFiles => prevFiles.filter(file => file.id !== id));
      if (currentPDF && currentPDF.id === id) {
        setCurrentPDF(null);
      }
    } catch (err: any) {
      console.error('Error deleting PDF:', err);
      setError(err.message || 'Failed to delete PDF');
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value: PDFContextType = {
    pdfFiles,
    currentPDF,
    loading,
    error,
    addPDF,
    viewPDF,
    downloadPDF,
    deletePDF,
  };

  return <PDFContext.Provider value={value}>{children}</PDFContext.Provider>;
};

// Custom hook for using the PDF context
export const usePDF = () => useContext(PDFContext); 