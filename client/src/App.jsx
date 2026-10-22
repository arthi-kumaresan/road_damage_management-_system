import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Public Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

// Citizen Pages
import CitizenDashboard from './pages/CitizenDashboard';
import ReportDamage from './pages/ReportDamage';
import ComplaintDetails from './pages/ComplaintDetails';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import AdminUsers from './pages/AdminUsers';

// Maintenance Pages
import MaintenanceDashboard from './pages/MaintenanceDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Shared Complaint Details Route (protected) */}
              <Route
                path="/complaints/:id"
                element={
                  <ProtectedRoute allowedRoles={['CITIZEN', 'ADMIN', 'MAINTENANCE_TEAM']}>
                    <ComplaintDetails />
                  </ProtectedRoute>
                }
              />

              {/* Citizen Routes */}
              <Route
                path="/citizen/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['CITIZEN']}>
                    <CitizenDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/citizen/report"
                element={
                  <ProtectedRoute allowedRoles={['CITIZEN']}>
                    <ReportDamage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/complaints"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminComplaints />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* Maintenance Routes */}
              <Route
                path="/maintenance/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['MAINTENANCE_TEAM']}>
                    <MaintenanceDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800">
            <p>
              &copy; {new Date().getFullYear()} Road Damage Reporting & Maintenance Tracking System. Academic Final-Year Project.
            </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
