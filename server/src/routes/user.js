import { Router } from 'express';
import Event from '../models/Event.js';
import Prayer from '../models/Prayer.js';

const router = Router();

router.get('/events', async (_req, res) => {
  const events = await Event.find().sort({ startAt: 1 }).limit(200);
  res.json({ events });
});

router.post('/prayers', async (req, res) => {
  const { text, churchId } = req.body;
  const prayer = await Prayer.create({ text, churchId, status: 'pending' });
  res.json({ prayer });
});

export default router;

