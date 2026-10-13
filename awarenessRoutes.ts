import { Router, Request, Response } from 'express';
import { dbStore } from '../services/storage.ts';

const router = Router();

// GET /api/health-awareness
router.get('/', (req: Request, res: Response) => {
  const { category, search, lang } = req.query;

  let results = [...dbStore.articles];

  if (category && category !== 'all') {
    results = results.filter((a) => a.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (a) =>
        a.titleEn.toLowerCase().includes(q) ||
        a.titleHi.includes(q) ||
        a.titleTe.includes(q) ||
        a.summaryEn.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q)
    );
  }

  return res.json({
    total: results.length,
    articles: results,
    activeLanguage: lang || 'en',
  });
});

// GET /api/health-awareness/:id
router.get('/:id', (req: Request, res: Response) => {
  const article = dbStore.articles.find((a) => a._id === req.params.id || a.articleId === req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Health article not found.' });
  }
  return res.json({ article });
});

export default router;
