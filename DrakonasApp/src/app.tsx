import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Settings from "./views/Settings"

createRoot(document.body).render(
  <StrictMode>
    <Settings/>
  </StrictMode>,
)
