import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Workshop from "./views/Workshop"

createRoot(document.body).render(
  <StrictMode>
    <Workshop/>
  </StrictMode>,
)
