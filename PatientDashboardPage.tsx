import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Activity,
  Shield,
  Video,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import { Appointment, HealthAssessment, Language } from '../types';
import { TeleconsultRoomModal } from '../components/TeleconsultRoomModal.tsx';

interface PatientDashboardProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const PatientDashboardPage: React.FC<PatientDashboardProps> = ({ setActiveTab, openAuthModal }) => {
  const { user, updateUser } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [assessments, setAssessments] = useState<HealthAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [name, setName] = useState(user?.name || '');
  const [village, setVillage] = useState(user?.village || '');
  const [district, setDistrict] = useState(user?.district || '');
  const [consentGiven, setConsentGiven] = useState(user?.consentGiven ?? true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Selected assessment detail modal
  const [selectedAssessment, setSelectedAssessment] = useState<HealthAssessment | null>(null);

  // Selected teleconsult meeting
  const [activeTeleconsult, setActiveTeleconsult] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!user) return;

    setName(user.name);
    setVillage(user.village || '');
    setDistrict(user.district || '');
    setConsentGiven(user.consentGiven ?? true);

    async function loadData() {
      setLoading(true);
      try {
        const [apts, asms] = await Promise.all([
          api.getMyAppointments(),
          api.getMyAssessments(),
        ]);
        setAppointments(apts);
        setAssessments(asms);
      } catch (err) {
        console.error('Failed to load patient history:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const updated = await api.updateProfile({
        name,
        village,
        district,
        preferredLanguage: language,
        consentGiven,
      });
      updateUser(updated);
      setProfileMsg('Profile and preferences updated successfully.');
    } catch (err: any) {
      setProfileMsg('Failed to update profile: ' + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <User className="w-12 h-12 text-emerald-700 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Please Sign In</h2>
        <p className="text-xs text-stone-600">
          Sign in or register to access your appointments, previous symptom assessments, and rural health profile.
        </p>
        <button
          onClick={openAuthModal}
          className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-sm"
        >
          Open Login Modal
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Digital Health Passport</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {t('patientDashboardTitle')}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Welcome back, <span className="font-bold text-stone-900">{user.name}</span> • Phone: {user.phone} • Village: {user.village || 'Registered Village'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('assistant')}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Activity className="w-4 h-4" />
            <span>New Symptom Check</span>
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Visit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Appointments & History (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* APPOINTMENTS SECTION */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700" />
                <span>{t('myAppointments')}</span>
              </h3>
              <span className="text-xs text-stone-500 font-semibold">{appointments.length} Records</span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-stone-400">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="py-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-500 text-xs">
                No appointment requests yet.{' '}
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Schedule one now →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt._id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white hover:border-emerald-300 transition space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{apt.doctorName}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : apt.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : apt.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">{apt.doctorSpeciality} • {apt.hospitalName}</p>
                      </div>

                      <div className="text-xs font-semibold text-stone-700 bg-white px-2.5 py-1 rounded-md border border-stone-200 self-start sm:self-auto">
                        {apt.date} at {apt.timeSlot}
                      </div>
                    </div>

                    {apt.symptomsSummary && (
                      <p className="text-xs text-stone-600 italic bg-white/70 p-2 rounded-lg border border-stone-100">
                        "{apt.symptomsSummary}"
                      </p>
                    )}

                    {/* Teleconsult Join action if remote */}
                    {apt.consultationType === 'remote-teleconsult' && (
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-teal-800 flex items-center gap-1">
                          <Video className="w-3.5 h-3.5 text-teal-600" />
                          Remote Video Consultation
                        </span>
                        <button
                          onClick={() => setActiveTeleconsult(apt)}
                          className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Enter Telemedicine Room</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PREVIOUS ASSESSMENTS SECTION */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-700" />
                <span>{t('previousAssessments')}</span>
              </h3>
              <span className="text-xs text-stone-500 font-semibold">{assessments.length} Checks</span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-stone-400">Loading history...</div>
            ) : assessments.length === 0 ? (
              <div className="py-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-500 text-xs">
                No previous symptom checks on record.{' '}
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Run your first AI check →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.map((asm) => (
                  <div
                    key={asm._id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-white transition flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                            asm.triageLevel === 'urgent'
                              ? 'bg-red-600'
                              : asm.triageLevel === 'moderate'
                              ? 'bg-amber-600'
                              : 'bg-emerald-600'
                          }`}
                        >
                          {asm.triageLevel} Priority
                        </span>
                        <span className="text-xs font-bold text-stone-800">{asm.patientName} ({asm.age} y/o)</span>
                        <span className="text-[11px] text-stone-400">
                          {new Date(asm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 font-medium">
                        Symptoms: {asm.symptoms}
                      </p>
                      <p className="text-xs text-stone-500 line-clamp-1">
                        {asm.assessmentSummary}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedAssessment(asm)}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Profile & Privacy Settings */}
        <div className="space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4"
          >
            <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-700" />
              <span>{t('profileSettings')}</span>
            </h3>

            {profileMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
                {profileMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Village / Mandal</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Shamshabad Rural"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Ranga Reddy"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-stone-600 leading-tight">
                  Consent to securely store symptom logs for primary triage continuity with rural PHC staff.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile Changes</span>
            </button>
          </form>

          {/* Rural Health Card Info */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-200">AYUSHMAN BHARAT LINK</span>
              <span className="px-2 py-0.5 rounded bg-emerald-700 text-[10px] font-bold">VERIFIED</span>
            </div>
            <div className="font-mono text-sm tracking-wider">
              GSS-{user._id.replace('user-', '').slice(-6).toUpperCase()}-RURAL
            </div>
            <p className="text-[11px] text-emerald-100/90 leading-tight">
              Present this digital registration at any empanelled PHC or CHC in your district for accelerated token dispensing.
            </p>
          </div>
        </div>
      </div>

      {/* Teleconsult Room Modal */}
      <TeleconsultRoomModal
        appointment={activeTeleconsult}
        onClose={() => setActiveTeleconsult(null)}
      />

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-stone-900">
                Symptom Assessment #{selectedAssessment._id}
              </h3>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-3">
              <p className="font-semibold text-stone-800">{selectedAssessment.assessmentSummary}</p>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                <div className="font-bold text-stone-700">Reported Symptoms:</div>
                <div>{selectedAssessment.symptoms} ({selectedAssessment.durationDays} days)</div>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-stone-700">Possible Conditions:</div>
                <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                  {selectedAssessment.possibleConcerns.map((c, i) => (
                    <li key={i}>{c.name} ({c.likelihood})</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-stone-700">Recommended Steps:</div>
                <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                  {selectedAssessment.recommendedActions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pt-3 border-t flex justify-end">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="px-4 py-1.5 bg-stone-800 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
