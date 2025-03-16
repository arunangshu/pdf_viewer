# PDF Viewer Application

A modern React application for viewing, storing, and managing PDF files. This application allows users to upload PDFs, view them in a browser, and download them. All PDFs are stored locally, so they persist between sessions.

## Features

- **Upload PDFs**: Drag and drop or click to upload PDF files
- **View PDFs**: View PDF files directly in the browser
- **Download PDFs**: Download your stored PDF files
- **Persistent Storage**: All PDFs are stored locally, so they persist between sessions
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Dark mode with neon accents theme for a sleek, modern look

## Tech Stack

- **React**: Frontend library for building user interfaces
- **TypeScript**: For type safety and better developer experience
- **Material UI**: Component library for modern UI elements
- **PDF.js**: For rendering PDFs in the browser
- **Dexie**: IndexedDB wrapper for client-side storage
- **Styled Components**: For component-based styling

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pdf-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create an optimized production build in the `build` folder.

## Project Structure

```
pdf_viewer/
├── public/                # Public assets
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Service functions
│   ├── styles/            # Global styles and themes
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── index.tsx          # Application entry point
└── package.json           # Project dependencies and scripts
```

## License

This project is licensed under the MIT License.
