import { Router, Request, Response } from 'express';
import { dbStore } from '../services/storage.ts';

const router = Router();

// GET /api/doctors
router.get('/', (req: Request, res: Response) => {
  const { speciality, teleconsult, search } = req.query;

  let results = [...dbStore.doctors];

  if (speciality && speciality !== 'all') {
    results = results.filter((d) => d.speciality.toLowerCase().includes(String(speciality).toLowerCase()));
  }

  if (teleconsult === 'true') {
    results = results.filter((d) => d.teleconsultAvailable);
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.speciality.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q) ||
        d.languages.some((l) => l.toLowerCase().includes(q))
    );
  }

  return res.json({
    total: results.length,
    doctors: results,
  });
});

// GET /api/doctors/:id
router.get('/:id', (req: Request, res: Response) => {
  const doctor = dbStore.doctors.find((d) => d._id === req.params.id);
  if (!doctor) {
    return res.status(404).json({ error: 'Healthcare professional not found.' });
  }
  return res.json({ doctor });
});

export default router;
