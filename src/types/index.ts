export interface PDFFile {
  id: string;
  name: string;
  size: number;
  created: number; // timestamp
  lastAccessed?: number; // timestamp
  data: ArrayBuffer; // the actual PDF data
  thumbnail?: string; // base64 encoded thumbnail image
}

export interface PDFContextType {
  pdfFiles: PDFFile[];
  currentPDF: PDFFile | null;
  loading: boolean;
  error: string | null;
  addPDF: (file: File) => Promise<void>;
  viewPDF: (id: string) => Promise<void>;
  downloadPDF: (id: string) => Promise<void>;
  deletePDF: (id: string) => Promise<void>;
} 