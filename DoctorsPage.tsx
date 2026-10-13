import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Video,
  Calendar,
  Clock,
  CheckCircle2,
  Building,
  Languages,
  Star,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Doctor, Appointment } from '../types';
import { TeleconsultRoomModal } from '../components/TeleconsultRoomModal.tsx';

interface DoctorsPageProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
  prefillDoctorReason?: string;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({ setActiveTab, openAuthModal, prefillDoctorReason }) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSpeciality, setFilterSpeciality] = useState('all');
  const [teleconsultOnly, setTeleconsultOnly] = useState(false);

  // Booking Modal
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [consultType, setConsultType] = useState<'in-person' | 'remote-teleconsult'>('remote-teleconsult');
  const [symptomsSummary, setSymptomsSummary] = useState(prefillDoctorReason || '');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [patientVillage, setPatientVillage] = useState(user?.village || '');

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Active teleconsult room test
  const [activeTeleconsult, setActiveTeleconsult] = useState<Appointment | null>(null);

  useEffect(() => {
    async function loadDoctors() {
      setLoading(true);
      try {
        const data = await api.getDoctors({
          speciality: filterSpeciality,
          teleconsult: teleconsultOnly,
        });
        setDoctors(data);
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, [filterSpeciality, teleconsultOnly]);

  const handleOpenBooking = (doc: Doctor) => {
    if (!user) {
      openAuthModal();
      return;
    }
    setSelectedDoctor(doc);
    setBookingError(null);
    setConfirmedAppointment(null);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const res = await api.bookAppointment({
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
        doctorSpeciality: selectedDoctor.speciality,
        hospitalName: selectedDoctor.hospitalName,
        date: bookingDate,
        timeSlot,
        consultationType: consultType,
        symptomsSummary,
        patientPhone,
        patientVillage,
      });

      setConfirmedAppointment(res.appointment);
    } catch (err: any) {
      setBookingError(err.message || 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          <span>Village Medical Consultations</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {t('doctorsTitle')}
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl">
          {t('doctorsSubtitle')}
        </p>
      </div>

      {/* Filter controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-semibold">Speciality:</span>
          {['all', 'General Medicine', 'Gynecology', 'Pediatrics', 'Ayush'].map((sp) => (
            <button
              key={sp}
              onClick={() => setFilterSpeciality(sp)}
              className={`px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
                filterSpeciality === sp
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {sp === 'all' ? 'All Specialities' : sp}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-emerald-900 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <input
            type="checkbox"
            checked={teleconsultOnly}
            onChange={(e) => setTeleconsultOnly(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500"
          />
          <Video className="w-4 h-4 text-emerald-700" />
          <span>Show Telemedicine Enabled Only</span>
        </label>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-stone-500 text-sm">
            Loading registered medical practitioners...
          </div>
        ) : doctors.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-sm">
            No doctors found matching the selected filter.
          </div>
        ) : (
          doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-400 transition flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={doc.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&h=100&fit=crop&crop=faces'}
                    alt={doc.name}
                    className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{doc.name}</h3>
                    <p className="text-xs font-semibold text-emerald-700">{doc.speciality}</p>
                    <p className="text-[11px] text-stone-500">{doc.qualification}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-stone-400 font-normal">({doc.experienceYears} yrs exp)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{doc.hospitalName}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Languages: {doc.languages.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{doc.timing}</span>
                  </div>
                </div>

                {doc.teleconsultAvailable && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-[11px] font-bold border border-teal-200">
                    <Video className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t('teleconsultBadge')}</span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-500 block">Consultation Fee</span>
                  <span className="font-black text-stone-900 text-sm">
                    {doc.fee === 0 ? 'FREE (Govt PHC)' : `₹${doc.fee}`}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenBooking(doc)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('bookAppointment')}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOOKING MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-100 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  Appointment Scheduling
                </span>
                <h3 className="text-lg font-bold">{selectedDoctor.name}</h3>
                <p className="text-xs text-emerald-100">{selectedDoctor.speciality} • {selectedDoctor.hospitalName}</p>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {confirmedAppointment ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-extrabold text-stone-900">{t('bookingSuccess')}</h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Your appointment has been registered with {confirmedAppointment.hospitalName}. Status is currently{' '}
                    <span className="font-bold text-amber-600">Pending PHC Coordinator Confirmation</span>.
                  </p>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1.5">
                    <div>
                      <span className="text-stone-500 font-semibold">Appointment ID: </span>
                      <span className="font-mono font-bold text-stone-900">{confirmedAppointment._id}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-semibold">Scheduled Date: </span>
                      <span className="font-bold text-stone-900">{confirmedAppointment.date} at {confirmedAppointment.timeSlot}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-semibold">Mode: </span>
                      <span className="font-bold uppercase text-emerald-700">{confirmedAppointment.consultationType}</span>
                    </div>
                    {confirmedAppointment.teleconsultMeetingId && (
                      <div className="pt-1 text-teal-800 font-bold">
                        Telemedicine Room ID: {confirmedAppointment.teleconsultMeetingId}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 justify-center pt-2">
                    {confirmedAppointment.consultationType === 'remote-teleconsult' && (
                      <button
                        onClick={() => {
                          setActiveTeleconsult(confirmedAppointment);
                          setSelectedDoctor(null);
                        }}
                        className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Video className="w-4 h-4" />
                        <span>Preview Teleconsult Room</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedDoctor(null);
                        setActiveTab('patient-dashboard');
                      }}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition"
                    >
                      View in Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {bookingError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Consultation Mode Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      {t('consultationType')}
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setConsultType('remote-teleconsult')}
                        className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition ${
                          consultType === 'remote-teleconsult'
                            ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold'
                            : 'border-stone-200 bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-teal-600" />
                          <span>Remote Video Call</span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-normal">Connect from village home</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConsultType('in-person')}
                        className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition ${
                          consultType === 'in-person'
                            ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold'
                            : 'border-stone-200 bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Building className="w-4 h-4 text-emerald-600" />
                          <span>In-Person at PHC</span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-normal">Physical clinic visit</span>
                      </button>
                    </div>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">{t('dateLabel')}</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">{t('timeSlotLabel')}</label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value="09:30 AM">09:30 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:30 PM">03:30 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Patient Phone & Village */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Village / Mandal</label>
                      <input
                        type="text"
                        value={patientVillage}
                        onChange={(e) => setPatientVillage(e.target.value)}
                        placeholder="e.g. Shamshabad Rural"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Symptoms Summary */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">{t('reasonLabel')}</label>
                    <textarea
                      rows={2}
                      value={symptomsSummary}
                      onChange={(e) => setSymptomsSummary(e.target.value)}
                      placeholder="Describe what symptoms or condition you need consultation for..."
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scheduling...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('confirmBooking')}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Teleconsult Virtual Room Modal */}
      <TeleconsultRoomModal
        appointment={activeTeleconsult}
        onClose={() => setActiveTeleconsult(null)}
      />
    </div>
  );
};
