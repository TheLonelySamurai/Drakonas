import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app'; // Import your route memory here

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />); 
// // Allow hot module replacement requests without resetting application states
// if (module.hot) {
//   module.hot.accept();
// }