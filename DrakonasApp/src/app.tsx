import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Backend from './callBackend';
import DrawingCanvas from './views/drawingCanvas';

createRoot(document.body).render(
  <StrictMode>
    <Backend/>
    <DrawingCanvas/>
  </StrictMode>,
)
