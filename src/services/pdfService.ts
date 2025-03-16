import Dexie from 'dexie';
import { PDFFile } from '../types';
import { PDFDocument } from 'pdf-lib';

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

// Generate a thumbnail from the first page of a PDF
async function generateThumbnail(pdfBuffer: ArrayBuffer): Promise<string> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    
    if (pages.length === 0) {
      throw new Error('PDF has no pages');
    }
    
    const firstPage = pages[0];
    
    // Create a new document for the thumbnail
    const thumbnailDoc = await PDFDocument.create();
    const [thumbnailPage] = await thumbnailDoc.copyPages(pdfDoc, [0]);
    thumbnailDoc.addPage(thumbnailPage);
    
    const thumbnailBytes = await thumbnailDoc.saveAsBase64({ dataUri: true });
    return thumbnailBytes;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    // Return a placeholder thumbnail
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAnRJREFUeJzt07ERwzAQBMHvJOiAE3JGzsRhOBkrA6MYGwVR1DnA7OZ+uXs+c653z7k+f9v2mHvtY+69a86193nWvHPvfc+5X3vNfc99n+szW+/+Yt/3z2XO9TNbaz5ba+29n8/W2lprve+ztdba+7O11tpae67nWa39/xsRmfNY+Xt7/t67Z3vPc8/9nOf5vM+5n3vPec7ne+fW93nmuZ/nud/rPvdz3+f3f2+/930+5/t5fp5z7vf3AXgYEQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQkREQmfH4OkDUAZZCsJAAAAAElFTkSuQmCC';
  }
}

// PDF Service
export const pdfService = {
  // Get all PDFs
  getAllPDFs: async (): Promise<PDFFile[]> => {
    const pdfs = await db.pdfFiles.toArray();
    console.log('Retrieved PDFs:', pdfs);
    return pdfs;
  },

  // Add a new PDF
  addPDF: async (file: File): Promise<PDFFile> => {
    const buffer = await file.arrayBuffer();
    console.log('PDF Buffer:', buffer);
    const thumbnail = await generateThumbnail(buffer);
    
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
    console.log('Added PDF:', pdfFile);
    return pdfFile;
  },

  // Get a PDF by ID
  getPDF: async (id: string): Promise<PDFFile | undefined> => {
    const pdfFile = await db.pdfFiles.get(id);
    console.log('Retrieved PDF:', pdfFile);
    if (pdfFile) {
      // Update last accessed timestamp
      await db.pdfFiles.update(id, { lastAccessed: Date.now() });
    }
    return pdfFile;
  },

  // Delete a PDF
  deletePDF: async (id: string): Promise<void> => {
    await db.pdfFiles.delete(id);
    console.log('Deleted PDF with ID:', id);
  },

  // Download a PDF
  downloadPDF: async (id: string): Promise<void> => {
    const pdfFile = await db.pdfFiles.get(id);
    if (!pdfFile) {
      throw new Error('PDF not found');
    }

    // Create a Blob from the PDF data
    const blob = new Blob([pdfFile.data], { type: 'application/pdf' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFile.name;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
}; 