import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import SeekerDashboard from './pages/SeekerDashboard';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminUsers from './pages/AdminUsers';
import LinkedInImport from './pages/LinkedInImport';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950">
          <Navbar />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Seeker */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['SEEKER']}><SeekerDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['SEEKER']}><Profile /></ProtectedRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminJobs /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/linkedin" element={<ProtectedRoute allowedRoles={['ADMIN']}><LinkedInImport /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
