import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UniversityAdminDashboard from './pages/UniversityAdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <div className="min-h-screen bg-black text-white">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/super-admin" 
              element={
                <ProtectedRoute role="super-admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/university-admin" 
              element={
                <ProtectedRoute role="university-admin">
                  <UniversityAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/faculty" 
              element={
                <ProtectedRoute role="faculty">
                  <FacultyDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;
