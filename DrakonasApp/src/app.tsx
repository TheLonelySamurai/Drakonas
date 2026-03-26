import React from 'react';
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
  <StrictMode>
    <Backend/>
    <PageTemplate Page={SignUp} id="signup-page" />
    <PageTemplate Page={Login} id="login-page"/>
    <PageTemplate Page={ProjectPage} id="project-page" />
    <PageTemplate Page={Workshop} id="workshop-page"startPage={true}/>
    <PageTemplate Page={ProfilePage} id="profile-page" />
    <PageTemplate Page={Settings} id="settings-page"    />
    <PageTemplate Page={ProjectType} id="project-type-page" />
    <PageTemplate Page={Login} id="login-page"/>
    <PageTemplate Page={SignUp} id="signup-page"/>
  </StrictMode>,
)
