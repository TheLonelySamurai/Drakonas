import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Backend from './callBackend';
import DrawingCanvas from './views/drawingCanvas';
import ProjectType from "./views/ProjectType"
import Workshop from "./views/Workshop"

createRoot(document.body).render(
  <StrictMode>
    <ProjectType/>
    <Workshop/>
  </StrictMode>,
)
