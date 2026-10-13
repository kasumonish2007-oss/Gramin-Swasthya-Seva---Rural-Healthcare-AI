import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Calendar,
  Activity,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  FileText,
  Search,
  Filter,
  AlertTriangle,
  Loader2,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { Appointment } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<{ [id: string]: string }>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [allApts, adminStats] = await Promise.all([
        api.getAllAppointments(),
        api.getAdminStats(),
      ]);
      setAppointments(allApts);
      setStats(adminStats.metrics);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const note = notesInput[id];
      await api.updateAppointmentStatus(id, {
        status: newStatus,
        doctorNotes: note || undefined,
      });
      await loadData();
    } catch (err: any) {
      alert('Failed to update appointment: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientPhone.includes(searchQuery) ||
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>PHC Command & Healthcare Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Rural Health Administrator Console
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Logged in as <span className="font-bold text-stone-900">{user?.name}</span> (Health Officer) • Coordinating PHC appointments, telemedicine sessions, and triage alerts.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition self-start sm:self-auto"
        >
          ↻ Refresh Data
        </button>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-xs font-bold text-stone-500 uppercase">Total Citizens</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{stats.totalUsers}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">{stats.patientsCount} active patients</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-xs font-bold text-stone-500 uppercase">Total Appointments</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{stats.totalAppointments}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">{stats.confirmedAppointments} confirmed</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-xs font-bold text-stone-500 uppercase">Pending Review</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{stats.pendingAppointments}</div>
            <div className="text-[11px] text-amber-800 font-semibold mt-0.5">Requires PHC action</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-xs font-bold text-stone-500 uppercase">Teleconsultations</div>
            <div className="text-2xl font-black text-teal-700 mt-1">{stats.teleconsultAppointments}</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Video / audio triage</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-xs font-bold text-stone-500 uppercase">High Risk Alerts</div>
            <div className="text-2xl font-black text-red-600 mt-1">{stats.urgentAssessments}</div>
            <div className="text-[11px] text-red-700 font-semibold mt-0.5">Emergency triage flags</div>
          </div>
        </div>
      )}

      {/* Appointments Management Panel */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>Community Consultation Requests</span>
            </h3>
            <p className="text-xs text-stone-500">
              Review and manage appointment requests from rural patients and assign PHC consultations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient, phone..."
                className="pl-8 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none"
              />
            </div>

            <div className="flex bg-stone-100 p-0.5 rounded-lg text-xs font-semibold">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md capitalize transition ${
                    filterStatus === st ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-bold">
                <th className="py-3 px-3">Patient Details</th>
                <th className="py-3 px-3">Doctor & Facility</th>
                <th className="py-3 px-3">Date & Slot</th>
                <th className="py-3 px-3">Mode</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Doctor Notes</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">Loading appointments...</td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">No appointments found matching filter.</td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-stone-50/60">
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900">{apt.patientName}</div>
                      <div className="text-stone-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{apt.patientPhone}</span>
                      </div>
                      {apt.patientVillage && (
                        <div className="text-[10px] text-stone-400">{apt.patientVillage}</div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900">{apt.doctorName}</div>
                      <div className="text-[11px] text-stone-500">{apt.hospitalName}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-800">{apt.date}</div>
                      <div className="text-[11px] text-stone-500">{apt.timeSlot}</div>
                    </td>

                    <td className="py-3 px-3">
                      {apt.consultationType === 'remote-teleconsult' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold">
                          <Video className="w-3 h-3" />
                          Telemedicine
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-bold">
                          In-Person
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
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
                    </td>

                    <td className="py-3 px-3 max-w-[200px]">
                      {apt.doctorNotes ? (
                        <div className="text-[11px] text-stone-700 bg-stone-100 p-1.5 rounded">
                          {apt.doctorNotes}
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="Add clinical note..."
                          value={notesInput[apt._id] || ''}
                          onChange={(e) =>
                            setNotesInput({ ...notesInput, [apt._id]: e.target.value })
                          }
                          className="w-full text-[11px] px-2 py-1 border border-stone-200 rounded"
                        />
                      )}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.status === 'pending' && (
                          <button
                            disabled={updatingId === apt._id}
                            onClick={() => handleUpdateStatus(apt._id, 'confirmed')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold transition cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}

                        {apt.status === 'confirmed' && (
                          <button
                            disabled={updatingId === apt._id}
                            onClick={() => handleUpdateStatus(apt._id, 'completed')}
                            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-[11px] font-bold transition cursor-pointer"
                          >
                            Complete
                          </button>
                        )}

                        {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                          <button
                            disabled={updatingId === apt._id}
                            onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[11px] font-semibold transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
