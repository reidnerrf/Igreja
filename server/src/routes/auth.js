import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    if (!email || !role) return res.status(400).json({ error: 'email and role required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'email already registered' });
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({ email, passwordHash, role, name });
    const token = jwt.sign({ uid: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    if (user.passwordHash) {
      const ok = await bcrypt.compare(password || '', user.passwordHash);
      if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    }
    const token = jwt.sign({ uid: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'login failed' });
  }
});

export default router;

