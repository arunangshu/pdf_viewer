import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', 'Poppins', sans-serif;
    background: #1A1A2E;
    color: #EAEAEA;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1A1A2E;
  }

  ::-webkit-scrollbar-thumb {
    background: #00BFFF;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #0099cc;
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  /* Glassy effect for components */
  .glassy {
    background: rgba(26, 26, 46, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export default GlobalStyles; 