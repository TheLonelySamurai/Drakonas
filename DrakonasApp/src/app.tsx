import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Backend from './callBackend';
import PageTemplate from './views/Partials/MainPageTemplate';
import DrawingCanvas from './views/drawingCanvas';
import ProjectType from "./views/ProjectType"
import Workshop from "./views/Workshop"
import ProjectPage from "./views/ProjectPage"
import Settings from "./views/Settings"
import ProfilePage from "./views/ProfilePage"
import Main from 'electron/main';
import Login from './views/Login'
import SignUp from './views/SignUp'
createRoot(document.body).render(
  <MemoryRouter initialEntries={['/login', '/signup', '/project', '/projecttype', '/workshop', '/settings', '/profile']} initialIndex={4}>
    <Routes>
      <Route path="/signup" element={<PageTemplate Page={SignUp} id="signup-page" />} />
      <Route path="/login" element={<PageTemplate Page={Login} id="login-page"/>} />
      <Route path="/project" element={<PageTemplate Page={ProjectPage} id="project-page" />} />
      <Route path="/projecttype" element={<PageTemplate Page={ProjectType} id="project-page" />} />
      <Route path="/workshop" element={<PageTemplate Page={Workshop} id="workshop-page" />} />
      <Route path="/settings" element={<PageTemplate Page={Settings} id="settings-page" />} />
      <Route path="/profile" element={<PageTemplate Page={ProfilePage} id="profile-page" />} />
    </Routes>
  </MemoryRouter>
);

