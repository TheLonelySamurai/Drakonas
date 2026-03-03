import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Backend from './callBackend';
import DrawingCanvas from './views/drawingCanvas';
import ProjectType from "./views/ProjectType"
import Workshop from "./views/Workshop"
import ProjectPage from "./views/ProjectPage"
import Settings from "./views/Settings"
import ProfilePage from "./views/ProfilePage"
import WorkshopToolbar from "./views/WorkshopToolbar"
createRoot(document.body).render(
  <StrictMode>
  <WorkshopToolbar/>
  </StrictMode>,
)
