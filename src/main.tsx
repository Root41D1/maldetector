
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add console logs to debug rendering
console.log("Main script executing");
const rootElement = document.getElementById("root");

if (rootElement) {
  console.log("Root element found, rendering app");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found in the DOM");
}
