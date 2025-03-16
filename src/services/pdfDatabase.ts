import Dexie from 'dexie';
import { generatePDFThumbnail } from '../utils/thumbnailGenerator';

// Define the PDF file interface
export interface PDFFile {
  id: string;
  name: string;
  size: number;
  created: number; // timestamp
  lastAccessed?: number; // timestamp
  data: ArrayBuffer; // the actual PDF data
  thumbnail?: string; // base64 encoded thumbnail image
}

// Define the database
class PDFDatabase extends Dexie {
  pdfFiles: Dexie.Table<PDFFile, string>;

  constructor() {
    super('PDFViewerDatabase');
    this.version(1).stores({
      pdfFiles: 'id, name, size, created, lastAccessed'
    });
    this.pdfFiles = this.table('pdfFiles');
  }
}

// Create a database instance
const db = new PDFDatabase();

// PDF Database Service
export const pdfDatabaseService = {
  // Get all PDFs
  getAllPDFs: async (): Promise<PDFFile[]> => {
    return await db.pdfFiles.toArray();
  },

  // Add a new PDF
  addPDF: async (file: File): Promise<PDFFile> => {
    const buffer = await file.arrayBuffer();
    
    // Generate thumbnail
    const thumbnail = await generatePDFThumbnail(file);
    
    const pdfFile: PDFFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      created: Date.now(),
      lastAccessed: Date.now(),
      data: buffer,
      thumbnail
    };

    await db.pdfFiles.add(pdfFile);
    return pdfFile;
  },

  // Get a PDF by ID
  getPDF: async (id: string): Promise<PDFFile | undefined> => {
    const pdfFile = await db.pdfFiles.get(id);
    if (pdfFile) {
      // Update last accessed timestamp
      await db.pdfFiles.update(id, { lastAccessed: Date.now() });
    }
    return pdfFile;
  },

  // Delete a PDF
  deletePDF: async (id: string): Promise<void> => {
    await db.pdfFiles.delete(id);
  },

  // Search PDFs by name
  searchPDFs: async (query: string): Promise<PDFFile[]> => {
    const allPDFs = await db.pdfFiles.toArray();
    if (!query) return allPDFs;
    
    const lowerQuery = query.toLowerCase();
    return allPDFs.filter(pdf => 
      pdf.name.toLowerCase().includes(lowerQuery)
    );
  }
};

export default pdfDatabaseService; 