import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/tts?text=...&lang=te
router.get('/', async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.query;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text query parameter is required.' });
    }

    const targetLang = (lang === 'hi' ? 'hi' : lang === 'te' ? 'te' : 'en');
    const cleanText = text.replace(/[#*_`]/g, '').slice(0, 300); // Clean and constrain to query length

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      cleanText
    )}&tl=${targetLang}&client=tw-ob`;

    const audioRes = await fetch(ttsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!audioRes.ok) {
      return res.status(502).json({ error: 'Failed to fetch speech audio from TTS provider.' });
    }

    const audioBuffer = await audioRes.arrayBuffer();

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache common health phrases
    return res.send(Buffer.from(audioBuffer));
  } catch (error: any) {
    console.error('TTS audio proxy error:', error);
    return res.status(500).json({ error: 'Internal server error while processing speech audio.' });
  }
});

export default router;
