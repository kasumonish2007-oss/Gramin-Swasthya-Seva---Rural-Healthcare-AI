import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { EmergencyBar } from './components/EmergencyBar.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AiAssessmentPage } from './pages/AiAssessmentPage.tsx';
import { HospitalsPage } from './pages/HospitalsPage.tsx';
import { DoctorsPage } from './pages/DoctorsPage.tsx';
import { HealthAwarenessPage } from './pages/HealthAwarenessPage.tsx';
import { PatientDashboardPage } from './pages/PatientDashboardPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [prefillDoctorReason, setPrefillDoctorReason] = useState<string>('');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* 24x7 Emergency Helplines Bar */}
      <EmergencyBar />

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            setActiveTab={setActiveTab}
            openAuthModal={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'assistant' && (
          <AiAssessmentPage
            setActiveTab={setActiveTab}
            setPrefillDoctorReason={setPrefillDoctorReason}
          />
        )}

        {activeTab === 'hospitals' && <HospitalsPage />}

        {activeTab === 'doctors' && (
          <DoctorsPage
            setActiveTab={setActiveTab}
            openAuthModal={() => setAuthModalOpen(true)}
            prefillDoctorReason={prefillDoctorReason}
          />
        )}

        {activeTab === 'awareness' && <HealthAwarenessPage />}

        {activeTab === 'patient-dashboard' && (
          <PatientDashboardPage
            setActiveTab={setActiveTab}
            openAuthModal={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'admin-dashboard' && <AdminDashboardPage />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Login / Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </LanguageProvider>
  );
}
