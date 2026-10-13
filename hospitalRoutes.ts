import { Router, Request, Response } from 'express';
import { dbStore } from '../services/storage.ts';

const router = Router();

// Calculate distance in kilometers using Haversine formula
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// GET /api/hospitals
router.get('/', (req: Request, res: Response) => {
  const { search, type, district, userLat, userLng } = req.query;

  let results = [...dbStore.hospitals];

  if (type && type !== 'all') {
    results = results.filter((h) => h.facilityType.toLowerCase() === String(type).toLowerCase());
  }

  if (district && district !== 'all') {
    results = results.filter((h) => h.district.toLowerCase() === String(district).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase().trim();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.district.toLowerCase().includes(q) ||
        h.pincode.includes(q) ||
        h.address.toLowerCase().includes(q) ||
        (h.village && h.village.toLowerCase().includes(q)) ||
        (h.taluk && h.taluk.toLowerCase().includes(q))
    );
  }

  // Calculate distances if coordinates provided
  if (userLat && userLng) {
    const uLat = parseFloat(String(userLat));
    const uLng = parseFloat(String(userLng));
    if (!isNaN(uLat) && !isNaN(uLng)) {
      results = results.map((h) => ({
        ...h,
        distanceKm: calculateDistanceKm(uLat, uLng, h.lat, h.lng),
      }));
      results.sort((a: any, b: any) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }
  }

  return res.json({
    total: results.length,
    hospitals: results,
  });
});

// GET /api/hospitals/:id
router.get('/:id', (req: Request, res: Response) => {
  const hospital = dbStore.hospitals.find((h) => h._id === req.params.id);
  if (!hospital) {
    return res.status(404).json({ error: 'Hospital or clinic facility not found.' });
  }
  return res.json({ hospital });
});

export default router;
