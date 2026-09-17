import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import MainLayout, { ProtectedRoute } from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RegisterMemberPage from './pages/RegisterMemberPage';
import RegisterTrainerPage from './pages/RegisterTrainerPage';
import CurrentStatusPage from './pages/CurrentStatusPage';
import MemberListPage from './pages/MemberListPage';
import TrainerListPage from './pages/TrainerListPage';
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="members/register" element={<RegisterMemberPage />} />
            <Route path="members" element={<MemberListPage />} />
            <Route path="trainers/register" element={<RegisterTrainerPage />} />
            <Route path="trainers" element={<TrainerListPage />} />
            <Route path="status" element={<CurrentStatusPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl
          theme="light"
        />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
