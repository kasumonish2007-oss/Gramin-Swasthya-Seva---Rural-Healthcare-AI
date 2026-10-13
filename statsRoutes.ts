import { Router, Response } from 'express';
import { dbStore } from '../services/storage.ts';
import { authenticateUser, requireRole, AuthRequest } from '../middleware/auth.ts';

const router = Router();

router.get('/', authenticateUser, requireRole(['admin']), (_req: AuthRequest, res: Response) => {
  const totalUsers = dbStore.users.length;
  const patientsCount = dbStore.users.filter((u) => u.role === 'patient').length;
  const appointmentsCount = dbStore.appointments.length;
  const pendingAppointments = dbStore.appointments.filter((a) => a.status === 'pending').length;
  const confirmedAppointments = dbStore.appointments.filter((a) => a.status === 'confirmed').length;
  const teleconsultAppointments = dbStore.appointments.filter((a) => a.consultationType === 'remote-teleconsult').length;
  const urgentAssessments = dbStore.assessments.filter((a) => a.triageLevel === 'urgent').length;
  const totalAssessments = dbStore.assessments.length;

  return res.json({
    metrics: {
      totalUsers,
      patientsCount,
      totalAppointments: appointmentsCount,
      pendingAppointments,
      confirmedAppointments,
      teleconsultAppointments,
      totalAssessments,
      urgentAssessments,
      totalHospitals: dbStore.hospitals.length,
      totalDoctors: dbStore.doctors.length,
      totalArticles: dbStore.articles.length,
    },
    recentAssessments: dbStore.assessments.slice(0, 5),
  });
});

export default router;
