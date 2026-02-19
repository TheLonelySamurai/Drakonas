import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProjectType from "./views/ProjectType"

createRoot(document.body).render(
  <StrictMode>
    <ProjectType/>
  </StrictMode>,
)
