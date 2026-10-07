import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { DonorDashboard } from './pages/donor/DonorDashboard';
import { CreateDonationPage } from './pages/donor/CreateDonationPage';
import { DonationDetailPage } from './pages/donor/DonationDetailPage';
import { ImpactAnalyticsPage } from './pages/donor/ImpactAnalyticsPage';

import { NGODashboard } from './pages/ngo/NGODashboard';
import { NGOImpactPage } from './pages/ngo/NGOImpactPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<HowItWorksPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Donor Routes */}
              <Route path="/donor/dashboard" element={<DonorDashboard />} />
              <Route path="/donor/create-donation" element={<CreateDonationPage />} />
              <Route path="/donor/donations/:id" element={<DonationDetailPage />} />
              <Route path="/donor/impact" element={<ImpactAnalyticsPage />} />

              {/* NGO Routes */}
              <Route path="/ngo/dashboard" element={<NGODashboard />} />
              <Route path="/ngo/impact" element={<NGOImpactPage />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
