import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './app/App.tsx';
import { AdminLoginPage } from './app/pages/AdminLoginPage';
import { ProtectedAdminRoute } from './app/components/ProtectedAdminRoute';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={(
            <ProtectedAdminRoute>
              <App initialPage="admin" />
            </ProtectedAdminRoute>
          )}
        />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
