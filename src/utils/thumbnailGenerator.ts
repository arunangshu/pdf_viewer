/**
 * Utility for generating thumbnails from PDF files
 */

/**
 * Generates a thumbnail for a PDF file
 * @param file The PDF file to generate a thumbnail from
 * @returns A Promise that resolves to a base64-encoded thumbnail image
 */
export const generatePDFThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    try {
      // Create a canvas to render the thumbnail
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 280; // Approximate aspect ratio for a PDF page
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        // Fallback to generic thumbnail if canvas context is not available
        return resolve(createGenericThumbnail());
      }
      
      // Create a generic PDF thumbnail with file information
      // Fill with a light gray background
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw a border
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      // Draw a PDF icon
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(50, 70, 100, 140);
      
      // Add PDF text
      ctx.fillStyle = '#a0a0a0';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('PDF', 80, 150);
      
      // Add file name (truncated if necessary)
      const fileName = file.name.length > 20 
        ? file.name.substring(0, 17) + '...' 
        : file.name;
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#333';
      ctx.fillText(fileName, 10, 30);
      
      // Add file size
      const fileSize = formatFileSize(file.size);
      ctx.fillText(fileSize, 10, 50);
      
      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      resolve(createGenericThumbnail());
    }
  });
};

/**
 * Creates a generic PDF thumbnail
 * @returns A base64-encoded generic PDF thumbnail
 */
const createGenericThumbnail = (): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 280;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    // If we can't get a canvas context, return an empty data URL
    return 'data:image/png;base64,';
  }
  
  // Fill with a light gray background
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw a border
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
  // Draw a PDF icon
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(50, 70, 100, 140);
  
  ctx.fillStyle = '#a0a0a0';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('PDF', 80, 150);
  
  return canvas.toDataURL('image/png');
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes The file size in bytes
 * @returns A formatted string representing the file size
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default generatePDFThumbnail; 