import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DrawingCanvas from './drawingCanvas'

createRoot(document.body).render(
  <StrictMode>
    <DrawingCanvas/>
  </StrictMode>,
)
