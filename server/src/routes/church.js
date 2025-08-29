import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Church from '../models/Church.js';
import Event from '../models/Event.js';
import Prayer from '../models/Prayer.js';

const router = Router();

router.use(requireAuth);

router.get('/me', async (req, res) => {
  const church = await Church.findById(req.user?.uid);
  res.json({ church });
});

router.post('/profile', async (req, res) => {
  const { name, logoUrl, address, phone, email, responsible, pixKey } = req.body;
  const church = await Church.findByIdAndUpdate(
    req.user?.uid,
    { name, logoUrl, address, phone, email, responsible, pixKey },
    { new: true, upsert: true }
  );
  res.json({ church });
});

router.get('/events', async (_req, res) => {
  const events = await Event.find().sort({ startAt: 1 }).limit(200);
  res.json({ events });
});

router.post('/events', async (req, res) => {
  const event = await Event.create({ ...req.body, churchId: req.user?.uid });
  res.json({ event });
});

router.get('/prayers', async (_req, res) => {
  const prayers = await Prayer.find().sort({ createdAt: -1 }).limit(200);
  res.json({ prayers });
});

router.patch('/prayers/:id', async (req, res) => {
  const updated = await Prayer.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json({ prayer: updated });
});

export default router;

