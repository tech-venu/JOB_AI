import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import JobsPage from './pages/public/JobsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Job Seeker Pages
import JobSeekerDashboard from './pages/jobseeker/Dashboard';
import ResumePage from './pages/jobseeker/ResumePage';
import RecommendationsPage from './pages/jobseeker/RecommendationsPage';
import SkillGapPage from './pages/jobseeker/SkillGapPage';
import CareerAssistantPage from './pages/jobseeker/CareerAssistantPage';
import ApplicationsPage from './pages/jobseeker/ApplicationsPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import CreateJobPage from './pages/recruiter/CreateJobPage';
import JobApplicantsPage from './pages/recruiter/JobApplicantsPage';
import AnalyticsPage from './pages/recruiter/AnalyticsPage';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

// Shared Profile & Settings Page
import ProfileSettingsPage from './pages/common/ProfileSettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Job Seeker Protected Routes */}
              <Route
                path="/jobseeker/dashboard"
                element={
                  <RoleRoute allowedRoles={['jobseeker']}>
                    <JobSeekerDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/jobseeker/resume"
                element={
                  <RoleRoute allowedRoles={['jobseeker', 'admin']}>
                    <ResumePage />
                  </RoleRoute>
                }
              />
              <Route
                path="/jobseeker/recommendations"
                element={
                  <RoleRoute allowedRoles={['jobseeker']}>
                    <RecommendationsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/jobseeker/skill-gap"
                element={
                  <RoleRoute allowedRoles={['jobseeker']}>
                    <SkillGapPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/jobseeker/assistant"
                element={
                  <RoleRoute allowedRoles={['jobseeker']}>
                    <CareerAssistantPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/jobseeker/applications"
                element={
                  <RoleRoute allowedRoles={['jobseeker']}>
                    <ApplicationsPage />
                  </RoleRoute>
                }
              />

              {/* Recruiter Protected Routes */}
              <Route
                path="/recruiter/dashboard"
                element={
                  <RoleRoute allowedRoles={['recruiter', 'admin']}>
                    <RecruiterDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/recruiter/jobs/create"
                element={
                  <RoleRoute allowedRoles={['recruiter', 'admin']}>
                    <CreateJobPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/recruiter/jobs/:jobId/edit"
                element={
                  <RoleRoute allowedRoles={['recruiter', 'admin']}>
                    <CreateJobPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/recruiter/jobs/:jobId/applicants"
                element={
                  <RoleRoute allowedRoles={['recruiter', 'admin']}>
                    <JobApplicantsPage />
                  </RoleRoute>
                }
              />
              <Route
                path="/recruiter/analytics"
                element={
                  <RoleRoute allowedRoles={['recruiter', 'admin']}>
                    <AnalyticsPage />
                  </RoleRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />

              {/* Shared Profile & Settings Protected Route */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <ProfileSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

