import { Router, Request, Response } from 'express';
import { dbStore, StoredAppointment } from '../services/storage.ts';
import { authenticateUser, requireRole, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// POST /api/appointments (Book appointment)
router.post('/', authenticateUser, (req: AuthRequest, res: Response) => {
  try {
    const {
      doctorId,
      doctorName,
      doctorSpeciality,
      hospitalName,
      date,
      timeSlot,
      consultationType,
      symptomsSummary,
      patientPhone,
      patientVillage,
    } = req.body;

    if (!doctorId || !doctorName || !date || !timeSlot) {
      return res.status(400).json({ error: 'Doctor, consultation date, and time slot are required.' });
    }

    const patient = dbStore.users.find((u) => u._id === req.user?._id);
    const patientName = patient?.name || req.user?.name || 'Patient';
    const finalPhone = patientPhone || patient?.phone || req.user?.phone || 'Not provided';
    const finalVillage = patientVillage || patient?.village || '';

    const newAppointment: StoredAppointment = {
      _id: `apt-${Date.now()}`,
      patientId: req.user!._id,
      patientName,
      patientPhone: finalPhone,
      patientVillage: finalVillage,
      doctorId,
      doctorName,
      doctorSpeciality: doctorSpeciality || 'General Medicine',
      hospitalName: hospitalName || 'Primary Health Centre',
      date,
      timeSlot,
      consultationType: consultationType === 'remote-teleconsult' ? 'remote-teleconsult' : 'in-person',
      symptomsSummary: symptomsSummary || '',
      status: 'pending',
      teleconsultMeetingId: consultationType === 'remote-teleconsult' ? `GRAMIN-TELE-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
      createdAt: new Date().toISOString(),
    };

    dbStore.appointments.unshift(newAppointment);

    return res.status(201).json({
      message: 'Appointment requested successfully! The PHC coordinator will confirm shortly.',
      appointment: newAppointment,
    });
  } catch (error: any) {
    console.error('Appointment booking error:', error);
    return res.status(500).json({ error: 'Failed to schedule appointment.' });
  }
});

// GET /api/appointments/my (Current user's appointments)
router.get('/my', authenticateUser, (req: AuthRequest, res: Response) => {
  const userAppointments = dbStore.appointments.filter((a) => a.patientId === req.user?._id);
  return res.json({ appointments: userAppointments });
});

// GET /api/appointments/all (Healthcare administrator / PHC staff)
router.get('/all', authenticateUser, requireRole(['admin']), (_req: AuthRequest, res: Response) => {
  return res.json({
    total: dbStore.appointments.length,
    appointments: dbStore.appointments,
  });
});

// PUT /api/appointments/:id/status (Admin updates status)
router.put('/:id/status', authenticateUser, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const { status, doctorNotes, teleconsultMeetingId } = req.body;
  const apt = dbStore.appointments.find((a) => a._id === req.params.id);

  if (!apt) {
    return res.status(404).json({ error: 'Appointment not found.' });
  }

  if (status && ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    apt.status = status;
  }

  if (doctorNotes !== undefined) {
    apt.doctorNotes = doctorNotes;
  }

  if (teleconsultMeetingId) {
    apt.teleconsultMeetingId = teleconsultMeetingId;
  }

  return res.json({
    message: `Appointment updated to "${apt.status}".`,
    appointment: apt,
  });
});

export default router;
