import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProjectPage from "./views/ProjectPage"

createRoot(document.body).render(
  <StrictMode>
    <ProjectPage/>
  </StrictMode>,
)
