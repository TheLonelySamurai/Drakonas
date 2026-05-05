import React from 'react';
import { createMemoryRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import './index.css';
import PageTemplate from './views/Partials/MainPageTemplate';
import ProjectType from "./views/ProjectType";
import Workshop from "./views/Workshop";
import ProjectPage from "./views/ProjectPage";
import Settings from "./views/Settings";
import ProfilePage from "./views/ProfilePage";
import Login from './views/Login';
import SignUp from './views/SignUp';

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<Navigate to="/project" replace />} />
    <Route path="/signup" element={<PageTemplate Page={SignUp} id="signup-page" />} />
    <Route path="/login" element={<PageTemplate Page={Login} id="login-page" />} />
    <Route path="/project" element={<PageTemplate Page={ProjectPage} id="project-page" />} />
    <Route path="/projecttype" element={<PageTemplate Page={ProjectType} id="project-type-page" />} />
    <Route path="/workshop" element={<PageTemplate Page={Workshop} id="workshop-page" />} />
    <Route path="/settings" element={<PageTemplate Page={Settings} id="settings-page" />} />
    <Route path="/profile" element={<PageTemplate Page={ProfilePage} id="profile-page" />} />
    <Route path="*" element={<div>404 - Page Not Found</div>} />
  </>
);

const router = createMemoryRouter(routes, {
  initialEntries: ['/login', '/signup', '/project', '/projecttype', '/workshop', '/settings', '/profile'],
  initialIndex: 2,
});

export default function App() {
  return <RouterProvider router={router} />;
}
